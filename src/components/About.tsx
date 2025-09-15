import { useEffect, useState } from 'react';
import { Instagram, Globe, Linkedin, Camera, Award, Users } from 'lucide-react';
import portraitImage from '@/assets/nitanshu-potrait-info.jpg';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ photos: 0, projects: 0, clients: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counters
          animateCounters();
        }
      },
      { threshold: 0.1 }
    );

    const aboutElement = document.getElementById('about');
    if (aboutElement) {
      observer.observe(aboutElement);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const targets = { photos: 200, projects: 12, clients: 5 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    Object.entries(targets).forEach(([key, target]) => {
      let current = 0;
      const step = target / steps;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, increment);
    });
  };

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto">
        <div className={`text-center mb-16 section-fade ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Data Scientist by profession, passionate hobbyist photographer by heart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Portrait & Bio */}
          <div className={`section-fade ${isVisible ? 'visible' : ''}`}>
            <div className="relative">
              <img
                src={portraitImage}
                alt="Nitanshu Joshi - Data Scientist & Photographer"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-xl glow-accent">
                <Camera size={32} />
              </div>
            </div>
          </div>

          <div className={`section-fade ${isVisible ? 'visible' : ''} space-y-6`}>
            <div className="card-gradient p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-gradient">My Journey</h3>
              <p className="text-muted-foreground mb-6">
                I'm a Data Scientist with 2+ years of experience in AI, machine learning, and LLM applications.
                My main career involves building recommendation systems, RAG solutions, and AI agents. Photography
                is purely a hobby that brings creative balance to my technical work. Through this lens, I explore
                landscapes, urban scenes, and capture everyday beauty while experimenting with AI-generated imagery
                to blend technology with artistic expression.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 mb-6">
                <a href="https://www.instagram.com/cloudys_misty_aperture" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg hover:bg-accent hover:text-accent-foreground transition-bounce">
                  <Instagram size={20} />
                </a>
                <a href="https://nitanshuj.github.io/" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg hover:bg-accent hover:text-accent-foreground transition-bounce">
                  <Globe size={20} />
                </a>
                <a href="https://www.linkedin.com/in/nitanshu-joshi-ds/" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg hover:bg-accent hover:text-accent-foreground transition-bounce">
                  <Linkedin size={20} />
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 section-fade ${isVisible ? 'visible' : ''}`}>
          <div className="text-center card-gradient p-8 rounded-2xl">
            <Camera className="mx-auto mb-4 text-accent" size={48} />
            <div className="text-4xl font-bold text-gradient mb-2">{counters.photos.toLocaleString()}+</div>
            <div className="text-muted-foreground">Photos Captured</div>
          </div>
          <div className="text-center card-gradient p-8 rounded-2xl">
            <Award className="mx-auto mb-4 text-accent" size={48} />
            <div className="text-4xl font-bold text-gradient mb-2">{counters.projects}+</div>
            <div className="text-muted-foreground">AI Projects</div>
          </div>
          <div className="text-center card-gradient p-8 rounded-2xl">
            <Users className="mx-auto mb-4 text-accent" size={48} />
            <div className="text-4xl font-bold text-gradient mb-2">{counters.clients}+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;