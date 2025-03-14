
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
import { Search, Mail, Calendar, User, MapPin, Phone, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface UserWithWorkshops {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
  workshops: {
    id: string;
    title: string;
    date: string;
    status: string;
  }[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithWorkshops[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .order(sortField, { ascending: sortDirection === 'asc' });
          
        if (userError) throw userError;
        
        // Fetch workshops and registrations
        const { data: registrations, error: registrationsError } = await supabase
          .from('registrations')
          .select('*, workshop:workshops(*)');
          
        if (registrationsError) throw registrationsError;
        
        // Process data to combine users with their workshop registrations
        const usersWithWorkshops = (userData || []).map(user => {
          const userRegistrations = registrations?.filter(reg => reg.user_id === user.id) || [];
          
          const workshops = userRegistrations.map(registration => {
            const workshop = registration.workshop as any;
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
            
            return {
              id: workshop.id,
              title: workshop.title,
              date: format(new Date(workshop.start_date), 'MMM d, yyyy'),
              status
            };
          });
          
          return {
            ...user,
            workshops
          };
        });
        
        setUsers(usersWithWorkshops);
      } catch (error) {
        console.error('Error fetching users data:', error);
        toast({
          title: "Error loading users",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [sortField, sortDirection, toast]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  );

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
        <p className="text-slate-500">Manage users and view their workshop registrations</p>
      </div>

      {/* Search */}
      <Card className="mb-6 border border-slate-200">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email or phone..."
              className="pl-10 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Users table */}
      <Card className="overflow-hidden border border-slate-200">
        <div className="rounded-md border-b border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('last_name')}
                >
                  <div className="flex items-center">
                    User
                    {sortField === 'last_name' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Contact
                    {sortField === 'email' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Joined
                    {sortField === 'created_at' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Workshops</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-slate-500">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {user.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-slate-700">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-slate-700">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-700">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        <span className="text-sm">
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        {user.workshops.length > 0 ? (
                          user.workshops.map((workshop, index) => (
                            <div key={index} className="flex flex-col">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-slate-800">{workshop.title}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">{workshop.date}</span>
                                <Badge variant={
                                  workshop.status === 'active' ? 'default' : 
                                  workshop.status === 'upcoming' ? 'secondary' : 'outline'
                                } className={
                                  workshop.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                                  workshop.status === 'upcoming' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
                                  'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }>
                                  {workshop.status}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">No workshops registered</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-200">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No users found
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

export default AdminUsers;
