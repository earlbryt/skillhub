
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, ArrowRight, Check, Star, User, MessageSquare, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialCard from '@/components/TestimonialCard';
import FloatingBadge from '@/components/ui/floating-badge';
import AnimatedBlob from '@/components/ui/animated-blob';

// Mock data - in a real app this would come from an API
const MOCK_WORKSHOP = {
  id: "1",
  title: "Web Development Fundamentals",
  category: "Programming",
  date: "March 15, 2024",
  time: "10:00 AM - 2:00 PM",
  location: "Tech Hub, Innovation Center",
  capacity: 30,
  enrolled: 25,
  price: "Free",
  image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  description: "Master the fundamentals of web development in this intensive workshop. Perfect for beginners looking to start their journey in tech. You'll learn HTML, CSS, and basic JavaScript to build your first responsive website.",
  longDescription: "In this comprehensive workshop, you'll dive deep into the world of web development. Starting with the basics of HTML structure, you'll progress to styling with CSS and adding interactivity with JavaScript. By the end of the session, you'll have built a fully functional and responsive website that you can add to your portfolio. All skill levels are welcome, but this workshop is especially designed for beginners and those looking to solidify their foundational knowledge.",
  skillLevel: "Beginner",
  whatToLearn: [
    "Understanding HTML document structure and semantic elements",
    "CSS styling, layout techniques, and responsive design principles",
    "JavaScript basics for adding interactivity to web pages",
    "Modern development workflows and best practices",
    "How to deploy your website to the internet"
  ],
  prerequisites: [
    "Basic computer skills",
    "No prior coding experience required",
    "Laptop with Chrome or Firefox browser"
  ],
  instructor: {
    name: "Sarah Johnson",
    role: "Senior Web Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    bio: "Sarah has over 10 years of experience in web development and has trained over 1000 students. She currently works as a lead developer at a tech startup and is passionate about making coding accessible to everyone."
  },
  testimonials: [
    {
      name: "Michael Chen",
      role: "Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      rating: 5,
      text: "This workshop was exactly what I needed to kickstart my web development journey! Sarah is an excellent instructor who explains complex concepts in simple terms.",
      workshopName: "Web Development Fundamentals"
    },
    {
      name: "Priya Sharma",
      role: "Career Changer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      rating: 5,
      text: "I've tried many online courses but nothing compares to the hands-on experience of this workshop. I built my first website in just one day!",
      workshopName: "Web Development Fundamentals"
    },
    {
      name: "James Wilson",
      role: "Marketing Professional",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      rating: 4,
      text: "Great introduction to web development concepts. I now understand how websites work and can communicate better with our development team.",
      workshopName: "Web Development Fundamentals"
    }
  ],
  relatedWorkshops: [
    {
      id: "2",
      title: "Advanced JavaScript",
      category: "Programming",
      image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd"
    },
    {
      id: "3",
      title: "Responsive Web Design",
      category: "Design",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8"
    },
    {
      id: "4",
      title: "Introduction to React",
      category: "Programming",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2"
    }
  ]
};

const WorkshopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, we would fetch the workshop data based on the ID
  const workshop = MOCK_WORKSHOP;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="relative overflow-hidden pb-16">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <AnimatedBlob 
            color="bg-primary" 
            position="top-0 right-0 -translate-y-1/2 translate-x-1/2" 
            size="w-[40rem] h-[40rem]" 
            opacity="opacity-5" 
          />
          <AnimatedBlob 
            color="bg-secondary" 
            position="bottom-0 left-0 translate-y-1/2 -translate-x-1/2" 
            size="w-[30rem] h-[30rem]" 
            opacity="opacity-5" 
            delay="4s"
          />
        </div>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 pt-16 pb-8 relative">
          <FloatingBadge 
            icon={Award} 
            text="Top-Rated Workshop" 
            position="top-4 right-4 md:top-8 md:right-12"
            rotate="rotate-[3deg]"
            gradient="from-secondary via-accent to-primary"
          />
          
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge className="bg-accent text-white border-0">{workshop.category}</Badge>
                <h1 className="text-4xl font-bold gradient-heading">
                  {workshop.title}
                </h1>
                <p className="text-foreground/70 text-lg">
                  {workshop.description}
                </p>
                
                {/* Workshop Details */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/70">Date</div>
                        <div className="font-medium">{workshop.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Clock className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/70">Time</div>
                        <div className="font-medium">{workshop.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/70">Location</div>
                        <div className="font-medium">{workshop.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground/70">Capacity</div>
                        <div className="font-medium">{workshop.enrolled} / {workshop.capacity}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Capacity bar */}
                  <div>
                    <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${Math.round((workshop.enrolled / workshop.capacity) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="font-medium">{workshop.capacity - workshop.enrolled} spots left</span>
                      <span className="font-medium">{Math.round((workshop.enrolled / workshop.capacity) * 100)}% full</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto gap-2 btn-hover bg-gradient-to-r from-primary to-accent shadow-md hover:shadow-lg"
                  onClick={() => navigate(`/register?workshop=${workshop.id}`)}
                >
                  Register Now <ArrowRight size={16} />
                </Button>
              </div>
              
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/30 aspect-video">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/30 flex items-center gap-2">
                    <User className="text-primary h-5 w-5" />
                    <div>
                      <div className="text-xs text-foreground/70">Instructor</div>
                      <div className="font-medium text-sm">{workshop.instructor.name}</div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/30 flex items-center gap-2">
                    <Star className="text-yellow-500 h-5 w-5 fill-yellow-500" />
                    <div className="font-medium">5.0 (32 reviews)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* About the Workshop */}
              <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">About the Workshop</h2>
                <p className="text-foreground/70 mb-6">
                  {workshop.longDescription}
                </p>
                
                <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
                <ul className="space-y-2 mb-6">
                  {workshop.whatToLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
                <ul className="space-y-2">
                  {workshop.prerequisites.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              
              {/* Instructor Section */}
              <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Meet Your Instructor</h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={workshop.instructor.image}
                    alt={workshop.instructor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{workshop.instructor.name}</h3>
                    <p className="text-accent font-medium mb-2">{workshop.instructor.role}</p>
                    <p className="text-foreground/70">{workshop.instructor.bio}</p>
                  </div>
                </div>
              </section>
              
              {/* Testimonials Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6">What Students Say</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workshop.testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                  ))}
                </div>
              </section>
            </div>
            
            <div className="space-y-6">
              {/* Quick Registration Card */}
              <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Quick Registration</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Workshop:</span>
                    <span className="font-medium">{workshop.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Date:</span>
                    <span className="font-medium">{workshop.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Time:</span>
                    <span className="font-medium">{workshop.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Location:</span>
                    <span className="font-medium">{workshop.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Price:</span>
                    <span className="font-medium">{workshop.price}</span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full gap-2 btn-hover bg-gradient-to-r from-primary to-accent shadow-md hover:shadow-lg mb-4"
                  onClick={() => navigate(`/register?workshop=${workshop.id}`)}
                >
                  Register Now <ArrowRight size={16} />
                </Button>
                
                <div className="flex items-center justify-center gap-1 text-sm text-foreground/70">
                  <MessageSquare size={14} />
                  <span>Questions? <a href="#" className="text-primary font-medium">Contact us</a></span>
                </div>
              </div>
              
              {/* Related Workshops */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Related Workshops</h3>
                <div className="space-y-4">
                  {workshop.relatedWorkshops.map((relatedWorkshop) => (
                    <div key={relatedWorkshop.id} className="flex gap-3 group cursor-pointer" onClick={() => navigate(`/workshops/${relatedWorkshop.id}`)}>
                      <img 
                        src={relatedWorkshop.image} 
                        alt={relatedWorkshop.title} 
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors">{relatedWorkshop.title}</h4>
                        <Badge variant="outline" className="mt-1 text-xs">{relatedWorkshop.category}</Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-foreground/40 self-center group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline"
                  className="w-full mt-4 backdrop-blur-sm bg-white/50 hover:bg-white/80"
                  onClick={() => navigate('/workshops')}
                >
                  View All Workshops
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetails;
