
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkshopCard from '@/components/WorkshopCard';
import TestimonialCard from '@/components/TestimonialCard';
import CountdownTimer from '@/components/CountdownTimer';
import HeroSection from '@/components/HeroSection';
import { getWorkshops } from '@/services/workshopService';
import { format } from 'date-fns';
import { Workshop } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

// Helper function to determine skill level based on workshop description
const determineSkillLevel = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('advanced') || lowerDesc.includes('expert')) {
    return 'Advanced';
  } else if (lowerDesc.includes('intermediate')) {
    return 'Intermediate';
  } else {
    return 'Beginner';
  }
};

// Helper function to generate outcome based on workshop title and description
const generateOutcome = (title: string, description: string): string => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('web') || lowerTitle.includes('coding')) {
    return 'Build a responsive website';
  } else if (lowerTitle.includes('data') || lowerTitle.includes('analytics')) {
    return 'Analyze real-world datasets';
  } else if (lowerTitle.includes('design') || lowerTitle.includes('ui') || lowerTitle.includes('ux')) {
    return 'Create user-centered designs';
  } else if (lowerTitle.includes('marketing')) {
    return 'Develop marketing strategies';
  } else if (lowerTitle.includes('business')) {
    return 'Create a business plan';
  } else {
    // Extract a short outcome from the description
    const sentences = description.split(/[.!?]+/);
    const shortSentence = sentences.find(s => s.length > 10 && s.length < 60);
    return shortSentence ? shortSentence.trim() : 'Gain practical skills';
  }
};

// Helper function to calculate workshop duration
const calculateDuration = (startDate: string, endDate: string): string => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.round(durationMs / (1000 * 60 * 60));
    
    if (hours < 1) {
      return "< 1 hour";
    } else if (hours === 1) {
      return "1 hour";
    } else {
      return `${hours} hours`;
    }
  } catch (e) {
    return "3 hours"; // Default fallback
  }
};

const Index = () => {
  const [featuredWorkshops, setFeaturedWorkshops] = useState<Workshop[]>([]);
  const [upcomingWorkshop, setUpcomingWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Scroll to top whenever page is navigated to
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const workshopsData = await getWorkshops();
        
        // Sort workshops by date
        const sortedWorkshops = [...workshopsData].sort((a, b) => 
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );

        // Find the next upcoming workshop
        const now = new Date();
        const nextWorkshop = sortedWorkshops.find(w => new Date(w.start_date) > now) || sortedWorkshops[0];
        setUpcomingWorkshop(nextWorkshop);

        // Get workshops for the featured section
        const featured = sortedWorkshops.slice(0, 5);
        setFeaturedWorkshops(featured);
      } catch (error) {
        console.error('Error fetching workshops:', error);
        toast({
          title: "Error",
          description: "Failed to load workshops. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [toast]);

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
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-muted animate-pulse h-72 rounded-lg"></div>
                ))}
              </div>
            ) : featuredWorkshops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredWorkshops.map((workshop, index) => {
                  // Generate a random rating between 4.0 and 5.0
                  const randomRating = 4.0 + Math.random();
                  const roundedRating = Math.round(randomRating * 10) / 10;
                  
                  // Determine popularity based on workshop details
                  const popularityOptions = ["High demand", "Limited seats", "Filling fast", "Popular"];
                  const randomPopularity = popularityOptions[Math.floor(Math.random() * popularityOptions.length)];
                  
                  return (
                    <WorkshopCard 
                      key={workshop.id} 
                      workshop={{
                        id: workshop.id,
                        title: workshop.title,
                        category: workshop.instructor || 'Workshop',
                        date: format(new Date(workshop.start_date), 'MMMM d, yyyy'),
                        time: `${format(new Date(workshop.start_date), 'h:mm a')} - ${format(new Date(workshop.end_date), 'h:mm a')}`,
                        capacity: workshop.capacity,
                        enrolled: Math.floor(Math.random() * workshop.capacity), // This would be replaced with actual data in a real app
                        image: workshop.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
                        isFeatured: index < 2, // Make the first two workshops featured
                        skillLevel: determineSkillLevel(workshop.description),
                        outcome: generateOutcome(workshop.title, workshop.description),
                        duration: calculateDuration(workshop.start_date, workshop.end_date),
                        rating: roundedRating,
                        popularity: randomPopularity
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No workshops available at the moment. Check back soon!</p>
              </div>
            )}
            
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
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <div className="text-sm font-medium text-accent mb-2">Next Workshop</div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    {upcomingWorkshop ? upcomingWorkshop.title : 'Coming Soon'}
                  </h2>
                  <p className="text-foreground/70 mb-6">
                    {upcomingWorkshop ? upcomingWorkshop.description.substring(0, 150) + '...' : 'Stay tuned for our next workshop announcement.'}
                  </p>
                  
                  {upcomingWorkshop && (
                    <>
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center">
                          <Calendar size={18} className="mr-2 text-primary" />
                          <span>{format(new Date(upcomingWorkshop.start_date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={18} className="mr-2 text-primary" />
                          <span>
                            {format(new Date(upcomingWorkshop.start_date), 'h:mm a')} - {format(new Date(upcomingWorkshop.end_date), 'h:mm a')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users size={18} className="mr-2 text-primary" />
                          <span>{upcomingWorkshop.capacity} spots available</span>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <div className="text-sm font-medium mb-2">Workshop begins in:</div>
                        <CountdownTimer targetDate={upcomingWorkshop.start_date} />
                      </div>
                      
                      <Button size="lg" className="bg-primary hover:bg-primary/90 btn-hover" asChild>
                        <Link to={`/workshops/${upcomingWorkshop.id}`}>
                          Secure Your Spot
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={upcomingWorkshop?.image_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"} 
                    alt={upcomingWorkshop?.title || "Upcoming Workshop"} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 lg:hidden">
                    {upcomingWorkshop && (
                      <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                        <Link to={`/workshops/${upcomingWorkshop.id}`}>
                          Secure Your Spot
                        </Link>
                      </Button>
                    )}
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
        
        {/* CTA Section - UPDATED */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Upgrade Your Skills?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of students who have transformed their careers through our hands-on workshops. 
              Browse our catalog today and start your journey to success.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 btn-hover"
              asChild
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <Link to="/workshops">
                Browse Workshops <ChevronRight size={18} />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      {/* Old ChatbotAssistant component has been removed */}
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
