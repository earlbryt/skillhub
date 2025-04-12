
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { isUserAdmin } from '@/services/userService';
import UserManagement from './UserManagement';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Edit,
  UserCheck,
  UserX
} from 'lucide-react';

interface UserProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  role?: string;
  is_admin?: boolean;
  is_active?: boolean;
  user_id?: string; // Added this property to fix the TypeScript error
  workshops: {
    id: string;
    title: string;
    start_date: string;
    location: string;
    status: string;
  }[];
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId
}) => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get the registration with the specified ID
      const { data: registration, error: registrationError } = await supabase
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
            start_date,
            location
          )
        `)
        .eq('id', userId)
        .single();
        
      if (registrationError) throw registrationError;
      
      if (!registration) {
        throw new Error('User not found');
      }
      
      // Get all registrations with the same email to find all workshops
      const { data: userRegistrations, error: registrationsError } = await supabase
        .from('registrations')
        .select(`
          id,
          status,
          created_at,
          workshop:workshops(
            id,
            title,
            start_date,
            location
          )
        `)
        .eq('email', registration.email);
        
      if (registrationsError) throw registrationsError;
      
      // Check if user is an admin
      let isAdmin = false;
      if (registration.user_id) {
        isAdmin = await isUserAdmin(registration.user_id);
      }
      
      // For demo purposes, we'll set some default values if not available
      const role = isAdmin ? 'admin' : (Math.random() < 0.3 ? 'instructor' : 'user');
      const isActive = Math.random() < 0.9; // 90% of users are active
      
      // Process the workshops data
      const workshops = userRegistrations?.map(reg => ({
        id: (reg.workshop as any).id,
        title: (reg.workshop as any).title,
        start_date: (reg.workshop as any).start_date,
        location: (reg.workshop as any).location,
        status: reg.status
      })) || [];
      
      setUserData({
        id: registration.id,
        email: registration.email,
        first_name: registration.first_name,
        last_name: registration.last_name,
        phone: registration.phone,
        created_at: registration.created_at,
        role: role,
        is_admin: isAdmin,
        is_active: isActive,
        user_id: registration.user_id, // Ensure user_id is set here
        workshops: workshops
      });
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'An error occurred while fetching user data.');
      toast({
        title: "Error",
        description: err.message || 'An error occurred while fetching user data.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle user activation/deactivation
  const handleToggleActive = async () => {
    if (!userData) return;
    
    try {
      // In a real app, this would update the user's active status in the database
      // For demo purposes, we'll just show a toast
      toast({
        title: userData.is_active ? "User Deactivated" : "User Activated",
        description: `${userData.first_name} ${userData.last_name} has been ${userData.is_active ? 'deactivated' : 'activated'}.`,
        variant: "default",
      });
      
      // Update local state
      setUserData(prev => prev ? {
        ...prev,
        is_active: !prev.is_active
      } : null);
      
      onSuccess();
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      toast({
        title: "Error",
        description: err.message || 'An error occurred while updating user status.',
        variant: "destructive",
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Get status badge style
  const getStatusBadgeStyle = (isActive?: boolean) => {
    if (isActive === undefined) return 'bg-gray-100 text-gray-800 border-gray-200';
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const handleAdminStatusChange = () => {
    // Refresh the user data after admin status change
    fetchUserData();
    onSuccess();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading user data...</span>
          </div>
        ) : userData ? (
          <div className="space-y-6">
            {/* User header */}
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium shadow-md">
                {userData.first_name.charAt(0)}{userData.last_name.charAt(0)}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-900">
                  {userData.first_name} {userData.last_name}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                  <Badge className={getStatusBadgeStyle(userData.is_active)}>
                    {userData.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  {userData.role && (
                    <Badge className={userData.is_admin 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }>
                      {userData.is_admin ? 'Admin' : userData.role}
                    </Badge>
                  )}
                  
                  <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                    {userData.workshops.length} Workshops
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
                
                <Button 
                  variant={userData.is_active ? "destructive" : "default"} 
                  size="sm" 
                  className="h-9"
                  onClick={handleToggleActive}
                >
                  {userData.is_active ? (
                    <>
                      <UserX className="h-4 w-4 mr-1.5" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-1.5" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="workshops">Workshops</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>
              
              {/* User Details Tab */}
              <TabsContent value="details" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{userData.email}</p>
                          <p className="text-xs text-gray-500">Email Address</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{userData.phone || 'Not provided'}</p>
                          <p className="text-xs text-gray-500">Phone Number</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{formatDate(userData.created_at)}</p>
                          <p className="text-xs text-gray-500">Joined Date</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div className="flex flex-col gap-3 w-full">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{userData.is_admin ? 'Yes' : 'No'}</p>
                            <p className="text-xs text-gray-500">Admin Access</p>
                          </div>
                          
                          {userData.user_id && (
                            <UserManagement 
                              userId={userData.user_id}
                              email={userData.email}
                              isAdmin={userData.is_admin || false}
                              onStatusChange={handleAdminStatusChange}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Workshops Tab */}
              <TabsContent value="workshops" className="pt-4">
                {userData.workshops.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Registered Workshops</h3>
                    
                    <div className="space-y-3">
                      {userData.workshops.map((workshop) => (
                        <div key={workshop.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{workshop.title}</h4>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                  {formatDate(workshop.start_date)}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                                  {formatTime(workshop.start_date)}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                  {workshop.location}
                                </div>
                              </div>
                            </div>
                            
                            <Badge className={
                              workshop.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
                              workshop.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              workshop.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }>
                              {workshop.status.charAt(0).toUpperCase() + workshop.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    This user hasn't registered for any workshops yet.
                  </div>
                )}
              </TabsContent>
              
              {/* Activity Log Tab */}
              <TabsContent value="activity" className="pt-4">
                <div className="text-center py-8 text-gray-500">
                  <p>Activity log is not available in the demo version.</p>
                  <p className="text-sm mt-2">In a production environment, this would show login history, profile updates, and other user activities.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            User not found or an error occurred.
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
