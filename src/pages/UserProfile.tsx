import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, ChevronRight, Bell, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getMyRegistrations } from '@/services/workshopService';
import { format } from 'date-fns';
import { Registration, Workshop } from '@/types/supabase';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('workshops');
  const [registeredWorkshops, setRegisteredWorkshops] = useState<(Registration & { workshop: Workshop })[]>([]);
  const [loading, setLoading] = useState(true);
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
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{getUserDisplayName()}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
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
                <Button variant="outline" className="w-full justify-start mb-2" asChild>
                  <Link to="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/profile/notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notification Preferences
                  </Link>
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
    </div>
  );
};

export default UserProfile;
