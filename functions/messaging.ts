/**
 * Root-level function for jwt.internalnote.com/messaging or demo.internalnote.com/messaging
 * This allows clean URLs without /api prefix
 *
 * Forwards to the main implementation in /api/messaging.ts
 * Supports both internalnote.com and demo.internalnote.com origins
 */

import { onRequestPost, onRequestOptions } from './api/messaging'

export { onRequestPost, onRequestOptions }
