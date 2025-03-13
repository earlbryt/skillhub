
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Workshop } from '@/types/supabase';
import { getWorkshops } from '@/services/workshopService';

export const HeroSection: React.FC = () => {
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const workshops = await getWorkshops();
        const upcoming = workshops
          .filter(workshop => new Date(workshop.start_date) > new Date())
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 3);
        
        setUpcomingWorkshops(upcoming);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Expand Your Knowledge with Hands-on Workshops
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
              Join our interactive workshops led by industry experts. Gain practical skills and unlock your potential in technology, design, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/workshops">
                  Explore Workshops <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/register">Register Now</Link>
              </Button>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium text-gray-900 mb-4">Why Choose Our Workshops:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Expert Instructors from Leading Companies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Hands-on Learning Experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Flexible Schedule Options</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Certificate of Completion</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Workshops</h2>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : upcomingWorkshops.length > 0 ? (
              <div className="space-y-4">
                {upcomingWorkshops.map((workshop) => (
                  <Link 
                    key={workshop.id} 
                    to={`/workshops/${workshop.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(workshop.start_date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {workshop.location}
                        </p>
                      </div>
                      <span className="text-primary font-medium">
                        ${workshop.price?.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
                
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/workshops">View All Workshops <ChevronRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No upcoming workshops available at the moment.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/workshops">View All Workshops</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
