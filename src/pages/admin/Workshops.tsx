
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Search, Calendar, Clock, Users, MapPin } from 'lucide-react';

interface Registration {
  id: string;
  workshop_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  price: number;
  image_url: string;
  created_at: string;
  registrations: Registration[];
  registrationCount: number;
}

const AdminWorkshopsPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        
        // Fetch workshops
        const { data: workshopsData, error: workshopsError } = await supabase
          .from('workshops')
          .select('*')
          .order('start_date', { ascending: true });
          
        if (workshopsError) throw workshopsError;
        
        // Fetch registrations for workshops
        const { data: registrationsData, error: registrationsError } = await supabase
          .from('registrations')
          .select('*');
          
        if (registrationsError) throw registrationsError;
        
        // Group registrations by workshop_id
        const registrationsByWorkshop = new Map<string, Registration[]>();
        
        registrationsData?.forEach(registration => {
          const workshopId = registration.workshop_id;
          
          if (!registrationsByWorkshop.has(workshopId)) {
            registrationsByWorkshop.set(workshopId, []);
          }
          
          const registrations = registrationsByWorkshop.get(workshopId);
          if (registrations) {
            registrations.push(registration);
          }
        });
        
        // Combine workshop data with registration counts
        const workshopsWithRegistrations = workshopsData?.map(workshop => {
          const registrations = registrationsByWorkshop.get(workshop.id) || [];
          return {
            ...workshop,
            registrations,
            registrationCount: registrations.length
          };
        }) || [];
        
        setWorkshops(workshopsWithRegistrations);
      } catch (error) {
        console.error('Error fetching workshops:', error);
        toast({
          title: "Error loading workshops",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshops();
  }, [toast]);

  // Filter workshops based on search term
  const filteredWorkshops = workshops.filter(workshop => {
    const title = workshop.title.toLowerCase();
    const description = workshop.description.toLowerCase();
    const instructor = workshop.instructor.toLowerCase();
    const location = workshop.location.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return title.includes(search) || 
           description.includes(search) || 
           instructor.includes(search) || 
           location.includes(search);
  });

  // Calculate workshop status
  const getWorkshopStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now > end) return 'completed';
    if (now >= start && now <= end) return 'active';
    return 'upcoming';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `GH₵ ${price}`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Workshop Management</h2>
        <p className="text-slate-500">View and manage workshop details and registrations</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search workshops..."
          className="pl-10 w-full rounded-md border border-slate-200 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading workshops...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map((workshop) => {
              const status = getWorkshopStatus(workshop.start_date, workshop.end_date);
              return (
                <Card key={workshop.id} className="border border-slate-200 shadow-sm overflow-hidden">
                  <div className="grid md:grid-cols-4 lg:grid-cols-5">
                    {/* Workshop Image */}
                    <div className="md:col-span-1 h-full">
                      <div className="h-full min-h-[12rem] bg-slate-100 relative">
                        <img 
                          src={workshop.image_url || '/placeholder.svg'} 
                          alt={workshop.title}
                          className="h-full w-full object-cover absolute inset-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Workshop Details */}
                    <div className="p-6 md:col-span-3 lg:col-span-4">
                      <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                        <h3 className="text-xl font-semibold text-slate-900">{workshop.title}</h3>
                        <Badge variant={
                          status === 'active' ? 'default' : 
                          status === 'upcoming' ? 'secondary' : 'outline'
                        } className={
                          status === 'active' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
                          status === 'upcoming' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
                          'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }>
                          {status}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600 mb-4 line-clamp-2">{workshop.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-4">
                        <div className="flex items-center text-sm text-slate-500">
                          <Users className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="font-medium mr-1">Instructor:</span> {workshop.instructor}
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="font-medium mr-1">Location:</span> {workshop.location}
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="font-medium mr-1">Date:</span> {formatDate(workshop.start_date)}
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Clock className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="font-medium mr-1">Time:</span> {formatTime(workshop.start_date)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-blue-50 px-4 py-3 rounded-md">
                          <div className="text-sm text-slate-600">Registered</div>
                          <div className="text-2xl font-bold text-blue-600">{workshop.registrationCount}</div>
                        </div>
                        <div className="bg-slate-50 px-4 py-3 rounded-md">
                          <div className="text-sm text-slate-600">Capacity</div>
                          <div className="text-2xl font-bold text-slate-700">{workshop.capacity}</div>
                        </div>
                        <div className="bg-slate-50 px-4 py-3 rounded-md">
                          <div className="text-sm text-slate-600">Price</div>
                          <div className="text-2xl font-bold text-slate-700">{formatPrice(workshop.price)}</div>
                        </div>
                        <div className="bg-slate-50 px-4 py-3 rounded-md">
                          <div className="text-sm text-slate-600">Fill Rate</div>
                          <div className="text-2xl font-bold text-slate-700">
                            {Math.round((workshop.registrationCount / workshop.capacity) * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      {workshop.registrations.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-3">Recent Registrations</h4>
                          <div className="border rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registration Date</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-slate-200">
                                {workshop.registrations.slice(0, 3).map((registration) => (
                                  <tr key={registration.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="text-sm font-medium text-slate-900">
                                        {registration.first_name} {registration.last_name}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="text-sm text-slate-500">{registration.email}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="text-sm text-slate-500">
                                        {formatDate(registration.created_at)}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {workshop.registrations.length > 3 && (
                            <div className="text-right mt-2">
                              <span className="text-sm text-blue-600">
                                + {workshop.registrations.length - 3} more registrations
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center p-8 bg-slate-50 rounded-lg border border-slate-200">
              <Calendar className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-lg font-medium text-slate-900">No workshops found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {searchTerm ? 'Try a different search term' : 'No workshops have been created yet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWorkshopsPage;
