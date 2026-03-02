/**
 * Root-level function for jwt.internalnote.com/chat
 * This allows clean URLs without /api prefix
 *
 * Forwards to the main implementation in /api/chat.ts
 */

import { onRequestPost, onRequestOptions } from './api/chat'

export { onRequestPost, onRequestOptions }
