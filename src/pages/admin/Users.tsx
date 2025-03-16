import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  User,
  UserPlus,
  Filter,
  Download,
  Shield,
  Edit,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearch } from './Dashboard';
import UserForm from '@/components/admin/UserForm';
import UserProfile from '@/components/admin/UserProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserWithWorkshops = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  role?: string;
  is_admin?: boolean;
  is_active?: boolean;
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
  const { searchQuery } = useSearch();
  
  // User form state
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithWorkshops | undefined>(undefined);
  
  // User profile state
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  
  // Filter state
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUsers();
  }, [toast]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all registrations with workshop data
      const { data: registrationsData, error: registrationsError } = await supabase
        .from('registrations')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          email,
          phone,
          status,
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
          // For demo purposes, we'll set some default values for admin status
          // In a real app, this would come from a proper user management system
          const isAdmin = registration.email.includes('admin') || Math.random() < 0.2;
          
          userMap.set(userKey, {
            id: registration.id,
            email: registration.email,
            first_name: registration.first_name,
            last_name: registration.last_name,
            created_at: registration.created_at,
            is_admin: isAdmin,
            is_active: true,
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
  
  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.workshops.some(workshop => 
          workshop.title.toLowerCase().includes(query)
        );
        
      if (!matchesSearch) return false;
    }
    
    // Apply role filter
    if (roleFilter) {
      if (roleFilter === 'admin' && !user.is_admin) return false;
      if (roleFilter === 'user' && user.is_admin) return false;
    }
    
    return true;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Handle adding a new user
  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsUserFormOpen(true);
  };
  
  // Handle editing a user
  const handleEditUser = (user: UserWithWorkshops) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };
  
  // Handle viewing a user profile
  const handleViewUser = (userId: string) => {
    setViewUserId(userId);
    setIsUserProfileOpen(true);
  };
  
  // Handle user form close
  const handleUserFormClose = () => {
    setIsUserFormOpen(false);
    setSelectedUser(undefined);
  };
  
  // Handle user form success
  const handleUserFormSuccess = () => {
    fetchUsers();
  };
  
  // Handle user profile close
  const handleUserProfileClose = () => {
    setIsUserProfileOpen(false);
    setViewUserId(null);
  };
  
  // Handle role filter change
  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setRoleFilter(null);
  };
  
  // Toggle admin status
  const toggleAdminStatus = async (user: UserWithWorkshops) => {
    try {
      // In a real app, this would update the admin status in the database
      // For now, we'll just update the local state
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, is_admin: !u.is_admin };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      
      toast({
        title: "Admin status updated",
        description: `${user.first_name} ${user.last_name} is now ${!user.is_admin ? 'an admin' : 'a regular user'}.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error updating admin status",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  // Export users as CSV
  const exportUsers = () => {
    // Get users to export
    const usersToExport = filteredUsers;
      
    // Create CSV content
    const headers = ['First Name', 'Last Name', 'Email', 'Admin', 'Joined Date', 'Workshops Count'];
    const csvContent = [
      headers.join(','),
      ...usersToExport.map(user => [
        user.first_name,
        user.last_name,
        user.email,
        user.is_admin ? 'Yes' : 'No',
        formatDate(user.created_at),
        user.workshops.length
      ].join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: `Exported ${usersToExport.length} users to CSV.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || roleFilter
                ? `${filteredUsers.length} users found`
                : `Total ${users.length} users registered`
              }
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs border-gray-200 bg-white text-gray-700 hover:text-blue-700 shadow-sm">
                  <Filter className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span>Filter</span>
                  {roleFilter && (
                    <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">Role</p>
                  <div className="space-y-1 mb-3">
                    <button 
                      className={`w-full text-left px-2 py-1 text-sm rounded-md ${roleFilter === 'admin' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleRoleFilter(roleFilter === 'admin' ? null : 'admin')}
                    >
                      Administrators
                    </button>
                    <button 
                      className={`w-full text-left px-2 py-1 text-sm rounded-md ${roleFilter === 'user' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleRoleFilter(roleFilter === 'user' ? null : 'user')}
                    >
                      Regular Users
                    </button>
                  </div>
                  
                  {roleFilter && (
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Export button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-xs border-gray-200 bg-white text-gray-700 hover:text-blue-700 shadow-sm"
              onClick={exportUsers}
            >
              <Download className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
              <span>Export</span>
            </Button>
            
            {/* Add user button */}
            <Button 
              className="h-9 text-xs bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
              onClick={handleAddUser}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              <span>Add User</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Users table */}
      {loading ? (
        <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      ) : filteredUsers.length > 0 ? (
        <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Workshops</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id || user.email} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                          {user.first_name ? user.first_name.charAt(0) : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <button 
                            className="font-medium text-gray-900 hover:text-blue-600"
                            onClick={() => handleViewUser(user.id)}
                          >
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}` 
                              : user.email.split('@')[0]
                            }
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">
                      {user.is_admin ? (
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                          Admin
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-600">User</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="py-4 px-4">
                      <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                        {user.workshops.length}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-gray-200 text-gray-700 hover:text-blue-700"
                          onClick={() => handleViewUser(user.id)}
                          title="View Profile"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-gray-200 text-gray-700 hover:text-blue-700"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          <Edit className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-gray-200 text-gray-700 hover:text-blue-700"
                          onClick={() => toggleAdminStatus(user)}
                          title={user.is_admin ? "Remove Admin Access" : "Grant Admin Access"}
                        >
                          <Shield className={`h-3.5 w-3.5 ${user.is_admin ? 'text-red-500' : 'text-green-500'}`} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t border-gray-200 text-sm bg-gray-50">
            <p className="text-gray-600">
              <span>Page 1 of 1</span>
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md bg-white flex items-center gap-1 text-gray-500 shadow-sm" disabled>
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button className="px-3 py-1 border border-transparent rounded-md bg-blue-500 text-white flex items-center gap-1 shadow-sm" disabled>
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 border border-gray-200">
          {searchQuery || roleFilter
            ? `No users found matching your criteria`
            : "No users found"
          }
        </div>
      )}
      
      {/* User Form Dialog */}
      {isUserFormOpen && (
        <UserForm
          isOpen={isUserFormOpen}
          onClose={handleUserFormClose}
          onSuccess={handleUserFormSuccess}
          user={selectedUser ? {
            id: selectedUser.id,
            email: selectedUser.email,
            first_name: selectedUser.first_name,
            last_name: selectedUser.last_name,
            is_admin: selectedUser.is_admin,
            is_active: selectedUser.is_active
          } : undefined}
        />
      )}
      
      {/* User Profile Dialog */}
      {isUserProfileOpen && viewUserId && (
        <UserProfile
          isOpen={isUserProfileOpen}
          onClose={handleUserProfileClose}
          onSuccess={handleUserFormSuccess}
          userId={viewUserId}
        />
      )}
    </div>
  );
};

export default AdminUsers;
