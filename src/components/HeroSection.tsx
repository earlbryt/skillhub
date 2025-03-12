
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, GraduationCap, Sparkles, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedBlob from '@/components/ui/animated-blob';
import FeatureCard from '@/components/ui/feature-card';
import FloatingBadge from '@/components/ui/floating-badge';
import StatCard from '@/components/ui/stat-card';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Magnetic effect for buttons
  useEffect(() => {
    const buttons = heroRef.current?.querySelectorAll('.magnetic-button');
    
    buttons?.forEach(button => {
      button.addEventListener('mousemove', (e: any) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / 8;
        const deltaY = (y - centerY) / 8;

        // Fix: Add type assertion to HTMLElement
        (button as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        (button as HTMLElement).style.transform = 'translate(0, 0)';
      });
    });

    return () => {
      buttons?.forEach(button => {
        button.removeEventListener('mousemove', () => {});
        button.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  const scrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-workshops');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background with Blobs and Patterns */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-90"></div>
        
        {/* Geometric Patterns - Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <AnimatedBlob color="bg-primary" position="top-10 left-10" />
          <AnimatedBlob color="bg-accent" position="top-0 right-0" delay="2000ms" />
          <AnimatedBlob color="bg-secondary" position="bottom-0 left-20" delay="4000ms" />
        </div>

        {/* Neural Network Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative z-10">
            {/* Floating Badge */}
            <FloatingBadge
              icon={Brain}
              text="Expert-Led Workshops"
              position="-top-12 left-4 md:-left-6"
            />

            {/* Main Content */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in">
              <span className="block mb-2">Elevate Your</span>
              <span className="relative">
                <span className="gradient-heading">
                  Professional Skills
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 400 8" fill="none">
                  <path d="M1 5.5C100 2.5 200 2.5 399 5.5" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="1" y1="5.5" x2="399" y2="5.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1"/>
                      <stop offset="0.5" stopColor="#8b5cf6"/>
                      <stop offset="1" stopColor="#d946ef"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className="block mt-2">With Interactive Workshops</span>
            </h1>

            <p className="text-xl text-foreground/70 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Join our interactive workshops designed to give you practical skills 
              that stand out in today's digital economy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="magnetic-button px-8 py-7 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
                asChild
              >
                <Link to="/register">
                  <span>Register Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="magnetic-button px-8 py-7 border-2 border-border hover:border-primary/20 hover:bg-primary/5 text-foreground transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
                onClick={scrollToFeatured}
              >
                <span>Browse Workshops</span>
                <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap items-center gap-4 text-center">
              {[
                { value: '20+', label: 'Workshops' },
                { value: '1000+', label: 'Students' },
                { value: '95%', label: 'Success Rate' }
              ].map((stat, index) => (
                <StatCard key={index} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          {/* Right Side Interactive Elements */}
          <div className="relative">
            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"></div>
            
            {/* Main Content Container */}
            <div className="relative mx-4 sm:mx-0">
              {/* Premium Badge */}
              <div className="absolute -top-6 right-4 sm:right-10 bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full shadow-xl transform -rotate-2 z-20">
                <span className="text-sm font-semibold">Premium Workshops</span>
              </div>

              {/* Main Image Container */}
              <div className="relative premium-card p-8">
                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-4">
                    <img 
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
                      alt="Web Development" 
                      className="rounded-2xl shadow-lg w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                      alt="Mobile Development"
                      className="hidden sm:block rounded-2xl shadow-lg w-full h-32 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-4">
                    <img 
                      src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                      alt="AI Workshop"
                      className="hidden sm:block rounded-2xl shadow-lg w-full h-32 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
                      alt="UI/UX Design"
                      className="rounded-2xl shadow-lg w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Interactive Features Display */}
                <div className="grid grid-cols-2 gap-4">
                  <FeatureCard
                    icon={Brain}
                    title="AI Learning"
                    description="Personalized learning paths and recommendations"
                    gradientFrom="primary"
                    gradientTo="accent"
                  />
                  
                  <FeatureCard
                    icon={Globe}
                    title="Global Experts"
                    description="Learn from industry professionals worldwide"
                    gradientFrom="accent"
                    gradientTo="secondary"
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="hidden sm:block absolute -left-16 top-1/3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 transform -rotate-6 hover:rotate-0 transition-all duration-300 border border-white/30 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Smart Learning</div>
                    <div className="text-sm text-foreground/70">Practical skills first</div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block absolute -right-16 bottom-1/3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-all duration-300 border border-white/30 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Premium Support</div>
                    <div className="text-sm text-foreground/70">Expert guidance</div>
                  </div>
                </div>
              </div>

              {/* Active Users Indicator */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center sm:space-x-3 border border-white/30 hover:shadow-2xl transition-all duration-300 max-w-[90%] sm:max-w-none mx-auto">
                <div className="flex -space-x-1.5 sm:-space-x-2 mb-2 sm:mb-0">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                  ].map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Student ${index + 1}`}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-white">25+</span>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <div className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">30 Experts Online</div>
                  <div className="flex items-center space-x-1 sm:space-x-1.5">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] sm:text-xs text-green-600 font-medium">Available Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
