import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  UserPlus,
  Filter,
  Download,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Workshop } from '@/types/supabase';
import { useSearch } from './Dashboard';
import UserForm from '@/components/admin/UserForm';
import UserProfile from '@/components/admin/UserProfile';
import UserBulkActions from '@/components/admin/UserBulkActions';
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
  
  // Selected users for bulk actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // User form state
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithWorkshops | undefined>(undefined);
  
  // User profile state
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  
  // Bulk actions state
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  
  // Filter state
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
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
          const role = isAdmin ? 'admin' : (Math.random() < 0.3 ? 'instructor' : 'user');
          const isActive = Math.random() < 0.9; // 90% of users are active
          
          userMap.set(userKey, {
            id: registration.id,
            email: registration.email,
            first_name: registration.first_name,
            last_name: registration.last_name,
            created_at: registration.created_at,
            role: role,
            is_admin: isAdmin,
            is_active: isActive,
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
      if (roleFilter !== 'admin' && roleFilter !== 'user' && user.role !== roleFilter) return false;
    }
    
    // Apply status filter
    if (statusFilter) {
      if (statusFilter === 'active' && user.is_active === false) return false;
      if (statusFilter === 'inactive' && user.is_active !== false) return false;
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
  
  // Handle checkbox change for a single user
  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };
  
  // Handle select all checkbox change
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    if (checked) {
      // Select all visible users
      setSelectedUserIds(filteredUsers.map(user => user.id));
    } else {
      // Deselect all
      setSelectedUserIds([]);
    }
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
  
  // Handle bulk actions open
  const handleBulkActionsOpen = () => {
    if (selectedUserIds.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }
    
    setIsBulkActionsOpen(true);
  };
  
  // Handle bulk actions close
  const handleBulkActionsClose = () => {
    setIsBulkActionsOpen(false);
  };
  
  // Handle bulk actions success
  const handleBulkActionsSuccess = () => {
    fetchUsers();
    setSelectedUserIds([]);
    setSelectAll(false);
  };
  
  // Handle role filter change
  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role);
  };
  
  // Handle status filter change
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setRoleFilter(null);
    setStatusFilter(null);
  };
  
  // Export users as CSV
  const exportUsers = () => {
    // Get users to export (either selected or all filtered)
    const usersToExport = selectedUserIds.length > 0
      ? filteredUsers.filter(user => selectedUserIds.includes(user.id))
      : filteredUsers;
      
    // Create CSV content
    const headers = ['First Name', 'Last Name', 'Email', 'Role', 'Admin', 'Active', 'Joined Date', 'Workshops Count'];
    const csvContent = [
      headers.join(','),
      ...usersToExport.map(user => [
        user.first_name,
        user.last_name,
        user.email,
        user.role || 'user',
        user.is_admin ? 'Yes' : 'No',
        user.is_active !== false ? 'Yes' : 'No',
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
              {searchQuery || roleFilter || statusFilter
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
                  {(roleFilter || statusFilter) && (
                    <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {(roleFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
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
                      className={`w-full text-left px-2 py-1 text-sm rounded-md ${roleFilter === 'instructor' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleRoleFilter(roleFilter === 'instructor' ? null : 'instructor')}
                    >
                      Instructors
                    </button>
                    <button 
                      className={`w-full text-left px-2 py-1 text-sm rounded-md ${roleFilter === 'user' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleRoleFilter(roleFilter === 'user' ? null : 'user')}
                    >
                      Regular Users
                    </button>
                  </div>
                  
                  <p className="text-xs font-medium text-gray-500 mb-2">Status</p>
                  <div className="space-y-1 mb-3">
                    <button 
                      className={`w-full text-left px-2 py-1 text-sm rounded-md ${statusFilter === 'active' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleStatusFilter(statusFilter === 'active' ? null : 'active')}
                    >
                      Active Users
                    </button>
                    <button 
                      className={`w-full text-left px-2 py-1 text-sm rounded-md ${statusFilter === 'inactive' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleStatusFilter(statusFilter === 'inactive' ? null : 'inactive')}
                    >
                      Inactive Users
                    </button>
                  </div>
                  
                  {(roleFilter || statusFilter) && (
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
            
            {/* Bulk actions button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-xs border-gray-200 bg-white text-gray-700 hover:text-blue-700 shadow-sm"
              onClick={handleBulkActionsOpen}
              disabled={selectedUserIds.length === 0}
            >
              <UserCheck className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
              <span>Bulk Actions</span>
              {selectedUserIds.length > 0 && (
                <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {selectedUserIds.length}
                </Badge>
              )}
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
                  <th className="py-3 px-4 text-left">
                    <Checkbox 
                      checked={selectAll} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all users"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Workshops</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id || user.email} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-4 px-4">
                      <Checkbox 
                        checked={selectedUserIds.includes(user.id)} 
                        onCheckedChange={(checked) => handleUserSelect(user.id, !!checked)}
                        aria-label={`Select ${user.first_name} ${user.last_name}`}
                      />
                    </td>
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
                      ) : user.role && user.role !== 'user' ? (
                        <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-600">User</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {user.is_active !== false ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border border-red-200">
                          Inactive
                        </Badge>
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
                        >
                          <User className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-gray-200 text-gray-700 hover:text-blue-700"
                          onClick={() => handleEditUser(user)}
                        >
                          <Mail className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                              <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                              <User className="h-4 w-4 mr-2 text-blue-500" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <User className="h-4 w-4 mr-2 text-blue-500" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.is_active !== false ? (
                              <DropdownMenuItem>
                                <UserX className="h-4 w-4 mr-2 text-red-500" />
                                Deactivate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              {selectedUserIds.length > 0 ? (
                <span>{selectedUserIds.length} users selected</span>
              ) : (
                <span>Page 1 of 1</span>
              )}
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
          {searchQuery || roleFilter || statusFilter
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
            role: selectedUser.role,
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
      
      {/* Bulk Actions Dialog */}
      {isBulkActionsOpen && (
        <UserBulkActions
          isOpen={isBulkActionsOpen}
          onClose={handleBulkActionsClose}
          onSuccess={handleBulkActionsSuccess}
          selectedUserIds={selectedUserIds}
        />
      )}
    </div>
  );
};

export default AdminUsers;
