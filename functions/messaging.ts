/**
 * Root-level function for jwt.internalnote.com/messaging
 * This allows clean URLs without /api prefix
 *
 * Forwards to the main implementation in /api/messaging.ts
 */

import { onRequestPost, onRequestOptions } from './api/messaging'

export { onRequestPost, onRequestOptions }
