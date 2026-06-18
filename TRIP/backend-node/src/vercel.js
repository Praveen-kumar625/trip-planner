import { createServer } from './api/server.js';

// Vercel Serverless Functions require the raw Express app instance
// to be exported directly, instead of calling app.listen()
const app = createServer();

export default app;
