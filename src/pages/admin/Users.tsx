
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
import { Search, Mail, ExternalLink, BookOpen } from 'lucide-react';
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
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
          <p className="text-slate-500">View users and their workshop registrations</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      <Card className="overflow-hidden">
        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Workshops</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      <span className="ml-2 text-slate-500">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.email} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell className="text-slate-700">{user.email}</TableCell>
                    <TableCell className="text-slate-700">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        {user.workshops.length > 0 ? (
                          user.workshops.map((workshop, index) => (
                            <Badge 
                              key={workshop.id} 
                              variant="outline" 
                              className="justify-start w-fit bg-slate-50 border-slate-200 text-slate-700"
                            >
                              <BookOpen className="h-3 w-3 mr-1 text-indigo-600" />
                              {workshop.title}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm">No workshops</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        {user.id && (
                          <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
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
