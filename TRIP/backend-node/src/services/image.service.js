import { createApi } from 'unsplash-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || 'dummy_key',
  fetch: fetch,
});

export class ImageService {
  static async getDestinationImage(query) {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.log("[ImageService] No Unsplash API key. Returning default.");
      return "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop";
    }

    try {
      // Extract a simple keyword from the query (e.g., if query is "Plan a trip to Bali", we search "Bali destination")
      // We'll just pass the full query + " landmark" to Unsplash, which often does well enough.
      const result = await unsplash.search.getPhotos({
        query: `${query} landmark landscape`,
        page: 1,
        perPage: 1,
        orientation: 'landscape',
      });

      if (result.errors) {
        console.error('[ImageService] Unsplash API error:', result.errors[0]);
        return "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop";
      } else {
        const photo = result.response.results[0];
        if (photo && photo.urls && photo.urls.regular) {
          return photo.urls.regular;
        }
      }
    } catch (e) {
      console.error("[ImageService] Failed to fetch image:", e);
    }
    return "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop";
  }

  static async getSpecificPhoto(photoId) {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return `https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop`;
    }
    
    try {
      const result = await unsplash.photos.get({ photoId });
      if (result.errors) {
        console.error('[ImageService] Unsplash photo error:', result.errors[0]);
        return null;
      }
      return result.response.urls.regular;
    } catch (e) {
      console.error("[ImageService] Failed to fetch specific photo:", e);
      return null;
    }
  }

  static async listPhotos(page = 1, perPage = 10) {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return [];
    }
    
    try {
      const result = await unsplash.photos.list({ page, perPage });
      if (result.errors) {
        console.error('[ImageService] Unsplash list error:', result.errors[0]);
        return [];
      }
      return result.response.results.map(photo => photo.urls.regular);
    } catch (e) {
      console.error("[ImageService] Failed to list photos:", e);
      return [];
    }
  }
}
