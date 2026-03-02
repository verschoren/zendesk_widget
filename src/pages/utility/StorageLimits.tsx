import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'storage-limits',
  category: 'storage',
  categoryName: 'Storage Limits',
  name: 'Storage Calculator',
  icon: '💾',
  path: '/utility/storage-limits',
  title: 'Zendesk Storage Calculator',
  description: 'Calculate the amount of data you need to remove to stay under the Zendesk Storage Limits'
}

export default function StorageLimits() {
  const [totalDataStorage, setTotalDataStorage] = useState<number>(0)
  const [totalFileStorage, setTotalFileStorage] = useState<number>(0)
  const [totalTickets, setTotalTickets] = useState<number>(0)
  const [goalTickets, setGoalTickets] = useState<number>(0)
  const [goalData, setGoalData] = useState<number>(0)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  const formatBytes = (input: number): [string, string] => {
    if (input >= 1024 * 1024) {
      return [(input / 1024 / 1024).toFixed(1), 'GB']
    } else if (input >= 1024) {
      return [(input / 1024).toFixed(1), 'MB']
    }
    return [input.toFixed(1), 'KB']
  }

  const formatInteger = (input: number): string => {
    const str = input.toString()
    let result = ''
    let count = 0
    for (let i = str.length - 1; i >= 0; i--) {
      if (count === 3) {
        result = '.' + result
        count = 0
      }
      result = str[i] + result
      count++
    }
    return result
  }

  // Calculate averages in KB
  const dataStorageKB = totalDataStorage * 1024 * 1024
  const fileStorageKB = totalFileStorage * 1024 * 1024

  const averageDataStorage = totalTickets > 0 ? dataStorageKB / totalTickets : 0
  const averageFileStorage = totalTickets > 0 ? fileStorageKB / totalTickets : 0

  // Calculate results based on goal tickets
  const savedDataStorage = goalTickets * averageDataStorage
  const savedFileStorage = goalTickets * averageFileStorage

  // Calculate tickets needed to clear goal data
  const goalDataKB = goalData * 1024 * 1024
  const ticketsNeeded = averageFileStorage > 0 ? goalDataKB / averageFileStorage : 0
  const dataRemoved = ticketsNeeded * averageDataStorage

  const hasData = totalTickets > 0

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div className="w-2/3">
              <h1 className="text-3xl text-licorice">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice">{metadata.description}</h2>
            </div>
            <div className="w-1/3 justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="https://internalnote.com/storage-limits/?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice shadow-xs"
              >
                Read Article
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="p-4 mx-auto max-w-3xl">
          <div>
            <h3 className="text-base font-semibold leading-6 text-licorice">Current Zendesk Storage Usage</h3>
            <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white border border-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-4">
                <dd className="mt-1 flex items-center justify-left">
                  <div className="w-32">
                    <input
                      type="number"
                      value={totalDataStorage || ''}
                      onChange={(e) => setTotalDataStorage(Number(e.target.value))}
                      className="text-center block w-full rounded-md border-0 py-1.5 text-licorice shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm"
                      placeholder="42"
                    />
                  </div>
                  <div className="ml-2 text-sm text-licorice">GB Data Storage</div>
                </dd>
                <dd className="mt-1 flex items-center justify-left">
                  <div className="w-32">
                    <input
                      type="number"
                      value={totalFileStorage || ''}
                      onChange={(e) => setTotalFileStorage(Number(e.target.value))}
                      className="text-center block w-full rounded-md border-0 py-1.5 text-licorice shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm"
                      placeholder="42"
                    />
                  </div>
                  <div className="ml-2 text-sm text-licorice">GB File Storage</div>
                </dd>
                <dd className="mt-1 flex items-center justify-left">
                  <div className="w-32">
                    <input
                      type="number"
                      value={totalTickets || ''}
                      onChange={(e) => setTotalTickets(Number(e.target.value))}
                      className="text-center block w-full rounded-md border-0 py-1.5 text-licorice shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm"
                      placeholder="1138"
                    />
                  </div>
                  <div className="ml-2 text-sm text-licorice">tickets</div>
                </dd>
              </div>
              <div className="p-4">
                <div>
                  <div className="mb-4 text-base font-normal text-licorice">Average Storage</div>
                  <div className="flex gap-2 items-center">
                    <dt className="text-sm text-licorice">Data Storage:</dt>
                    <dd className="flex items-baseline justify-between text-xl font-semibold text-green-600">
                      {hasData ? (
                        <>
                          <span>{formatBytes(averageDataStorage)[0]}</span>
                          <span className="ml-2 text-sm text-licorice">{formatBytes(averageDataStorage)[1]} per ticket</span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2 items-center">
                    <dt className="text-sm text-licorice">File Storage:</dt>
                    <dd className="flex items-baseline justify-between text-xl font-semibold text-green-600">
                      {hasData ? (
                        <>
                          <span>{formatBytes(averageFileStorage)[0]}</span>
                          <span className="ml-2 text-sm text-licorice">{formatBytes(averageFileStorage)[1]} per ticket</span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </dd>
                  </div>
                </div>
              </div>
            </dl>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-semibold leading-6 text-licorice">Reduce Storage</h3>
            <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white border border-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-4">
                <dd className="mt-1 flex items-center justify-left">
                  <div className="text-sm text-licorice">I'll delete&nbsp;</div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={goalTickets || ''}
                      onChange={(e) => setGoalTickets(Number(e.target.value))}
                      className="text-center block w-full rounded-md border-0 py-1.5 text-licorice shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm"
                      placeholder="1138"
                    />
                  </div>
                  <div className="ml-2 text-sm text-licorice">tickets</div>
                </dd>
                <dd className="mt-1">
                  {hasData && goalTickets > 0 && (
                    <>
                      <div className="mb-2 flex items-baseline text-2xl font-semibold text-red-600">
                        <span className="text-sm text-licorice">You saved&nbsp;</span>
                        <span>{formatBytes(savedDataStorage)[0]}</span>
                        <span className="ml-2 text-sm text-licorice">{formatBytes(savedDataStorage)[1]} of data Storage</span>
                      </div>
                      <div className="flex items-baseline text-2xl font-semibold text-red-600">
                        <span className="text-sm text-licorice">You saved&nbsp;</span>
                        <span>{formatBytes(savedFileStorage)[0]}</span>
                        <span className="ml-2 text-sm text-licorice">{formatBytes(savedFileStorage)[1]} of file Storage</span>
                      </div>
                    </>
                  )}
                </dd>
              </div>
              <div className="p-4">
                <dd className="mt-1 flex items-center justify-left">
                  <div className="text-sm text-licorice">I want to clear&nbsp;</div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={goalData || ''}
                      onChange={(e) => setGoalData(Number(e.target.value))}
                      className="text-center block w-full rounded-md border-0 py-1.5 text-licorice shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm"
                      placeholder="42"
                    />
                  </div>
                  <div className="ml-2 text-sm text-licorice">GB of File Storage</div>
                </dd>
                <dd className="mt-1">
                  {hasData && goalData > 0 && (
                    <>
                      <div className="mb-2 flex items-baseline text-2xl font-semibold text-red-600">
                        <span className="text-sm text-licorice">You need to delete&nbsp;</span>
                        <span>{formatInteger(ticketsNeeded.toFixed(0))}</span>
                        <span className="ml-2 text-sm text-licorice">tickets</span>
                      </div>
                      <div className="text-sm text-licorice">
                        This also removes {formatBytes(dataRemoved)[0]}{formatBytes(dataRemoved)[1]} of Data Storage
                      </div>
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
