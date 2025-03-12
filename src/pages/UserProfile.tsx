
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, Award, Share2, Copy, ChevronRight, Bell, Settings, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Type for workshop data
interface WorkshopData {
  id: string;
  title: string;
  date: string;
  time: string;
  image: string;
  status: "upcoming" | "completed";
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('workshops');
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  const [registeredWorkshops, setRegisteredWorkshops] = useState<WorkshopData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Generate a referral code based on user info
  const referralCode = user ? `${user.email?.split('@')[0]?.toUpperCase().substring(0, 5)}${Math.floor(Math.random() * 1000)}` : 'SKILLHUB';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // In a real app, this would fetch user's workshops from the API
    // For now, we'll use mock data but showing how you'd fetch
    const loadUserWorkshops = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with an actual API call
        // const { data, error } = await supabase
        //   .from('user_workshops')
        //   .select('*')
        //   .eq('user_id', user.id);
        
        // Simulate API response
        const mockData = [
          {
            id: "web-dev-1",
            title: "Web Development Fundamentals",
            date: "April 15, 2024",
            time: "10:00 AM - 2:00 PM",
            image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
            status: "upcoming"
          },
          {
            id: "ui-design-1",
            title: "UI/UX Design Principles",
            date: "April 25, 2024",
            time: "1:00 PM - 5:00 PM",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
            status: "upcoming"
          },
          {
            id: "data-1",
            title: "Digital Marketing Masterclass",
            date: "March 20, 2024",
            time: "2:00 PM - 6:00 PM",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            status: "completed"
          }
        ];
        
        setRegisteredWorkshops(mockData as WorkshopData[]);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserWorkshops();
  }, [user, navigate]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  if (!user || !profile) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / User Info */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-primary/10 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-base font-medium mb-4">Referral Program</h3>
                <div className="bg-muted/30 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Your Referral Code:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 gap-1"
                      onClick={copyReferralCode}
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-primary/10 rounded p-2 text-center font-mono font-medium text-primary text-sm">
                    {referralCode}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <span className="block text-2xl font-semibold">0</span>
                    <span className="text-xs text-muted-foreground">Referrals</span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <span className="block text-2xl font-semibold">0</span>
                    <span className="text-xs text-muted-foreground">Rewards</span>
                  </div>
                </div>
                
                <Button size="sm" className="w-full gap-2">
                  <Share2 className="w-3.5 h-3.5" />
                  Share Your Referral
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Button variant="outline" size="sm" className="w-full justify-start mb-2">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start mb-2">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Preferences
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Tabs Navigation */}
            <div className="flex border-b border-border mb-6">
              <button
                className={`pb-2 px-4 font-medium text-sm ${activeTab === 'workshops' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('workshops')}
              >
                My Workshops
              </button>
              <button
                className={`pb-2 px-4 font-medium text-sm ${activeTab === 'certificates' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('certificates')}
              >
                Certificates
              </button>
            </div>
            
            {/* Workshops Content */}
            {activeTab === 'workshops' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Workshops</h2>
                  <Button asChild size="sm">
                    <Link to="/workshops">Browse Workshops</Link>
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-2 text-muted-foreground">Loading your workshops...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {registeredWorkshops.filter(w => w.status === 'upcoming').length > 0 && (
                      <>
                        <h3 className="text-base font-medium text-muted-foreground">Upcoming Workshops</h3>
                        
                        <div className="space-y-4">
                          {registeredWorkshops
                            .filter(workshop => workshop.status === 'upcoming')
                            .map(workshop => (
                              <div key={workshop.id} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-1/3 h-24 md:h-auto">
                                    <img 
                                      src={workshop.image} 
                                      alt={workshop.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                      <h4 className="text-base font-medium mb-1">{workshop.title}</h4>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                        <span>{workshop.date} • {workshop.time}</span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                      <Button variant="outline" size="sm">
                                        Add to Calendar
                                      </Button>
                                      <Button variant="ghost" size="sm" asChild>
                                        <Link to={`/workshops/${workshop.id}`}>
                                          Details
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </>
                    )}
                    
                    {registeredWorkshops.filter(w => w.status === 'completed').length > 0 && (
                      <>
                        <h3 className="text-base font-medium text-muted-foreground mt-6">Past Workshops</h3>
                        
                        <div className="space-y-4">
                          {registeredWorkshops
                            .filter(workshop => workshop.status === 'completed')
                            .map(workshop => (
                              <div key={workshop.id} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden opacity-75">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-1/3 h-24 md:h-auto">
                                    <img 
                                      src={workshop.image} 
                                      alt={workshop.title}
                                      className="w-full h-full object-cover grayscale"
                                    />
                                  </div>
                                  <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                      <div className="flex justify-between items-center">
                                        <h4 className="text-base font-medium">{workshop.title}</h4>
                                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">Completed</span>
                                      </div>
                                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                        <span>{workshop.date} • {workshop.time}</span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                      <Button variant="outline" size="sm">
                                        Certificate
                                      </Button>
                                      <Button variant="ghost" size="sm" asChild>
                                        <Link to={`/workshops/${workshop.id}`}>
                                          Details
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </>
                    )}

                    {registeredWorkshops.length === 0 && (
                      <div className="text-center py-10 bg-muted/30 rounded-lg">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium mb-2">No Workshops Yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                          You haven't registered for any workshops yet. Browse our catalog to find workshops that interest you.
                        </p>
                        <Button asChild>
                          <Link to="/workshops">Browse Workshops</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Certificates Content */}
            {activeTab === 'certificates' && (
              <div className="text-center py-16">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Complete a workshop to earn your first certificate. Your achievements will be displayed here.
                </p>
                <Button asChild>
                  <Link to="/workshops">Browse Workshops</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
