import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
  logger.warn('Supabase credentials not found in environment variables. Database integration may fail.');
}

// Initialize Supabase Client if credentials exist
const client = (env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY) 
  ? createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY)
  : null;

// Create a dummy proxy so calling `supabase.from()` doesn't crash the server instantly,
// but rather returns an error or just no-ops depending on the usage.
export const supabase = client || new Proxy({}, {
  get: () => {
    return new Proxy(() => {}, {
      get: () => () => ({ data: null, error: new Error("Supabase is not configured in backend") }),
      apply: () => ({ data: null, error: new Error("Supabase is not configured in backend") })
    });
  }
});
