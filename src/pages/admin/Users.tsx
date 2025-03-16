import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  ExternalLink, 
  BookOpen, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  User,
  Clock,
  Shield
} from 'lucide-react';
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
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  return (
    <div className="bg-gray-50">
      {/* Users Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Users</h2>
          <p className="text-sm text-gray-500">Total {users.length} users registered</p>
        </div>
      </div>
      
      {/* Users cards */}
      {loading ? (
        <div className="flex justify-center items-center py-8 bg-white rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading users...</span>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {users.map((user) => (
            <Card key={user.email} className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white">
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* User info */}
                  <div className="flex items-start gap-3 mb-3 md:mb-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-base font-medium flex-shrink-0">
                      {user.first_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{user.first_name} {user.last_name}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Mail className="h-3.5 w-3.5 mr-1 text-blue-500" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="h-3.5 w-3.5 mr-1 text-green-500" />
                        <span>Joined on {formatDate(user.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mb-3 md:mb-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 bg-white text-gray-700 hover:text-blue-700">
                      <Mail className="h-3.5 w-3.5 text-blue-500 mr-1" />
                      <span>Email</span>
                    </Button>
                    {user.id && (
                      <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 bg-white text-gray-700 hover:text-blue-700">
                        <User className="h-3.5 w-3.5 text-gray-500 mr-1" />
                        <span>Profile</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200 bg-white text-gray-700 hover:text-blue-700">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                {/* Workshop info */}
                {user.workshops.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-3.5 w-3.5 mr-1 text-gray-500" />
                      <span className="font-medium text-sm text-gray-700">
                        {user.workshops.length} Workshop{user.workshops.length > 1 ? 's' : ''} Registered
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {user.workshops.slice(0, 2).map(workshop => (
                        <div key={workshop.id} className="bg-gray-100 p-2 rounded-md">
                          <div className="font-medium text-sm text-gray-800">{workshop.title}</div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                            {formatDate(workshop.start_date)}
                          </div>
                        </div>
                      ))}
                      
                      {user.workshops.length > 2 && (
                        <div className="bg-gray-100 p-2 rounded-md flex items-center justify-center text-xs text-blue-500">
                          <span>+{user.workshops.length - 2} more workshops</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-2 bg-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="h-3.5 w-3.5 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">
                    {user.id ? 'Registered User' : 'Guest Registration'}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-200 bg-white text-gray-700 hover:text-blue-700">
                  <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          No users found
        </div>
      )}
      
      {/* Pagination */}
      {users.length > 0 && (
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
    </div>
  );
};

export default AdminUsers;
