/**
 * Root-level function for jwt.internalnote.com/guide or demo.internalnote.com/guide
 * This allows clean URLs without /api prefix
 *
 * Forwards to the main implementation in /api/guide.ts
 * Supports both internalnote.com and demo.internalnote.com origins
 */

import { onRequestPost, onRequestOptions } from './api/guide'

export { onRequestPost, onRequestOptions }
