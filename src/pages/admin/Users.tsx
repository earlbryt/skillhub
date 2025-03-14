
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users as UsersIcon, Search, Calendar, Clock } from 'lucide-react';

interface Workshop {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
}

interface Registration {
  id: string;
  workshop_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  workshop: Workshop;
}

interface UserWithWorkshops {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  registrations: Registration[];
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserWithWorkshops[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Get all registrations with their related workshops
        const { data: registrations, error: registrationsError } = await supabase
          .from('registrations')
          .select(`
            id,
            workshop_id,
            first_name,
            last_name,
            email,
            created_at,
            workshop:workshops(
              id,
              title,
              start_date,
              end_date
            )
          `)
          .order('created_at', { ascending: false });
          
        if (registrationsError) throw registrationsError;
        
        // Group registrations by email to get user data
        const userMap = new Map<string, UserWithWorkshops>();
        
        registrations?.forEach(registration => {
          const email = registration.email;
          
          if (!userMap.has(email)) {
            userMap.set(email, {
              id: registration.id, // Using registration ID as user ID for now
              first_name: registration.first_name,
              last_name: registration.last_name,
              email: registration.email,
              registrations: []
            });
          }
          
          const user = userMap.get(email);
          if (user) {
            user.registrations.push(registration);
          }
        });
        
        setUsers(Array.from(userMap.values()));
      } catch (error) {
        console.error('Error fetching users:', error);
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
  }, [toast]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search);
  });

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Users & Workshops</h2>
        <p className="text-slate-500">View users and their workshop registrations</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="pl-10 w-full rounded-md border border-slate-200 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading user data...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="p-6 border border-slate-200 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{user.first_name} {user.last_name}</h3>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                    {user.registrations.length} Workshop{user.registrations.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                {user.registrations.length > 0 && (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Workshop</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registration Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {user.registrations.map((registration) => (
                          <tr key={registration.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">{registration.workshop?.title}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center text-sm text-slate-500">
                                <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                                {formatDate(registration.workshop?.start_date)}
                              </div>
                              <div className="flex items-center text-sm text-slate-500">
                                <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                                {formatTime(registration.workshop?.start_date)}
                              </div>
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
                )}
              </Card>
            ))
          ) : (
            <div className="text-center p-8 bg-slate-50 rounded-lg border border-slate-200">
              <UsersIcon className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-lg font-medium text-slate-900">No users found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {searchTerm ? 'Try a different search term' : 'No users have registered for workshops yet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
