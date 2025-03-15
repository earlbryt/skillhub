
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, ExternalLink, BookOpen, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Workshop } from '@/types/supabase';

type UserWithWorkshops = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  workshops: {
    id: string;
    title: string;
    start_date: string;
  }[];
};

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserWithWorkshops[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsersWithWorkshops = async () => {
      try {
        setLoading(true);
        
        // First get all registrations with workshop data
        const { data: registrationsData, error: registrationsError } = await supabase
          .from('registrations')
          .select(`
            user_id,
            first_name,
            last_name,
            email,
            created_at,
            workshop:workshops(
              id,
              title,
              start_date
            )
          `)
          .order('created_at', { ascending: false });
          
        if (registrationsError) throw registrationsError;
        
        // Process the data to group by user
        const userMap = new Map<string, UserWithWorkshops>();
        
        registrationsData?.forEach(registration => {
          // Use email as unique identifier since it's always present
          const userKey = registration.email;
          
          if (!userMap.has(userKey)) {
            userMap.set(userKey, {
              id: registration.user_id || '',
              email: registration.email,
              first_name: registration.first_name,
              last_name: registration.last_name,
              created_at: registration.created_at,
              workshops: []
            });
          }
          
          // Add workshop to user's workshops if not already added
          const user = userMap.get(userKey);
          if (user && registration.workshop) {
            const workshopExists = user.workshops.some(w => w.id === (registration.workshop as any).id);
            if (!workshopExists) {
              user.workshops.push({
                id: (registration.workshop as any).id,
                title: (registration.workshop as any).title,
                start_date: (registration.workshop as any).start_date
              });
            }
          }
        });
        
        setUsers(Array.from(userMap.values()));
      } catch (error) {
        console.error('Error fetching users with workshops:', error);
        toast({
          title: "Error fetching users",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsersWithWorkshops();
  }, [toast]);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd-MM-yyyy');
  };

  return (
    <div>
      {/* Users Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Users</h2>
          <p className="text-sm text-gray-500">Total {users.length} users registered</p>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full py-2 px-4 pr-10 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Users table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Workshops</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.email} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {user.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1.5">
                        {user.workshops.length > 0 ? (
                          <div className="flex items-center">
                            <BookOpen className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                            <span className="text-sm">{user.workshops.length} workshops</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No workshops</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-gray-200 text-gray-700 hover:text-blue-700">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        {user.id && (
                          <Button variant="outline" size="sm" className="h-8 border-gray-200 text-gray-700 hover:text-blue-700">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-8 border-gray-200 text-gray-700 hover:text-blue-700">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
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

export default AdminUsers;
