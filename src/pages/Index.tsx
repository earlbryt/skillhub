
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkshopCard, { WorkshopProps } from '@/components/WorkshopCard';
import TestimonialCard from '@/components/TestimonialCard';
import CountdownTimer from '@/components/CountdownTimer';
import ChatbotAssistant from '@/components/ChatbotAssistant';
import HeroSection from '@/components/HeroSection';

const Index = () => {
  // Sample workshop data
  const featuredWorkshops: WorkshopProps[] = [
    {
      id: "web-dev-1",
      title: "Web Development Fundamentals",
      category: "Coding",
      date: "June 15, 2023",
      time: "10:00 AM - 2:00 PM",
      capacity: 30,
      enrolled: 24,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
      isFeatured: true
    },
    {
      id: "ui-design-1",
      title: "UI/UX Design Principles",
      category: "Design",
      date: "June 18, 2023",
      time: "1:00 PM - 5:00 PM",
      capacity: 25,
      enrolled: 22,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      isFeatured: true
    },
    {
      id: "data-1",
      title: "Data Science Essentials",
      category: "Data",
      date: "June 20, 2023",
      time: "9:00 AM - 3:00 PM",
      capacity: 20,
      enrolled: 12,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mobile-1",
      title: "Mobile App Development",
      category: "Coding",
      date: "June 22, 2023",
      time: "10:00 AM - 4:00 PM",
      capacity: 25,
      enrolled: 15,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ai-1",
      title: "AI & Machine Learning",
      category: "Technology",
      date: "June 25, 2023",
      time: "9:00 AM - 2:00 PM",
      capacity: 20,
      enrolled: 18,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Sample testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The web development workshop transformed my skills. I was able to build my first portfolio site just a week after attending!",
      workshopName: "Web Development Fundamentals"
    },
    {
      name: "David Chen",
      role: "Business Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 4,
      text: "The data science workshop gave me practical tools I could immediately use for my business analytics projects.",
      workshopName: "Data Science Essentials"
    },
    {
      name: "Amina Kamara",
      role: "Digital Media Student",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The UI/UX design workshop changed my entire approach to design thinking. The instructors were phenomenal!",
      workshopName: "UI/UX Design Principles"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Workshop */}
        <section id="featured-workshops" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-heading">Featured Workshops</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Join our most popular workshops led by industry experts and gain skills that will take your career to the next level.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/workshops">View All Workshops</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-heading">Why Choose Our Workshops?</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Our workshops are designed with students in mind, providing a unique learning experience that focuses on practical skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="premium-card p-6 card-hover"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Upcoming Workshop with Countdown */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="premium-card overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <div className="text-sm font-medium text-accent mb-2">Next Workshop</div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">Web Development Fundamentals</h2>
                  <p className="text-foreground/70 mb-6">
                    Learn the core foundations of web development, including HTML, CSS, and JavaScript. 
                    Perfect for beginners looking to start their coding journey.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2 text-primary" />
                      <span>June 15, 2023</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2 text-primary" />
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={18} className="mr-2 text-primary" />
                      <span>6 spots left</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="text-sm font-medium mb-2">Workshop begins in:</div>
                    <CountdownTimer targetDate="2023-06-15T10:00:00" />
                  </div>
                  
                  <Button size="lg" className="bg-primary hover:bg-primary/90 btn-hover" asChild>
                    <Link to="/register?workshop=web-dev-1">
                      Secure Your Spot
                    </Link>
                  </Button>
                </div>
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" 
                    alt="Web Development Workshop" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 lg:hidden">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                      <Link to="/register?workshop=web-dev-1">
                        Secure Your Spot
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-heading">What Our Students Say</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Hear from students who have transformed their skills through our workshops.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Upgrade Your Skills?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of students who have transformed their careers through our hands-on workshops. 
              Register today and start your journey to success.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 btn-hover"
              asChild
            >
              <Link to="/register">
                Register Now <ChevronRight size={18} />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatbotAssistant />
    </div>
  );
};

// Features data
const features = [
  {
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of real-world experience in their fields.",
    icon: Users
  },
  {
    title: "Practical Skills",
    description: "Gain hands-on experience with projects that prepare you for real workplace challenges.",
    icon: CheckCircle
  },
  {
    title: "Interactive Sessions",
    description: "Engage in dynamic learning environments with real-time feedback and collaboration.",
    icon: Calendar
  },
  {
    title: "Flexible Scheduling",
    description: "Choose from a variety of workshop times to fit your busy student schedule.",
    icon: Clock
  },
  {
    title: "Certification",
    description: "Receive a verified certificate upon completion to boost your resume and portfolio.",
    icon: CheckCircle
  },
  {
    title: "Community Access",
    description: "Join our community of learners for continued support and networking opportunities.",
    icon: Users
  }
];

export default Index;
