import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages, getCloudinaryUrl, cloudinaryTransforms, type CloudinaryImage } from '@/lib/cloudinary';
import LikeButton from './LikeButton';

const categories = ['All', 'Nature', 'Landscapes', 'Street', 'Skies', 'Man-Made-Marvels'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredImages, setFilteredImages] = useState<CloudinaryImage[]>(galleryImages);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const galleryElement = document.getElementById('gallery');
    if (galleryElement) {
      observer.observe(galleryElement);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === activeCategory));
    }
  }, [activeCategory]);

  const openLightbox = (imageId: string) => {
    setSelectedImage(imageId);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;

    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(filteredImages[newIndex].id);
  };

  const selectedImageData = filteredImages.find(img => img.id === selectedImage);

  return (
    <section id="gallery" className="py-20 px-6">
      <div className="container mx-auto">
        <div className={`text-center mb-16 section-fade ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            My Clicks
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of my finest work, capturing the beauty of the world through my lens
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 section-fade ${isVisible ? 'visible' : ''}`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-bounce ${
                activeCategory === category
                  ? 'bg-accent text-accent-foreground glow-accent'
                  : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground hover:glow-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className={`columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 section-fade ${isVisible ? 'visible' : ''}`}>
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item relative break-inside-avoid mb-6"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openLightbox(image.id)}
            >
              <div className="relative group cursor-pointer">
                <img
                  src={getCloudinaryUrl(image.publicId, cloudinaryTransforms.gallery)}
                  alt={image.alt}
                  className="w-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                  <LikeButton imageId={image.id} />
                </div>
                {/* Optional: Add image title overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && selectedImageData && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-card/80 rounded-full text-card-foreground hover:bg-card transition-smooth"
              >
                <X size={24} />
              </button>
              
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-card/80 rounded-full text-card-foreground hover:bg-card transition-smooth"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-card/80 rounded-full text-card-foreground hover:bg-card transition-smooth"
              >
                <ChevronRight size={24} />
              </button>
              
              <img
                src={getCloudinaryUrl(selectedImageData.publicId, cloudinaryTransforms.lightbox)}
                alt={selectedImageData.alt}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;