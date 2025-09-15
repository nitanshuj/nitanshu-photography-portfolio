import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className={`relative z-10 text-center px-6 section-fade ${isVisible ? 'visible' : ''}`}>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          Nitanshu Joshi
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Data Scientist by Day, Photographer by Passion
        </p>
        <button 
          onClick={scrollToGallery}
          className="btn-hero inline-flex items-center space-x-2"
        >
          <span>Explore My Work</span>
          <ChevronDown className="animate-bounce" size={20} />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-accent" size={32} />
      </div>
    </section>
  );
};

export default Hero;