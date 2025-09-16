import { createClient } from '@libsql/client';

const tursoClient = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL || '',
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || '',
});

export interface ImageLike {
  id: number;
  image_id: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

// Get like count for a specific image
export async function getLikeCount(imageId: string): Promise<number> {
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT like_count FROM image_likes WHERE image_id = ?',
      args: [imageId]
    });

    return result.rows[0]?.like_count as number || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

// Increment like count for an image
export async function incrementLike(imageId: string): Promise<number> {
  try {
    // First, try to increment existing record
    const updateResult = await tursoClient.execute({
      sql: 'UPDATE image_likes SET like_count = like_count + 1, updated_at = CURRENT_TIMESTAMP WHERE image_id = ?',
      args: [imageId]
    });

    // If no rows were affected, create new record
    if (updateResult.rowsAffected === 0) {
      await tursoClient.execute({
        sql: 'INSERT INTO image_likes (image_id, like_count) VALUES (?, 1)',
        args: [imageId]
      });
      return 1;
    }

    // Get the updated count
    const newCount = await getLikeCount(imageId);
    return newCount;
  } catch (error) {
    console.error('Error incrementing like:', error);
    throw error;
  }
}

// Decrement like count for an image
export async function decrementLike(imageId: string): Promise<number> {
  try {
    // Update existing record, don't allow negative counts
    await tursoClient.execute({
      sql: 'UPDATE image_likes SET like_count = MAX(0, like_count - 1), updated_at = CURRENT_TIMESTAMP WHERE image_id = ?',
      args: [imageId]
    });

    // Get the updated count
    const newCount = await getLikeCount(imageId);
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