import { z } from 'zod';

export const aiChatSchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000, 'Query is too long'),
  sessionId: z.string().uuid('Invalid Session ID format').or(z.string().min(10)),
  context: z.record(z.unknown()).optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).optional()
});
