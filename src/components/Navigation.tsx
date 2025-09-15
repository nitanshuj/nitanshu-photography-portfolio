import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled
          ? 'glass-effect shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="text-2xl font-bold text-gradient">
          Nitanshu Joshi
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {['Home', 'Gallery', 'About'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-foreground hover:text-accent transition-smooth font-medium"
            >
              {item}
            </button>
          ))}
          <a
            href="https://nitanshuj.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-smooth font-medium"
          >
            Main Website
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground hover:text-accent transition-smooth"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 glass-effect border-t border-border md:hidden">
            <div className="py-4 px-6 space-y-4">
              {['Home', 'Gallery', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-foreground hover:text-accent transition-smooth font-medium"
                >
                  {item}
                </button>
              ))}
              <a
                href="https://nitanshuj.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left text-foreground hover:text-accent transition-smooth font-medium"
              >
                Main Website
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;