// Cloudinary utility functions for image optimization
export const getCloudinaryUrl = (publicId: string, transformations?: string) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured, using placeholder image');
    return `https://via.placeholder.com/800x600?text=Image+Not+Found`;
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
};

// Common transformations for different use cases
export const cloudinaryTransforms = {
  thumbnail: 'w_400,h_300,c_fill,q_auto,f_auto',
  gallery: 'w_1200,h_800,c_fill,q_auto,f_auto',  // Larger gallery images
  hero: 'w_1920,h_1080,c_fill,q_auto,f_auto',
  portrait: 'w_500,h_600,c_fill,q_auto,f_auto',
  lightbox: 'w_3600,h_2025,c_fit,q_auto,f_auto', // 3/5 of original resolution (60%)
  fullsize: 'q_auto,f_auto'  // No resizing, just optimization
};

// Gallery image data structure
export interface CloudinaryImage {
  id: string;
  publicId: string;
  category: string;
  alt: string;
  tags?: string[];
}

// Your actual uploaded images from Cloudinary
export const galleryImages: CloudinaryImage[] = [
  { id: '1', publicId: 'nature-1_oq3myp', category: 'Nature', alt: 'Sitabhani National Park, India' },
  { id: '2', publicId: 'nature-2_jt36yd', category: 'Nature', alt: 'Sunset view in Bellevue' },
  { id: '3', publicId: 'landscapes-1_wrhl8a', category: 'Landscapes', alt: 'Bellevue Skyline in the evening' },
  { id: '4', publicId: 'landscapes-2_tyliqj', category: 'Landscapes', alt: 'Seattle Ferris Wheel' },
  { id: '5', publicId: 'street-1_shhazd', category: 'Street', alt: 'Street Sunset in Bellevue, WA, USA' },
];

// Temporary placeholder AI images until you upload to Cloudinary
export const aiGeneratedImages: CloudinaryImage[] = [
  { id: '1', publicId: 'samples/animals/three-dogs', category: 'Landscapes', alt: 'AI Generated Mountain Landscape' },
  { id: '2', publicId: 'samples/food/spices', category: 'Abstract', alt: 'AI Generated Abstract Art' },
  { id: '3', publicId: 'samples/cityscapes/tokyo-street', category: 'Futuristic', alt: 'AI Generated Futuristic Scene' },
  { id: '4', publicId: 'samples/architecture/building-windows', category: 'Architecture', alt: 'AI Generated Architecture' },
  { id: '5', publicId: 'samples/landscapes/grass-and-flowers', category: 'Nature', alt: 'AI Generated Nature Scene' },
  { id: '6', publicId: 'samples/space/stars-galaxy', category: 'Space', alt: 'AI Generated Space Scene' },
];