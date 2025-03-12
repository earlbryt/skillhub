
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotAssistant from '@/components/ChatbotAssistant';
import WorkshopCard, { WorkshopProps } from '@/components/WorkshopCard';

// Workshop data
const WORKSHOPS: WorkshopProps[] = [
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
  },
  {
    id: "web-dev-2",
    title: "Full-Stack Development",
    category: "Coding",
    date: "July 5, 2023",
    time: "10:00 AM - 4:00 PM",
    capacity: 25,
    enrolled: 10,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "design-1",
    title: "Graphic Design Masterclass",
    category: "Design",
    date: "July 10, 2023",
    time: "1:00 PM - 5:00 PM",
    capacity: 20,
    enrolled: 8,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "digital-1",
    title: "Digital Marketing Strategies",
    category: "Marketing",
    date: "July 15, 2023",
    time: "9:00 AM - 1:00 PM",
    capacity: 30,
    enrolled: 18,
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80"
  }
];

// Available categories
const CATEGORIES = [...new Set(WORKSHOPS.map(workshop => workshop.category))];

// Date options
const DATES = [
  { label: "All Dates", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" }
];

const Workshops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [availability, setAvailability] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter workshops based on search and filters
  const filteredWorkshops = WORKSHOPS.filter(workshop => {
    // Search filter
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workshop.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory;
    
    // Date filter - simplified for demo
    const matchesDate = selectedDate === 'all';
    
    // Availability filter
    const availabilityRatio = workshop.enrolled / workshop.capacity;
    const matchesAvailability = 
      availability === 'all' ||
      (availability === 'available' && availabilityRatio < 1) ||
      (availability === 'almostFull' && availabilityRatio >= 0.8 && availabilityRatio < 1) ||
      (availability === 'full' && availabilityRatio >= 1);
    
    return matchesSearch && matchesCategory && matchesDate && matchesAvailability;
  });
  
  // Featured workshops - first 2 workshops
  const featuredWorkshops = filteredWorkshops.filter(workshop => workshop.isFeatured);
  
  // Regular workshops - exclude featured workshops
  const regularWorkshops = filteredWorkshops.filter(workshop => !workshop.isFeatured);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Upcoming Workshops</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our catalog of professional workshops designed to help you advance your career and learn new skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Search and filters */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search workshops by title or category..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-full md:w-auto flex items-center gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={16} />
                <span>Filters</span>
                {(selectedCategory !== 'all' || selectedDate !== 'all' || availability !== 'all') && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {(selectedCategory !== 'all' ? 1 : 0) + 
                     (selectedDate !== 'all' ? 1 : 0) + 
                     (availability !== 'all' ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              <Select 
                value={selectedDate} 
                onValueChange={setSelectedDate}
              >
                <SelectTrigger className="w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <SelectValue placeholder="All Dates" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {DATES.map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isFilterOpen && (
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </Badge>
                  {CATEGORIES.map(category => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={availability === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setAvailability('all')}
                  >
                    All
                  </Badge>
                  <Badge
                    variant={availability === 'available' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setAvailability('available')}
                  >
                    Available
                  </Badge>
                  <Badge
                    variant={availability === 'almostFull' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setAvailability('almostFull')}
                  >
                    Almost Full
                  </Badge>
                  <Badge
                    variant={availability === 'full' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setAvailability('full')}
                  >
                    Full
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDate('all');
                    setAvailability('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
          
          {/* Workshops grid */}
          <div className="space-y-10">
            {/* Featured Workshops */}
            {featuredWorkshops.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <GraduationCap className="text-primary mr-2 h-5 w-5" />
                  <h2 className="text-xl font-semibold">Featured Workshops</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredWorkshops.map(workshop => (
                    <WorkshopCard key={workshop.id} workshop={workshop} />
                  ))}
                </div>
              </div>
            )}
            
            {/* All Workshops */}
            <div>
              <h2 className="text-xl font-semibold mb-4">All Workshops</h2>
              {regularWorkshops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {regularWorkshops.map(workshop => (
                    <WorkshopCard key={workshop.id} workshop={workshop} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <div className="text-muted-foreground mb-4">
                    <Search className="h-12 w-12 mx-auto mb-2" />
                    <p>No workshops found matching your criteria.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedDate('all');
                      setAvailability('all');
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ChatbotAssistant />
    </div>
  );
};

export default Workshops;
