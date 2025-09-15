import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import AIGenerated from "../components/AIGenerated";
import About from "../components/About";

const Index = () => {
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
