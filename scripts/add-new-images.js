import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config();

const tursoClient = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

// New images to add (IDs 13-23)
const newImages = [
  { id: '13', alt: 'Snoqualmie Falls, Washington State, USA', category: 'Nature' },
  { id: '14', alt: 'Smoky Mountains, Tennessee, USA', category: 'Nature' },
  { id: '15', alt: 'Bloomington Street View, USA', category: 'Street' },
  { id: '16', alt: 'Chicago Downtown, USA', category: 'Street' },
  { id: '17', alt: 'Chicago Downtown, USA', category: 'Street' },
  { id: '18', alt: 'Seattle Skyline with Skytree view, USA', category: 'Landscapes' },
  { id: '19', alt: 'Seattle Harbor, USA', category: 'Landscapes' },
  { id: '20', alt: 'Chicago Skyline, USA', category: 'Landscapes' },
  { id: '21', alt: 'Chicago Navy Pier, USA', category: 'Landscapes' },
  { id: '22', alt: 'Trump Tower, Chicago, USA', category: 'Man-Made-Marvels' },
  { id: '23', alt: 'Sunset in Seattle, USA', category: 'Skies' },
];

async function addNewImages() {
  try {
    console.log('📸 Adding new images to database...');

    // Check current count
    const currentResult = await tursoClient.execute('SELECT COUNT(*) as count FROM image_likes');
    const currentCount = currentResult.rows[0].count;
    console.log(`Current images in database: ${currentCount}`);

    // Add new images
    for (const image of newImages) {
      try {
        await tursoClient.execute({
          sql: 'INSERT INTO image_likes (image_id, like_count) VALUES (?, ?)',
          args: [image.id, 0]
        });
        console.log(`✅ Added: ${image.alt} (${image.category})`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Skipped: ${image.alt} (already exists)`);
        } else {
          console.error(`❌ Error adding ${image.alt}:`, error.message);
        }
      }
    }

    // Verify final count
    const finalResult = await tursoClient.execute('SELECT COUNT(*) as count FROM image_likes');
    const finalCount = finalResult.rows[0].count;
    console.log(`\n🎉 Database update complete!`);
    console.log(`Total images: ${finalCount} (added ${finalCount - currentCount} new images)`);

    // Show summary by category
    const categoryResult = await tursoClient.execute(`
      SELECT il.image_id, il.like_count
      FROM image_likes il
      ORDER BY CAST(il.image_id AS INTEGER)
    `);

    console.log('\n📊 All images by category:');

    // Map image IDs to their details for display
    const imageDetails = {
      '1': { category: 'Nature', alt: 'Sitabhani National Park, India' },
      '2': { category: 'Nature', alt: 'Sunset view in Bellevue' },
      '3': { category: 'Landscapes', alt: 'Bellevue Skyline in the evening' },
      '4': { category: 'Landscapes', alt: 'Seattle Ferris Wheel' },
      '5': { category: 'Street', alt: 'Street Sunset in Bellevue, WA, USA' },
      '6': { category: 'Skies', alt: 'A starry night in Bloomington, IN, USA' },
      '7': { category: 'Skies', alt: 'A full moon in Bloomington, IN, USA' },
      '8': { category: 'Skies', alt: 'Total Solar Eclipse' },
      '9': { category: 'Man-Made-Marvels', alt: 'The Golden Gate Bridge, San Francisco' },
      '10': { category: 'Man-Made-Marvels', alt: 'The Parthenon, Nashville, TN' },
      '11': { category: 'Man-Made-Marvels', alt: 'Stanford University, CA' },
      '12': { category: 'Man-Made-Marvels', alt: 'Stanford University, CA' },
      '13': { category: 'Nature', alt: 'Snoqualmie Falls, Washington State, USA' },
      '14': { category: 'Nature', alt: 'Smoky Mountains, Tennessee, USA' },
      '15': { category: 'Street', alt: 'Bloomington Street View, USA' },
      '16': { category: 'Street', alt: 'Chicago Downtown, USA' },
      '17': { category: 'Street', alt: 'Chicago Downtown, USA' },
      '18': { category: 'Landscapes', alt: 'Seattle Skyline with Skytree view, USA' },
      '19': { category: 'Landscapes', alt: 'Seattle Harbor, USA' },
      '20': { category: 'Landscapes', alt: 'Chicago Skyline, USA' },
      '21': { category: 'Landscapes', alt: 'Chicago Navy Pier, USA' },
      '22': { category: 'Man-Made-Marvels', alt: 'Trump Tower, Chicago, USA' },
      '23': { category: 'Skies', alt: 'Sunset in Seattle, USA' },
    };

    const categories = {};
    for (const row of categoryResult.rows) {
      const imageId = row.image_id;
      const details = imageDetails[imageId];
      if (details) {
        if (!categories[details.category]) {
          categories[details.category] = [];
        }
        categories[details.category].push({
          id: imageId,
          alt: details.alt,
          likes: row.like_count
        });
      }
    }

    Object.keys(categories).sort().forEach(category => {
      console.log(`\n📂 ${category} (${categories[category].length} images):`);
      categories[category].forEach(image => {
        console.log(`   ID ${image.id}: ${image.alt} (${image.likes} likes)`);
      });
    });

  } catch (error) {
    console.error('❌ Error adding new images:', error);
  }
}

addNewImages();