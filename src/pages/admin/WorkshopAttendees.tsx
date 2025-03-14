
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, Mail, Calendar, Clock, MapPin, Users, CalendarClock } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-slate-600">Loading...</span>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Workshop not found</h3>
        <p className="text-slate-500 mb-6">The workshop you're looking for does not exist or has been removed.</p>
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
          <Link to="/admin/workshops" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-slate-900">{workshop.title}</h2>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
              {attendees.length} / {workshop.capacity} registered
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center text-slate-600">
              <CalendarClock className="h-4 w-4 mr-2 text-indigo-600" />
              <div>
                <div className="text-sm font-medium">{formatDate(workshop.start_date)}</div>
                <div className="text-xs text-slate-500">{formatTime(workshop.start_date)} - {formatTime(workshop.end_date)}</div>
              </div>
            </div>
            
            <div className="flex items-center text-slate-600">
              <MapPin className="h-4 w-4 mr-2 text-indigo-600" />
              <div className="text-sm">{workshop.location}</div>
            </div>
            
            <div className="flex items-center text-slate-600">
              <Users className="h-4 w-4 mr-2 text-indigo-600" />
              <div className="text-sm">{Math.round((attendees.length / workshop.capacity) * 100)}% Capacity</div>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search attendees..."
              className="pl-10 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200">
            <Mail size={16} />
            Email All
          </Button>
        </div>
      </Card>
      
      <Card className="overflow-hidden">
        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">
                      {attendee.first_name} {attendee.last_name}
                    </TableCell>
                    <TableCell className="text-slate-700">{attendee.email}</TableCell>
                    <TableCell className="text-slate-700">
                      {attendee.phone || <span className="text-slate-400">Not provided</span>}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {formatDate(attendee.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={attendee.status === 'confirmed' ? 'default' : 'secondary'} className={
                        attendee.status === 'confirmed' 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }>
                        {attendee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    {loading 
                      ? <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>
                      : searchQuery 
                        ? "No attendees match your search" 
                        : "No attendees registered yet"
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default WorkshopAttendees;
