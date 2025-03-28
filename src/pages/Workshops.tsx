import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getWorkshops } from '@/services/workshopService';
import { Workshop } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Calendar, MapPin, Filter, Clock, Users, Sparkles, BookOpen, Lightbulb, Zap } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import WorkshopCard from '@/components/WorkshopCard';

// Workshop categories for filtering
const categories = [
  { id: 'all', name: 'All Workshops' },
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'today', name: 'Today' },
  { id: 'past', name: 'Past' },
  { id: 'free', name: 'Free' },
];

// Geometric pattern for loading state
const geometricPatternClasses = `
  relative overflow-hidden rounded-lg border border-border
  before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent),radial-gradient(circle_at_70%_60%,rgba(72,56,153,0.3),transparent)]
  before:z-0 before:opacity-70
  after:absolute after:inset-0 after:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_2px,transparent_2px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_2px,transparent_2px,transparent_8px)]
  after:z-0 after:opacity-30
`;

// Featured workshop categories with icons
const featuredCategories = [
  { name: 'Technology', icon: <Zap className="h-5 w-5" /> },
  { name: 'Design', icon: <Lightbulb className="h-5 w-5" /> },
  { name: 'Business', icon: <BookOpen className="h-5 w-5" /> },
];

// Default banner image URL - using a reliable external source to avoid deployment issues
const DEFAULT_BANNER_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80";

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const data = await getWorkshops();
        setWorkshops(data);
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

  // Filter workshops based on search query and selected category
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workshopDate = new Date(workshop.start_date);
    workshopDate.setHours(0, 0, 0, 0);

    switch (selectedCategory) {
      case 'upcoming':
        return workshopDate > today;
      case 'today':
        return workshopDate.getTime() === today.getTime();
      case 'past':
        return workshopDate < today;
      case 'free':
        return workshop.price === 0;
      default:
        return true;
    }
  });

  // Format date from ISO string
  const formatDateFromISO = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return isoString;
    }
  };

  // Format time from ISO string
  const formatTimeFromISO = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return format(date, 'h:mm a');
    } catch (e) {
      return '';
    }
  };

  // Background pattern for the page
  const bgPattern = "bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%234338ca%27%20fill-opacity%3D%270.05%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]";

  // Map Workshop to the format expected by WorkshopCard
  const mapWorkshopForCard = (workshop: Workshop) => {
    // Generate a random rating between 4.0 and 5.0
    const randomRating = 4.0 + Math.random();
    const roundedRating = Math.round(randomRating * 10) / 10;
    
    // Determine popularity based on workshop details
    const popularityOptions = ["High demand", "Limited seats", "Filling fast", "Popular"];
    const randomPopularity = popularityOptions[Math.floor(Math.random() * popularityOptions.length)];
    
    // Create a safe copy to avoid TypeScript errors
    const workshopData = {
      ...workshop,
      date: formatDateFromISO(workshop.start_date),
      time: formatTimeFromISO(workshop.start_date),
      category: 'Workshop',
      enrolled: 0,
      image: DEFAULT_BANNER_IMAGE,
      skillLevel: determineSkillLevel(workshop.description),
      outcome: generateOutcome(workshop.title, workshop.description),
      duration: calculateDuration(workshop.start_date, workshop.end_date),
      rating: roundedRating,
      popularity: randomPopularity
    };
    
    // Safely add optional properties if they exist
    if ('category' in workshop) {
      workshopData.category = (workshop as any).category;
    }
    
    if ('registered_count' in workshop) {
      workshopData.enrolled = (workshop as any).registered_count;
    }
    
    if ('image_url' in workshop && (workshop as any).image_url) {
      workshopData.image = (workshop as any).image_url;
    }
    
    return workshopData;
  };

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

  // Get workshop stats
  const workshopStats = {
    total: workshops.length,
    upcoming: workshops.filter(w => new Date(w.start_date) > new Date()).length,
    instructors: [...new Set(workshops.map(w => w.instructor))].length
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgPattern} bg-background`}>
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Enhanced hero section with actual image - reduced height on mobile */}
        <div className="relative rounded-2xl bg-gradient-to-r from-primary/90 via-indigo-600/90 to-accent/90 text-white p-4 md:p-6 mb-8 overflow-hidden">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.4%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
          
          {/* Animated decorative elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-4 md:gap-6 items-center">
            {/* Content section - more compact on mobile */}
            <div className="flex-1">
              <div className="mb-3 md:mb-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">
                  Discover Workshops
                </h1>
                <p className="text-white/80 text-sm md:text-lg max-w-2xl mb-2 md:mb-4">
                  Explore our upcoming workshops and enhance your skills
                </p>
              </div>
              
              {/* Workshop stats - hidden on small mobile, visible on medium screens and up */}
              <div className="hidden sm:flex gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 text-center">
                  <p className="text-lg md:text-xl font-bold">{workshopStats.total}</p>
                  <p className="text-xs text-white/70">Workshops</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 text-center">
                  <p className="text-lg md:text-xl font-bold">{workshopStats.upcoming}</p>
                  <p className="text-xs text-white/70">Upcoming</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 text-center">
                  <p className="text-lg md:text-xl font-bold">{workshopStats.instructors}</p>
                  <p className="text-xs text-white/70">Instructors</p>
                </div>
              </div>
              
              {/* Featured categories - fewer items on mobile */}
              <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
                {featuredCategories.slice(0, window.innerWidth < 640 ? 2 : 3).map((category, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
              
              {/* Compact search bar */}
              <div className="flex justify-start">
                <div className="relative w-full max-w-md">
                  <Input
                    type="text"
                    placeholder="Search workshops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 bg-background/80 backdrop-blur-sm border-white/20 focus:border-white/40 h-9 md:h-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            {/* Actual image section - smaller on mobile */}
            <div className="flex-1 max-w-md h-32 sm:h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden">
              <img 
                src={DEFAULT_BANNER_IMAGE}
                alt="People collaborating in a workshop" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Tabs and content */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-background/50 backdrop-blur-sm">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className={`h-[360px] ${geometricPatternClasses}`}>
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex-1 p-6">
                          <div className="flex justify-center items-center h-40 mb-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                          </div>
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-border">
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredWorkshops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkshops.map((workshop) => (
                    <WorkshopCard key={workshop.id} workshop={mapWorkshopForCard(workshop)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No workshops found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `No workshops match your search for "${searchQuery}"`
                      : `No workshops available in this category`}
                  </p>
                  {searchQuery && (
                    <Button onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Workshops;
