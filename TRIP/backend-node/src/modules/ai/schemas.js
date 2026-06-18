import { z } from 'zod';

export const aiChatSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  context: z.any().optional(),
  history: z.array(z.any()).optional()
});
