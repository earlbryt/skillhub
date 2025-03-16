import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Eye,
  Users,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  DollarSign,
  Bookmark,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { useSearch } from './Dashboard';
import WorkshopForm from '@/components/admin/WorkshopForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WorkshopWithRegistrations = Workshop & {
  registrations_count: number;
  registration_status?: string;
  category?: string;
};

const AdminWorkshops = () => {
  const [workshops, setWorkshops] = useState<WorkshopWithRegistrations[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const { searchQuery } = useSearch();
  
  // Workshop form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | undefined>(undefined);
  
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
  
  useEffect(() => {
    fetchWorkshops();
  }, [sortField, sortDirection, toast]);

  // Filter workshops based on search query
  const filteredWorkshops = workshops.filter(workshop => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      workshop.title.toLowerCase().includes(query) ||
      workshop.description.toLowerCase().includes(query) ||
      workshop.location.toLowerCase().includes(query) ||
      workshop.instructor?.toLowerCase().includes(query) ||
      (workshop.category && workshop.category.toLowerCase().includes(query)) ||
      workshop.registration_status?.toLowerCase().includes(query)
    );
  });
  
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    if (status === 'active') return <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>;
    if (status === 'upcoming') return <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>;
    return <div className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></div>;
  };
  
  // Handle opening the form for adding a new workshop
  const handleAddWorkshop = () => {
    setSelectedWorkshop(undefined);
    setIsFormOpen(true);
  };
  
  // Handle opening the form for editing an existing workshop
  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsFormOpen(true);
  };
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedWorkshop(undefined);
  };
  
  // Handle form success (refresh data)
  const handleFormSuccess = () => {
    fetchWorkshops();
  };
  
  return (
    <div className="bg-gray-50">
      {/* Workshops Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Workshops</h2>
          <p className="text-sm text-gray-500">
            {searchQuery 
              ? `${filteredWorkshops.length} workshops found for "${searchQuery}"`
              : `Total ${workshops.length} workshops available`
            }
          </p>
        </div>
        <Button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
          onClick={handleAddWorkshop}
        >
          <Plus size={16} /> 
          Add Workshop
        </Button>
      </div>
      
      {/* Workshops cards */}
      {loading ? (
        <div className="flex justify-center items-center py-8 bg-white rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading workshops...</span>
        </div>
      ) : filteredWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filteredWorkshops.map((workshop) => (
            <Card key={workshop.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white">
              <div className="p-3 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs flex items-center ${getStatusBadge(workshop.registration_status || '')}`}>
                        {getStatusIcon(workshop.registration_status || '')}
                        {workshop.registration_status}
                      </span>
                      {workshop.price > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-emerald-500" />
                          GH₵{workshop.price}
                        </span>
                      )}
                      {workshop.category && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 flex items-center">
                          <Tag className="h-3 w-3 mr-1 text-gray-500" />
                          {workshop.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{workshop.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-1 mb-2">{workshop.description}</p>
                  </div>
                  
                  {/* Registration count badge */}
                  <div className="ml-2 flex-shrink-0">
                    <div className={`flex flex-col items-center justify-center rounded-md p-1.5 ${
                      workshop.registrations_count >= workshop.capacity 
                        ? 'bg-red-50 border border-red-200' 
                        : workshop.registrations_count >= workshop.capacity * 0.8
                          ? 'bg-orange-50 border border-orange-200'
                          : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex items-center">
                        <Users className={`h-4 w-4 mr-1 ${
                          workshop.registrations_count >= workshop.capacity 
                            ? 'text-red-500' 
                            : workshop.registrations_count >= workshop.capacity * 0.8
                              ? 'text-orange-500'
                              : 'text-blue-500'
                        }`} />
                        <span className={`font-bold text-base ${
                          workshop.registrations_count >= workshop.capacity 
                            ? 'text-red-600' 
                            : workshop.registrations_count >= workshop.capacity * 0.8
                              ? 'text-orange-600'
                              : 'text-blue-600'
                        }`}>
                          {workshop.registrations_count}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">of {workshop.capacity}</div>
                      {workshop.registrations_count >= workshop.capacity && (
                        <div className="text-xs font-medium text-red-600 mt-0.5">
                          Full
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Date & Time</span>
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      {formatDate(workshop.start_date)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1 text-orange-500" />
                      {formatTime(workshop.start_date)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Location</span>
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-red-500" />
                      {workshop.location}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-3 py-2 bg-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <Bookmark className="h-3.5 w-3.5 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">ID: {workshop.id.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs border-gray-200 bg-white text-gray-700 hover:text-blue-700 hover:border-blue-200"
                    onClick={() => handleEditWorkshop(workshop)}
                  >
                    <Edit className="h-3.5 w-3.5 text-blue-500 mr-1" />
                    <span>Edit</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" asChild className="h-7 text-xs border-gray-200 bg-white text-gray-700 hover:text-blue-700 hover:border-blue-200">
                    <Link to={`/admin/workshops/${workshop.id}/attendees`} className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-blue-500" />
                      <span className="ml-1">View Attendees</span>
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-200 bg-white">
                        <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem className="text-xs cursor-pointer">
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-xs cursor-pointer"
                        onClick={() => handleEditWorkshop(workshop)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-2" />
                        Edit Workshop
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          {searchQuery 
            ? `No workshops found matching "${searchQuery}"`
            : "No workshops found"
          }
        </div>
      )}
      
      {/* Pagination */}
      {filteredWorkshops.length > 0 && (
        <div className="flex justify-between items-center mt-4 bg-white p-3 rounded-lg shadow-sm text-sm">
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
      
      {/* Workshop Form Dialog */}
      <WorkshopForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        workshop={selectedWorkshop}
      />
    </div>
  );
};

export default AdminWorkshops;
