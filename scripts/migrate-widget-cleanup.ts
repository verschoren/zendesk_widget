/**
 * Script to migrate all pages to use the new useZendeskWidget hook
 * This ensures proper widget cleanup when navigating between pages
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const pagesDir = join(__dirname, '../src/pages')

interface WidgetConfig {
  key: string
  type: 'messaging' | 'classic'
  hasOnLoad: boolean
  onLoadCode?: string
}

function findWidgetConfig(content: string): WidgetConfig | null {
  // Extract widget key
  const keyMatch = content.match(/key=([a-f0-9-]+)/);
  if (!keyMatch) return null

  const key = keyMatch[1]

  // Determine type based on widget API usage
  const isMessaging = content.includes("zE('messenger") || content.includes('zEMessenger')
  const type = isMessaging ? 'messaging' : 'classic'

  // Check if there's an onLoad handler
  const hasOnLoadMatch = content.match(/script\.onload\s*=\s*\(\)\s*=>\s*\{([\s\S]*?)\n\s{4}\}/m)

  return {
    key,
    type,
    hasOnLoad: !!hasOnLoadMatch,
    onLoadCode: hasOnLoadMatch ? hasOnLoadMatch[1].trim() : undefined
  }
}

function migrateFile(filePath: string) {
  console.log(`Checking ${filePath}...`)

  let content = readFileSync(filePath, 'utf-8')

  // Skip if already using useZendeskWidget
  if (content.includes('useZendeskWidget')) {
    console.log('  ✓ Already migrated')
    return
  }

  // Skip if no widget
  if (!content.includes('zdassets.com')) {
    console.log('  - No widget found')
    return
  }

  const config = findWidgetConfig(content)
  if (!config) {
    console.log('  ⚠ Could not parse widget config')
    return
  }

  console.log(`  📝 Found ${config.type} widget with key ${config.key}`)

  // Add import if not present
  if (!content.includes("from '@/hooks/useZendeskWidget'")) {
    content = content.replace(
      /import.*from '@\/types\/page'/,
      "import { PageMetadata } from '@/types/page'\nimport { useZendeskWidget } from '@/hooks/useZendeskWidget'"
    )
  }

  // Find and replace the useEffect block
  const useEffectPattern = /useEffect\(\(\) => \{[\s\S]*?document\.title = `Internal Note - \$\{metadata\.title\}`[\s\S]*?const script = document\.createElement\('script'\)[\s\S]*?script\.src = ['"]https:\/\/static\.zdassets\.com\/ekr\/snippet\.js\?key=[^'"]+['"][\s\S]*?document\.body\.appendChild\(script\)[\s\S]*?return \(\) => \{[\s\S]*?\n  \}, \[\]\)/

  if (!useEffectPattern.test(content)) {
    console.log('  ⚠ Could not find useEffect pattern to replace')
    return
  }

  // Generate new hook usage
  let hookCode = `useEffect(() => {\n    document.title = \`Internal Note - \${metadata.title}\`\n  }, [])\n\n  // Use Zendesk widget with proper cleanup\n  useZendeskWidget({\n    key: '${config.key}',\n    type: '${config.type}'`

  if (config.hasOnLoad && config.onLoadCode) {
    // Format onLoad code
    const formattedOnLoad = config.onLoadCode
      .split('\n')
      .map(line => '      ' + line)
      .join('\n')

    hookCode += `,\n    onLoad: () => {\n${formattedOnLoad}\n    }`
  }

  hookCode += '\n  })'

  // Replace the useEffect
  content = content.replace(useEffectPattern, hookCode)

  // Write back
  writeFileSync(filePath, content, 'utf-8')
  console.log('  ✅ Migrated successfully')
}

function walkDir(dir: string) {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      walkDir(filePath)
    } else if (file.endsWith('.tsx') && !file.startsWith('_')) {
      migrateFile(filePath)
    }
  }
}

console.log('🔄 Migrating Zendesk widget cleanup...\n')
walkDir(pagesDir)
console.log('\n✨ Migration complete!')
