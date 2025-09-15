import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages, getCloudinaryUrl, cloudinaryTransforms, type CloudinaryImage } from '@/lib/cloudinary';

const categories = ['All', 'Nature', 'Landscapes', 'Street'];

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
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 section-fade ${isVisible ? 'visible' : ''}`}>
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openLightbox(image.id)}
            >
              <img
                src={getCloudinaryUrl(image.publicId, cloudinaryTransforms.gallery)}
                alt={image.alt}
                className="w-full h-64 object-cover rounded-lg"
                loading="lazy"
              />
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