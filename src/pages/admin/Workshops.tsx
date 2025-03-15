
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus,
  Eye,
  Users,
  Clock,
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

type WorkshopWithRegistrations = Workshop & {
  registrations_count: number;
  registration_status?: string;
};

const AdminWorkshops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workshops, setWorkshops] = useState<WorkshopWithRegistrations[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        
        const { data: workshopsData, error } = await supabase
          .from('workshops')
          .select('*')
          .order(sortField, { ascending: sortDirection === 'asc' });
          
        if (error) throw error;
        
        // Get registration counts for each workshop
        const workshopsWithRegistrations = await Promise.all(
          (workshopsData || []).map(async (workshop) => {
            const { count, error: countError } = await supabase
              .from('registrations')
              .select('*', { count: 'exact', head: true })
              .eq('workshop_id', workshop.id);
              
            if (countError) {
              console.error('Error fetching registration count:', countError);
              return { ...workshop, registrations_count: 0 };
            }
            
            // Determine status based on dates and capacity
            const now = new Date();
            const startDate = new Date(workshop.start_date);
            const endDate = new Date(workshop.end_date);
            
            let status = '';
            if (now > endDate) {
              status = 'completed';
            } else if (now >= startDate && now <= endDate) {
              status = 'active';
            } else {
              status = 'upcoming';
            }
            
            // Add status and count to workshop object
            return { 
              ...workshop, 
              registrations_count: count || 0,
              registration_status: status
            };
          })
        );
        
        setWorkshops(workshopsWithRegistrations);
      } catch (error) {
        console.error('Error fetching workshops:', error);
        toast({
          title: "Error fetching workshops",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshops();
  }, [sortField, sortDirection, toast]);
  
  // Filter workshops based on search query
  const filteredWorkshops = workshops.filter(workshop => 
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-800';
    if (status === 'upcoming') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div>
      {/* Workshops Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Workshops</h2>
          <p className="text-sm text-gray-500">Total {workshops.length} workshops available</p>
        </div>
        <Button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2">
          <Plus size={16} /> 
          Add Workshop
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search workshops by title, description or location..."
            className="w-full py-2 px-4 pr-10 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Workshops table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Workshop</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Registration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredWorkshops.length > 0 ? (
                filteredWorkshops.map((workshop) => (
                  <tr key={workshop.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{workshop.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{workshop.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {formatDate(workshop.start_date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {formatTime(workshop.start_date)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {workshop.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                        <span className={`font-medium ${
                          workshop.registrations_count >= workshop.capacity 
                            ? 'text-red-600' 
                            : workshop.registrations_count >= workshop.capacity * 0.8
                              ? 'text-orange-600'
                              : 'text-blue-600'
                        }`}>
                          {workshop.registrations_count}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-600">{workshop.capacity}</span>
                      </div>
                      {workshop.registrations_count >= workshop.capacity && (
                        <div className="text-xs text-red-600 mt-1">
                          At capacity
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(workshop.registration_status || '')}`}>
                        {workshop.registration_status}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Button variant="outline" size="sm" asChild className="border-gray-200 text-gray-700 hover:text-blue-700 hover:border-blue-200">
                        <Link to={`/admin/workshops/${workshop.id}/attendees`} className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span className="ml-1.5">Attendees</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No workshops found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredWorkshops.length > 0 && (
          <div className="flex justify-between items-center p-4 text-sm">
            <p>Page 1 of 1</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-md bg-gray-50 flex items-center gap-1" disabled>
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button className="px-3 py-1 border rounded-md bg-blue-500 text-white flex items-center gap-1" disabled>
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkshops;
