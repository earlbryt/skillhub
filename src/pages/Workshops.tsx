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
import { Search, Calendar, MapPin, Filter, Clock, Users, Sparkles } from 'lucide-react';
import { format, isFuture, isPast, isToday } from 'date-fns';
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Background pattern for the page
  const bgPattern = "bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%234338ca%27%20fill-opacity%3D%270.05%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]";

  // Map Workshop to the format expected by WorkshopCard
  const mapWorkshopForCard = (workshop: Workshop) => {
    return {
      ...workshop,
      // Add any missing properties that WorkshopCard expects
      date: workshop.start_date,
      time: format(new Date(workshop.start_date), 'h:mm a'),
      category: workshop.category || 'Workshop',
      enrolled: workshop.registered_count || 0,
      image: workshop.image_url || '/placeholder-workshop.jpg'
    };
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgPattern} bg-background`}>
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero section with search */}
        <div className="relative rounded-2xl bg-gradient-to-r from-primary/90 to-accent/90 text-white p-8 mb-8 overflow-hidden">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.4%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
          
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Discover Workshops
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">
              Explore our upcoming workshops and enhance your skills with hands-on learning experiences
            </p>
            
            {/* Compact search bar */}
            <div className="flex justify-center mb-8">
              <div className="relative w-full max-w-md">
                <Input
                  type="text"
                  placeholder="Search workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-background/80 backdrop-blur-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
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
