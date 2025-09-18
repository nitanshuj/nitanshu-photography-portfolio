import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { aiGeneratedImages, getCloudinaryUrl, cloudinaryTransforms, type CloudinaryImage } from '@/lib/cloudinary';
import LikeButton from './LikeButton';

const aiCategories = ['All', 'Landscape', 'Abstract', 'Futuristic', 'Architecture', 'Nature', 'Space'];

const AIGenerated = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredImages, setFilteredImages] = useState<CloudinaryImage[]>(aiGeneratedImages);
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

    const aiElement = document.getElementById('ai-generated');
    if (aiElement) {
      observer.observe(aiElement);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredImages(aiGeneratedImages);
    } else {
      setFilteredImages(aiGeneratedImages.filter(img => img.category === activeCategory));
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
    <section id="ai-generated" className="py-20 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <div className={`text-center mb-16 section-fade ${isVisible ? 'visible' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="text-accent" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">
              My AI Generated Images
            </h2>
            <Sparkles className="text-accent" size={32} />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Exploring the intersection of technology and creativity through AI-generated imagery
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 section-fade ${isVisible ? 'visible' : ''}`}>
          {aiCategories.map((category) => (
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
              className="gallery-item break-inside-avoid mb-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Like button above the image */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground truncate pr-2">
                  {image.alt}
                </span>
                <LikeButton imageId={image.id} isAI={true} />
              </div>

              <div className="relative group">
                <img
                  src={getCloudinaryUrl(image.publicId, cloudinaryTransforms.gallery)}
                  alt={image.alt}
                  className="w-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] cursor-pointer"
                  loading="lazy"
                  onClick={() => openLightbox(image.id)}
                />
                <div className="absolute bottom-2 right-2 bg-accent/90 text-accent-foreground px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                  AI
                </div>
                {/* Optional: Add hover overlay */}
                <div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg cursor-pointer"
                  onClick={() => openLightbox(image.id)}
                >
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

export default AIGenerated;