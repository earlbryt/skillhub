
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getWorkshops } from '@/services/workshopService';
import { Workshop } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await getWorkshops();
        setWorkshops(data);
      } catch (error) {
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

  const filteredWorkshops = workshops.filter(workshop => 
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Available Workshops
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our upcoming workshops and register to secure your spot
          </p>
        </div>
        
        {/* Search bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workshops by title, description, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Workshops grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-muted">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 bg-muted overflow-hidden">
                  {workshop.image_url ? (
                    <img
                      src={workshop.image_url}
                      alt={workshop.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground">No image available</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{workshop.title}</CardTitle>
                    {workshop.price > 0 ? (
                      <Badge variant="secondary">GH₵{workshop.price.toFixed(2)}</Badge>
                    ) : (
                      <Badge>Free</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground flex items-center mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(workshop.start_date)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {workshop.location}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {workshop.description}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Link to={`/workshops/${workshop.id}`} className="w-full">
                    <Button variant="default" className="w-full">
                      View Details & Register
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No workshops found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search to find what you're looking for.
            </p>
            <Button 
              onClick={() => setSearchQuery('')}
              variant="outline" 
              className="mt-4"
            >
              Clear search
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Workshops;
