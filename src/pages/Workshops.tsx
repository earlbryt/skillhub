
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorkshopCard from '@/components/WorkshopCard';
import Navbar from '@/components/Navbar';
import { Search, Filter } from 'lucide-react';

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
  }
];

const Workshops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-heading mb-4">
            Available Workshops
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover hands-on workshops led by industry experts and take your skills to the next level
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workshops..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>
        
        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_WORKSHOPS.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              className="animate-fade-in"
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Workshops;
