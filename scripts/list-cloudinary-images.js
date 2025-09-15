// Script to list all images in your Cloudinary account
// Run with: node scripts/list-cloudinary-images.js

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET
});

async function listImages() {
  try {
    console.log('Fetching images from Cloudinary...\n');

    // Get all images
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'image'
    });

    console.log(`Found ${result.resources.length} images:\n`);

    result.resources.forEach((image, index) => {
      console.log(`${index + 1}. Public ID: "${image.public_id}"`);
      console.log(`   Format: ${image.format}`);
      console.log(`   Size: ${image.width}x${image.height}`);
      console.log(`   URL: ${image.secure_url}`);
      console.log('');
    });

    // Show images by folder structure
    console.log('\n--- FOLDER STRUCTURE ---');
    const folders = {};
    result.resources.forEach(image => {
      const parts = image.public_id.split('/');
      if (parts.length > 1) {
        const folder = parts.slice(0, -1).join('/');
        if (!folders[folder]) folders[folder] = [];
        folders[folder].push(parts[parts.length - 1]);
      } else {
        if (!folders['root']) folders['root'] = [];
        folders['root'].push(image.public_id);
      }
    });

    Object.keys(folders).forEach(folder => {
      console.log(`\n📁 ${folder}/`);
      folders[folder].forEach(file => {
        console.log(`   📄 ${file}`);
      });
    });

  } catch (error) {
    console.error('Error fetching images:', error.message);
    if (error.http_code === 401) {
      console.error('Check your API credentials in .env file');
    }
  }
}

listImages();