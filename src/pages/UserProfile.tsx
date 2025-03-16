import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, ChevronRight, Bell, Settings, Camera, Pencil } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getMyRegistrations } from '@/services/workshopService';
import { format } from 'date-fns';
import { Registration, Workshop } from '@/types/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('workshops');
  const [registeredWorkshops, setRegisteredWorkshops] = useState<(Registration & { workshop: Workshop })[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (user?.id) {
        try {
          const registrations = await getMyRegistrations(user.id);
          setRegisteredWorkshops(registrations);
        } catch (error) {
          console.error('Error fetching registrations:', error);
          toast({
            title: "Error",
            description: "Failed to load your registered workshops.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    // Initialize profile photo from user metadata if available
    if (user?.user_metadata?.avatar_url) {
      setProfilePhotoUrl(user.user_metadata.avatar_url);
    }

    fetchRegistrations();
  }, [user, toast]);

  // Filter workshops by date
  const currentDate = new Date();
  const upcomingWorkshops = registeredWorkshops.filter(
    reg => new Date(reg.workshop.start_date) > currentDate
  );
  
  const pastWorkshops = registeredWorkshops.filter(
    reg => new Date(reg.workshop.end_date) < currentDate
  );

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user phone if available
  const getUserPhone = () => {
    if (user?.user_metadata?.phone) {
      return user.user_metadata.phone;
    }
    return 'No phone number';
  };

  // Handle settings click
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Account settings will be available in a future update.",
      variant: "default",
    });
  };

  // Handle notifications click
  const handleNotificationsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Notification preferences will be available in a future update.",
      variant: "default",
    });
  };

  // Handle profile photo edit
  const handleProfilePhotoClick = () => {
    setIsEditProfileOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle save profile photo
  const handleSaveProfilePhoto = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setIsEditProfileOpen(false);
      
      toast({
        title: "Profile Photo Updated",
        description: "Your profile photo has been successfully updated.",
        variant: "default",
      });
    }, 1500);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    {profilePhotoUrl ? (
                      <AvatarImage src={profilePhotoUrl} alt={getUserDisplayName()} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {getInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 shadow-md"
                    onClick={handleProfilePhotoClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">{getUserDisplayName()}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {format(new Date(user?.created_at || Date.now()), 'MMMM yyyy')}
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-muted-foreground mr-3" />
                  <div className="text-sm">{user?.email}</div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-muted-foreground mr-3" />
                  <div className="text-sm">{getUserPhone()}</div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full justify-start mb-2" 
                  onClick={handleSettingsClick}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleNotificationsClick}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Preferences
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Tabs Navigation */}
            <div className="flex space-x-4 mb-6 border-b border-border">
              <button
                className={`pb-2 px-1 font-medium text-sm ${activeTab === 'workshops' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('workshops')}
              >
                My Workshops
              </button>
              <button
                className={`pb-2 px-1 font-medium text-sm ${activeTab === 'certificates' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('certificates')}
              >
                Certificates
              </button>
            </div>
            
            {/* Workshops Content */}
            {activeTab === 'workshops' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Workshops</h2>
                  <Button asChild>
                    <Link to="/workshops">Browse More Workshops</Link>
                  </Button>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="h-32 bg-card animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">Upcoming Workshops</h3>
                    
                    {upcomingWorkshops.length > 0 ? (
                      upcomingWorkshops.map(registration => (
                        <div key={registration.id} className="bg-card rounded-lg shadow-md overflow-hidden hover-scale">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-32 md:h-auto">
                              <img 
                                src={registration.workshop.image_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"} 
                                alt={registration.workshop.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="text-xl font-semibold mb-2">{registration.workshop.title}</h4>
                                <div className="flex items-center text-sm text-muted-foreground mb-4">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  <span>
                                    {format(new Date(registration.workshop.start_date), 'MMMM d, yyyy')} • 
                                    {format(new Date(registration.workshop.start_date), 'h:mm a')} - 
                                    {format(new Date(registration.workshop.end_date), 'h:mm a')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/workshops/${registration.workshop.id}`}>
                                    View Details
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-6 text-center">
                        <p className="text-muted-foreground mb-4">You don't have any upcoming workshops.</p>
                        <Button asChild>
                          <Link to="/workshops">Browse Workshops</Link>
                        </Button>
                      </div>
                    )}
                    
                    {pastWorkshops.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold text-muted-foreground mt-8">Past Workshops</h3>
                        {pastWorkshops.map(registration => (
                          <div key={registration.id} className="bg-card rounded-lg shadow-md overflow-hidden hover-scale opacity-80">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/3 h-32 md:h-auto">
                                <img 
                                  src={registration.workshop.image_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"} 
                                  alt={registration.workshop.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-xl font-semibold mb-2">{registration.workshop.title}</h4>
                                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>
                                      {format(new Date(registration.workshop.start_date), 'MMMM d, yyyy')} • 
                                      {format(new Date(registration.workshop.start_date), 'h:mm a')} - 
                                      {format(new Date(registration.workshop.end_date), 'h:mm a')}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link to={`/workshops/${registration.workshop.id}`}>
                                      View Details
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Certificates Content */}
            {activeTab === 'certificates' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">My Certificates</h2>
                
                {pastWorkshops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastWorkshops.map(registration => (
                      <div key={registration.id} className="bg-card rounded-lg shadow-md p-6 hover-scale">
                        <h3 className="text-lg font-semibold mb-2">{registration.workshop.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Completed on {format(new Date(registration.workshop.end_date), 'MMMM d, yyyy')}
                        </p>
                        <Button variant="outline" className="w-full">View Certificate</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">You haven't completed any workshops yet.</p>
                    <Button asChild>
                      <Link to="/workshops">Browse Workshops</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Photo Edit Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile photo or choose from our gallery.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-5">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
              {profilePhotoUrl ? (
                <AvatarImage src={profilePhotoUrl} alt={getUserDisplayName()} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <Button 
              variant="outline" 
              onClick={handleUploadClick}
              className="mb-2"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Choose Photo
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: Square image, at least 300x300 pixels
            </p>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProfilePhoto}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
