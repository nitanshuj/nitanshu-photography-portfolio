import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config();

const tursoClient = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function setupDatabase() {
  try {
    console.log('Setting up Turso database...');

    // Create the likes table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS image_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_id TEXT UNIQUE NOT NULL,
        like_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create the AI image likes table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS ai_image_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_id TEXT UNIQUE NOT NULL,
        like_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created successfully!');

    // Insert some initial data for testing
    const imageIds = [
      'gallery-1', 'gallery-2', 'gallery-3', 'gallery-4', 'gallery-5',
      'ai-1', 'ai-2', 'ai-3', 'ai-4', 'ai-5'
    ];

    const aiImageIds = ['1', '2'];

    for (const imageId of imageIds) {
      await tursoClient.execute({
        sql: 'INSERT OR IGNORE INTO image_likes (image_id, like_count) VALUES (?, ?)',
        args: [imageId, 0]
      });
    }

    for (const imageId of aiImageIds) {
      await tursoClient.execute({
        sql: 'INSERT OR IGNORE INTO ai_image_likes (image_id, like_count) VALUES (?, ?)',
        args: [imageId, 0]
      });
    }

    console.log('✅ Initial data inserted!');

    // Test the connection by getting all records
    const result = await tursoClient.execute('SELECT * FROM image_likes');
    const aiResult = await tursoClient.execute('SELECT * FROM ai_image_likes');
    console.log(`✅ Database ready! Found ${result.rows.length} image records and ${aiResult.rows.length} AI image records.`);

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    console.log('Database setup complete.');
  }
}

setupDatabase();