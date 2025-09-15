import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const contactElement = document.getElementById('contact');
    if (contactElement) {
      observer.observe(contactElement);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mailto link as fallback
    const mailtoLink = `mailto:hello@alexrivera.com?subject=Portfolio Contact from ${formData.name}&body=${formData.message}%0D%0A%0D%0AFrom: ${formData.email}`;
    window.location.href = mailtoLink;
    
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto">
        <div className={`text-center mb-16 section-fade ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Feel free to reach out to connect, collaborate, or just chat about photography and data science!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Info */}
          <div className={`section-fade ${isVisible ? 'visible' : ''}`}>
            <div className="card-gradient p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gradient">Connect With Me</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent rounded-lg">
                    <Mail className="text-accent-foreground" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <a href="mailto:nitanshuj138.us@gmail.com" className="text-muted-foreground hover:text-accent transition-colors">
                      nitanshuj138.us@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent rounded-lg">
                    <MapPin className="text-accent-foreground" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-muted-foreground">India</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="https://www.linkedin.com/in/nitanshu-joshi-ds/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-secondary/20 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <span className="font-medium">LinkedIn</span>
                </a>
                <a 
                  href="https://www.instagram.com/cloudys_misty_aperture" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-secondary/20 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <span className="font-medium">Instagram</span>
                </a>
                <a 
                  href="https://nitanshuj.github.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-secondary/20 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <span className="font-medium">Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;