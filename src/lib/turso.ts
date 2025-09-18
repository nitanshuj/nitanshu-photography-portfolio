import { createClient } from '@libsql/client';

// Check if Turso environment variables are available
const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const isTursoAvailable = TURSO_URL && TURSO_TOKEN && TURSO_URL !== 'YOUR_DATABASE_URL_HERE' && TURSO_TOKEN !== 'YOUR_AUTH_TOKEN_HERE';

const tursoClient = isTursoAvailable ? createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
}) : null;

export interface ImageLike {
  id: number;
  image_id: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

// Helper function to determine if an image is AI generated
function isAIImage(imageId: string): boolean {
  // Check if the image is being used in AI context by looking at current AI images
  // We'll import this to check against the AI images array
  return false; // We'll update this logic
}

// Helper function to get the correct table name
function getTableName(imageId: string): string {
  return isAIImage(imageId) ? 'ai_image_likes' : 'image_likes';
}

// Get like count for a specific image
export async function getLikeCount(imageId: string, isAI: boolean = false): Promise<number> {
  if (!isTursoAvailable || !tursoClient) {
    console.warn('Turso database not available, using localStorage fallback');
    // Fallback to localStorage for like counts
    try {
      const savedLikes = localStorage.getItem('image-likes');
      if (savedLikes) {
        const likesData = JSON.parse(savedLikes);
        return likesData[imageId]?.count || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 0;
    }
  }

  try {
    const tableName = isAI ? 'ai_image_likes' : 'image_likes';
    const result = await tursoClient.execute({
      sql: `SELECT like_count FROM ${tableName} WHERE image_id = ?`,
      args: [imageId]
    });

    return result.rows[0]?.like_count as number || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

// Increment like count for an image
export async function incrementLike(imageId: string, isAI: boolean = false): Promise<number> {
  if (!isTursoAvailable || !tursoClient) {
    console.warn('Turso database not available, using localStorage fallback');
    // Fallback to localStorage
    try {
      const savedLikes = localStorage.getItem('image-likes');
      const likesData = savedLikes ? JSON.parse(savedLikes) : {};
      const currentCount = likesData[imageId]?.count || 0;
      const newCount = currentCount + 1;
      likesData[imageId] = { count: newCount };
      localStorage.setItem('image-likes', JSON.stringify(likesData));
      return newCount;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 0;
    }
  }

  try {
    const tableName = isAI ? 'ai_image_likes' : 'image_likes';

    // First, try to increment existing record
    const updateResult = await tursoClient.execute({
      sql: `UPDATE ${tableName} SET like_count = like_count + 1, updated_at = CURRENT_TIMESTAMP WHERE image_id = ?`,
      args: [imageId]
    });

    // If no rows were affected, create new record
    if (updateResult.rowsAffected === 0) {
      await tursoClient.execute({
        sql: `INSERT INTO ${tableName} (image_id, like_count) VALUES (?, 1)`,
        args: [imageId]
      });
      return 1;
    }

    // Get the updated count
    const newCount = await getLikeCount(imageId, isAI);
    return newCount;
  } catch (error) {
    console.error('Error incrementing like:', error);
    throw error;
  }
}

// Decrement like count for an image
export async function decrementLike(imageId: string, isAI: boolean = false): Promise<number> {
  if (!isTursoAvailable || !tursoClient) {
    console.warn('Turso database not available, using localStorage fallback');
    // Fallback to localStorage
    try {
      const savedLikes = localStorage.getItem('image-likes');
      const likesData = savedLikes ? JSON.parse(savedLikes) : {};
      const currentCount = likesData[imageId]?.count || 0;
      const newCount = Math.max(0, currentCount - 1);
      likesData[imageId] = { count: newCount };
      localStorage.setItem('image-likes', JSON.stringify(likesData));
      return newCount;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 0;
    }
  }

  try {
    const tableName = isAI ? 'ai_image_likes' : 'image_likes';

    // Update existing record, don't allow negative counts
    await tursoClient.execute({
      sql: `UPDATE ${tableName} SET like_count = MAX(0, like_count - 1), updated_at = CURRENT_TIMESTAMP WHERE image_id = ?`,
      args: [imageId]
    });

    // Get the updated count
    const newCount = await getLikeCount(imageId, isAI);
    return newCount;
  } catch (error) {
    console.error('Error decrementing like:', error);
    throw error;
  }
}

// Get all likes (for admin/debugging)
export async function getAllLikes(): Promise<ImageLike[]> {
  try {
    const result = await tursoClient.execute('SELECT * FROM image_likes ORDER BY like_count DESC');
    return result.rows as ImageLike[];
  } catch (error) {
    console.error('Error getting all likes:', error);
    return [];
  }
}

export default tursoClient;