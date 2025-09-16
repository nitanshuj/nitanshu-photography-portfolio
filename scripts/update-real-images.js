import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config();

const tursoClient = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

// Real image data from your cloudinary.ts file
const realGalleryImages = [
  { id: '1', publicId: 'nature-1_oq3myp', category: 'Nature', alt: 'Sitabhani National Park, India' },
  { id: '2', publicId: 'nature-2_jt36yd', category: 'Nature', alt: 'Sunset view in Bellevue' },
  { id: '3', publicId: 'landscapes-1_wrhl8a', category: 'Landscapes', alt: 'Bellevue Skyline in the evening' },
  { id: '4', publicId: 'landscapes-2_tyliqj', category: 'Landscapes', alt: 'Seattle Ferris Wheel' },
  { id: '5', publicId: 'street-1_shhazd', category: 'Street', alt: 'Street Sunset in Bellevue, WA, USA' },
  { id: '6', publicId: 'starry-skies-1_blzpei', category: 'Skies', alt: 'A starry night in Bloomington, IN, USA' },
  { id: '7', publicId: 'The-Moon-1_g9ujul', category: 'Skies', alt: 'A full moon in Bloomington, IN, USA' },
  { id: '8', publicId: 'total-solar-eclipse_r93rtg', category: 'Skies', alt: 'Total Solar Eclipse' },
  { id: '9', publicId: 'The-Gate-Bridge-SF_b59raq', category: 'Man-Made-Marvels', alt: 'The Golden Gate Bridge, San Francisco' },
  { id: '10', publicId: 'The-Parthenon-Nashville-TN_at8dh6', category: 'Man-Made-Marvels', alt: 'The Parthenon, Nashville, TN' },
  { id: '11', publicId: 'stanford-university_1_iw2rjl', category: 'Man-Made-Marvels', alt: 'Stanford University, CA' },
  { id: '12', publicId: 'stanford-university_3_mj2cnd', category: 'Man-Made-Marvels', alt: 'Stanford University, CA' },
];

async function updateDatabaseWithRealImages() {
  try {
    console.log('🗑️  Clearing old mock data...');

    // Delete all existing records
    await tursoClient.execute('DELETE FROM image_likes');
    console.log('✅ Old data cleared!');

    console.log('📸 Adding real gallery images...');

    // Insert real gallery images
    for (const image of realGalleryImages) {
      await tursoClient.execute({
        sql: 'INSERT INTO image_likes (image_id, like_count) VALUES (?, ?)',
        args: [image.id, 0]
      });
      console.log(`✅ Added gallery image: ${image.alt}`);
    }

    console.log('🤖 AI Generated section is empty (coming soon)');

    // Verify the data
    const result = await tursoClient.execute('SELECT * FROM image_likes ORDER BY image_id');
    console.log(`\n🎉 Database updated successfully!`);
    console.log(`📊 Total images in database: ${result.rows.length}`);

    console.log('\n📋 Current images in database:');
    for (const row of result.rows) {
      const matchingImage = realGalleryImages.find(img => img.id === row.image_id);
      console.log(`   ID: ${row.image_id} | Likes: ${row.like_count} | ${matchingImage?.alt || 'Unknown'}`);
    }

  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
}

updateDatabaseWithRealImages();