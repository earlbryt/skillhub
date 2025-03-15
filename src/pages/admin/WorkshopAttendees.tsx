
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, Mail, Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Workshop, Registration } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

const WorkshopAttendees = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [attendees, setAttendees] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWorkshopAndAttendees = async () => {
      try {
        setLoading(true);
        
        // Fetch workshop
        const { data: workshopData, error: workshopError } = await supabase
          .from('workshops')
          .select('*')
          .eq('id', id)
          .single();
          
        if (workshopError) throw workshopError;
        
        // Fetch attendees
        const { data: attendeesData, error: attendeesError } = await supabase
          .from('registrations')
          .select('*')
          .eq('workshop_id', id)
          .order('created_at', { ascending: false });
          
        if (attendeesError) throw attendeesError;
        
        setWorkshop(workshopData);
        setAttendees(attendeesData || []);
      } catch (error) {
        console.error('Error fetching workshop or attendees:', error);
        toast({
          title: "Error fetching data",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchWorkshopAndAttendees();
    }
  }, [id, toast]);
  
  // Filter attendees based on search query
  const filteredAttendees = attendees.filter(attendee => 
    attendee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (status === 'confirmed') return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Workshop not found</h3>
        <p className="text-gray-500 mb-6">The workshop you're looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/admin/workshops">Back to Workshops</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start gap-4 mb-8">
        <Button variant="outline" size="sm" asChild className="mt-1">
          <Link to="/admin/workshops" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">{workshop.title}</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              {attendees.length} / {workshop.capacity} registered
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              <div>
                <div className="text-sm font-medium">{formatDate(workshop.start_date)}</div>
                <div className="text-xs text-gray-500">{formatTime(workshop.start_date)} - {formatTime(workshop.end_date)}</div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <div className="text-sm">{workshop.location}</div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              <div className="text-sm">{Math.round((attendees.length / workshop.capacity) * 100)}% Capacity</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and action bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search attendees by name or email..."
            className="w-full py-2 px-4 pr-10 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-shrink-0">
            Export List
          </Button>
          <Button className="flex-shrink-0 bg-blue-500 text-white">
            Add Attendee
          </Button>
        </div>
      </div>
      
      {/* Attendees table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Attendee</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Registration Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {attendee.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{attendee.first_name} {attendee.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{attendee.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{attendee.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(attendee.created_at)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(attendee.status)}`}>
                        {attendee.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-gray-200 text-gray-700 hover:text-blue-700">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-gray-200 text-gray-700">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    {searchQuery ? 'No attendees found matching your search' : 'No attendees registered yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredAttendees.length > 0 && (
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

export default WorkshopAttendees;
