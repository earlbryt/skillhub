
import React, { useState, useEffect } from 'react';
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
import { 
  Eye, 
  Search, 
  Plus,
  ArrowUp,
  ArrowDown,
  Users,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

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
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Prepare chart data
  const chartData = workshops.map(workshop => ({
    name: workshop.title.length > 20 ? workshop.title.substring(0, 20) + '...' : workshop.title,
    registrations: workshop.registrations_count,
    capacity: workshop.capacity,
    fill: workshop.registrations_count >= workshop.capacity ? '#94a3b8' : 
          workshop.registrations_count >= workshop.capacity * 0.8 ? '#0369a1' : '#2563eb'
  })).slice(0, 6);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Workshops</h2>
          <p className="text-slate-500">Manage your workshops and view registrations</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={16} /> Add Workshop
        </Button>
      </div>
      
      {/* Registration Overview Chart */}
      <Card className="mb-8 p-6 border border-slate-200 overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-slate-900">Registration Overview</h3>
          <p className="text-sm text-slate-500">Workshop registrations vs. capacity</p>
        </div>
        <div className="h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  tickMargin={10}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-md">
                          <p className="font-medium text-slate-900 mb-1">{label}</p>
                          <p className="text-sm text-blue-600">Registrations: {payload[0].value}</p>
                          <p className="text-sm text-slate-600">Capacity: {payload[1].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="registrations" name="Registrations" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="capacity" name="Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No workshop data available
            </div>
          )}
        </div>
      </Card>
      
      {/* Search and filter */}
      <Card className="mb-6 border border-slate-200">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search workshops..."
              className="pl-10 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      {/* Workshops table */}
      <Card className="overflow-hidden border border-slate-200">
        <div className="rounded-md border-b border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Workshop
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('start_date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'start_date' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Registration
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-slate-500">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredWorkshops.length > 0 ? (
                filteredWorkshops.map((workshop) => (
                  <TableRow key={workshop.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="font-medium text-slate-900">{workshop.title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1">{workshop.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-slate-700">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          {formatDate(workshop.start_date)}
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          {formatTime(workshop.start_date)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-700">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {workshop.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1.5 text-slate-400" />
                        <span className={`font-medium ${
                          workshop.registrations_count >= workshop.capacity 
                            ? 'text-slate-700' 
                            : workshop.registrations_count >= workshop.capacity * 0.8
                              ? 'text-blue-600'
                              : 'text-blue-600'
                        }`}>
                          {workshop.registrations_count}
                        </span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-600">{workshop.capacity}</span>
                      </div>
                      {workshop.registrations_count >= workshop.capacity && (
                        <div className="text-xs text-slate-600 mt-1">
                          At capacity
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        workshop.registration_status === 'active' ? 'default' : 
                        workshop.registration_status === 'upcoming' ? 'secondary' : 'outline'
                      } className={
                        workshop.registration_status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                        workshop.registration_status === 'upcoming' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
                        'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }>
                        {workshop.registration_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild className="border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-200">
                        <Link to={`/admin/workshops/${workshop.id}/attendees`}>
                          <Eye className="h-4 w-4" />
                          <span className="ml-1.5">Attendees</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    No workshops found
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

export default AdminWorkshops;
