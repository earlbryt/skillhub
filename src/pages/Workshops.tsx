import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorkshopCard from '@/components/WorkshopCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Filter, BookOpen, Calendar, MapPin, ChevronDown } from 'lucide-react';
import AnimatedBlob from '@/components/ui/animated-blob';
import FloatingBadge from '@/components/ui/floating-badge';
import StatCard from '@/components/ui/stat-card';
import { cn } from '@/lib/utils';

// Mock data for workshops
const MOCK_WORKSHOPS = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    category: "Programming",
    date: "March 15, 2024",
    time: "10:00 AM - 2:00 PM",
    capacity: 30,
    enrolled: 25,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    isFeatured: true
  },
  {
    id: "2",
    title: "Digital Marketing Masterclass",
    category: "Marketing",
    date: "March 20, 2024",
    time: "2:00 PM - 6:00 PM",
    capacity: 25,
    enrolled: 15,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    category: "Design",
    date: "March 25, 2024",
    time: "1:00 PM - 5:00 PM",
    capacity: 20,
    enrolled: 18,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    id: "4",
    title: "Data Science Essentials",
    category: "Data",
    date: "April 5, 2024",
    time: "9:00 AM - 3:00 PM",
    capacity: 22,
    enrolled: 17,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "5",
    title: "Blockchain Technology Introduction",
    category: "Technology",
    date: "April 12, 2024",
    time: "1:00 PM - 4:00 PM",
    capacity: 18,
    enrolled: 5,
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55"
  },
  {
    id: "6",
    title: "Artificial Intelligence Applications",
    category: "Technology",
    date: "April 15, 2024",
    time: "10:00 AM - 3:00 PM",
    capacity: 25,
    enrolled: 20,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  }
];

// Statistics for display
const STATS = [
  { value: "25+", label: "Upcoming Workshops", icon: <Calendar className="h-5 w-5 text-primary" /> },
  { value: "1200+", label: "Students Enrolled", icon: <BookOpen className="h-5 w-5 text-primary" /> },
  { value: "12", label: "Venues", icon: <MapPin className="h-5 w-5 text-primary" /> },
];

// Categories for filter
const CATEGORIES = ["All", "Programming", "Design", "Marketing", "Technology", "Data"];

const Workshops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter workshops by search and category
  const filteredWorkshops = MOCK_WORKSHOPS.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || workshop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <AnimatedBlob 
          color="bg-primary" 
          position="top-0 right-0 -translate-y-1/2 translate-x-1/2" 
          size="w-[40rem] h-[40rem]" 
          opacity="opacity-10" 
        />
        <AnimatedBlob 
          color="bg-secondary" 
          position="bottom-0 left-0 translate-y-1/2 -translate-x-1/2" 
          size="w-[30rem] h-[30rem]" 
          opacity="opacity-10" 
          delay="4s"
        />
        <AnimatedBlob 
          color="bg-accent" 
          position="bottom-0 right-0 translate-y-1/4 translate-x-1/4" 
          size="w-[25rem] h-[25rem]" 
          opacity="opacity-5" 
          delay="2s"
        />
      </div>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12 relative">
          {/* Floating badges */}
          <FloatingBadge 
            icon={BookOpen} 
            text="Hands-on Learning" 
            position="-top-2 lg:-top-6 left-4 lg:left-20 md:block"
            rotate="rotate-[-2deg]"
          />
          
          <FloatingBadge 
            icon={Calendar} 
            text="Flexible Scheduling" 
            position="-bottom-2 lg:-bottom-6 right-4 lg:right-20 md:block"
            rotate="rotate-[2deg]"
            gradient="from-secondary via-accent to-primary"
          />
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-heading mb-4">
            Discover & Join Workshops
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find hands-on workshops led by industry experts and enhance your skills in just a few clicks
          </p>
        </div>
        
        {/* Stats section */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {STATS.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              className="animate-fade-in"
              gradient={index === 1 ? "from-secondary via-accent to-primary" : undefined}
            />
          ))}
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workshops by title, category, or skills..."
                className="pl-10 bg-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "rounded-full",
                    selectedCategory === category && "bg-gradient-to-r from-primary to-accent text-white"
                  )}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Button variant="outline" className="gap-2 whitespace-nowrap md:self-stretch">
              <Filter size={16} />
              More Filters
              <ChevronDown size={14} />
            </Button>
          </div>
        </div>
        
        {/* Results information */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-foreground/70">
            Showing <span className="font-medium text-foreground">{filteredWorkshops.length}</span> workshops
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">Sort by:</span>
            <select className="bg-white/70 border border-input rounded-md h-9 px-3 py-1 text-sm">
              <option>Date (Soonest)</option>
              <option>Popularity</option>
              <option>Availability</option>
            </select>
          </div>
        </div>
        
        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map((workshop, index) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No workshops found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                variant="outline"
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
        
        {/* Call to action */}
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl p-8 border border-white/30 backdrop-blur-sm shadow-lg text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Don't see what you're looking for?</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
            We're constantly adding new workshops based on student requests and industry trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" className="btn-hover bg-gradient-to-r from-primary to-accent shadow-md hover:shadow-lg">
              Request a Topic
            </Button>
            <Button variant="outline" className="backdrop-blur-sm bg-white/50 hover:bg-white/80">
              Browse All Categories
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Workshops;
