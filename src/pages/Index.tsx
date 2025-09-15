import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import AIGenerated from "../components/AIGenerated";
import About from "../components/About";

const Index = () => {
  // Temporary debug code to check environment variables
  useEffect(() => {
    console.log('Cloud name from env:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    console.log('All env vars:', import.meta.env);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Gallery />
      <AIGenerated />
      <About />
      
      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Nitanshu Joshi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
