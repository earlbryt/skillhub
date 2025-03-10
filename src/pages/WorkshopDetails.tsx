
import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import TestimonialCard from '@/components/TestimonialCard';

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
  description: "Master the fundamentals of web development in this intensive workshop. Perfect for beginners looking to start their journey in tech.",
  instructor: {
    name: "Sarah Johnson",
    role: "Senior Web Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    bio: "Sarah has over 10 years of experience in web development and has trained over 1000 students."
  },
  testimonials: [
    {
      name: "Michael Chen",
      role: "Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      rating: 5,
      text: "This workshop was exactly what I needed to kickstart my web development journey!",
      workshopName: "Web Development Fundamentals"
    }
  ]
};

const WorkshopDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <Badge className="mb-4">{MOCK_WORKSHOP.category}</Badge>
            <h1 className="text-4xl font-bold gradient-heading">
              {MOCK_WORKSHOP.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {MOCK_WORKSHOP.description}
            </p>
            
            {/* Workshop Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" />
                <span>{MOCK_WORKSHOP.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-primary" />
                <span>{MOCK_WORKSHOP.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" />
                <span>{MOCK_WORKSHOP.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-primary" />
                <span>{MOCK_WORKSHOP.enrolled} / {MOCK_WORKSHOP.capacity}</span>
              </div>
            </div>
            
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Register Now <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <img
              src={MOCK_WORKSHOP.image}
              alt={MOCK_WORKSHOP.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Instructor Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Meet Your Instructor</h2>
          <div className="bg-card rounded-xl p-6 flex items-center gap-6">
            <img
              src={MOCK_WORKSHOP.instructor.image}
              alt={MOCK_WORKSHOP.instructor.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">{MOCK_WORKSHOP.instructor.name}</h3>
              <p className="text-muted-foreground">{MOCK_WORKSHOP.instructor.role}</p>
              <p className="mt-2">{MOCK_WORKSHOP.instructor.bio}</p>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">What Students Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_WORKSHOP.testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkshopDetails;
