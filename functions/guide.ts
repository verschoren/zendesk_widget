/**
 * Root-level function for jwt.internalnote.com/guide
 * This allows clean URLs without /api prefix
 *
 * Forwards to the main implementation in /api/guide.ts
 */

import { onRequestPost, onRequestOptions } from './api/guide'

export { onRequestPost, onRequestOptions }
