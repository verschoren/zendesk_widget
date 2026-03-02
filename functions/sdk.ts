/**
 * Root-level function for jwt.internalnote.com/sdk
 * This allows clean URLs without /api prefix
 *
 * Forwards to the main implementation in /api/sdk.ts
 */

import { onRequestPost, onRequestOptions } from './api/sdk'

export { onRequestPost, onRequestOptions }
