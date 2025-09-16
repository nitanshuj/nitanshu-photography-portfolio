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
  gallery: 'w_800,c_limit,q_auto,f_auto',  // Max width 800px, preserve aspect ratio
  hero: 'w_1920,h_1080,c_fill,q_auto,f_auto',
  portrait: 'w_500,h_600,c_fill,q_auto,f_auto',
  lightbox: 'w_1920,c_limit,q_auto,f_auto', // Max width 1920px, preserve aspect ratio
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
  { id: '6', publicId: 'starry-skies-1_blzpei', category: 'Skies', alt: 'A starry night in Bloomington, IN, USA' },
  { id: '7', publicId: 'The-Moon-1_g9ujul', category: 'Skies', alt: 'A full moon in Bloomington, IN, USA' },
  { id: '8', publicId: 'total-solar-eclipse_r93rtg', category: 'Skies', alt: 'Total Solar Eclipse' },
  { id: '9', publicId: 'The-Gate-Bridge-SF_b59raq', category: 'Man-Made-Marvels', alt: 'The Golden Gate Bridge, San Francisco' },
  { id: '10', publicId: 'The-Parthenon-Nashville-TN_at8dh6', category: 'Man-Made-Marvels', alt: 'The Parthenon, Nashville, TN' },
  { id: '11', publicId: 'stanford-university_1_iw2rjl', category: 'Man-Made-Marvels', alt: 'Stanford University, CA' },
  { id: '12', publicId: 'stanford-university_3_mj2cnd', category: 'Man-Made-Marvels', alt: 'Stanford University, CA' },
  // New images added
  { id: '13', publicId: 'Snoqualmie-Falls_svjbrb', category: 'Nature', alt: 'Snoqualmie Falls, Washington State, USA' },
  { id: '14', publicId: 'smoky-mountain-TN-1_phspvn', category: 'Nature', alt: 'Smoky Mountains, Tennessee, USA' },
  { id: '15', publicId: 'bloomington-streetview_tehr2m', category: 'Street', alt: 'Bloomington Street View, USA' },
  { id: '16', publicId: 'Chicago-downtown-2_pqwygv', category: 'Street', alt: 'Chicago Downtown, USA' },
  { id: '17', publicId: 'Chicago-downtown_ltzyzo', category: 'Street', alt: 'Chicago Downtown, USA' },
  { id: '18', publicId: 'Seattle-skyline_uehqds', category: 'Landscapes', alt: 'Seattle Skyline with Skytree view, USA' },
  { id: '19', publicId: 'Seattle-Harbor_pkp31e', category: 'Landscapes', alt: 'Seattle Harbor, USA' },
  { id: '20', publicId: 'Chicago-Skyline_t59zm4', category: 'Landscapes', alt: 'Chicago Skyline, USA' },
  { id: '21', publicId: 'Chicago-Navy-Pier_ftpozz', category: 'Landscapes', alt: 'Chicago Navy Pier, USA' },
  { id: '22', publicId: 'Trump-tower-Chicago_aasizx', category: 'Man-Made-Marvels', alt: 'Trump Tower, Chicago, USA' },
  { id: '23', publicId: 'Seattle-Sunset_tlc3rf', category: 'Skies', alt: 'Sunset in Seattle, USA' },
];

// Temporary placeholder AI images until you upload to Cloudinary
export const aiGeneratedImages: CloudinaryImage[] = [
  // { id: '1', publicId: 'samples/animals/three-dogs', category: 'Landscapes', alt: 'AI Generated Mountain Landscape' },
  // { id: '2', publicId: 'samples/food/spices', category: 'Abstract', alt: 'AI Generated Abstract Art' },
  // { id: '3', publicId: 'samples/cityscapes/tokyo-street', category: 'Futuristic', alt: 'AI Generated Futuristic Scene' },
  // { id: '4', publicId: 'samples/architecture/building-windows', category: 'Architecture', alt: 'AI Generated Architecture' },
  // { id: '5', publicId: 'samples/landscapes/grass-and-flowers', category: 'Nature', alt: 'AI Generated Nature Scene' },
  // { id: '6', publicId: 'samples/space/stars-galaxy', category: 'Space', alt: 'AI Generated Space Scene' },
];