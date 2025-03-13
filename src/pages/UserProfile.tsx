
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, Award, Share2, Copy, ChevronRight, Bell, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

// Mock data for user profile
const MOCK_USER = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  joinedDate: "March 2023",
  referralCode: "ALEXJ2023",
  referrals: 8,
  rewards: 3
};

// Mock data for registered workshops
const MOCK_REGISTERED_WORKSHOPS = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    date: "April 15, 2024",
    time: "10:00 AM - 2:00 PM",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    status: "upcoming"
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    date: "April 25, 2024",
    time: "1:00 PM - 5:00 PM",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    status: "upcoming"
  },
  {
    id: "2",
    title: "Digital Marketing Masterclass",
    date: "March 20, 2024",
    time: "2:00 PM - 6:00 PM",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    status: "completed"
  }
];

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('workshops');
  const { toast } = useToast();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(MOCK_USER.referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / User Info */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg shadow-lg p-6 animate-fade-in">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary/20">
                  <img 
                    src={MOCK_USER.profileImage} 
                    alt={MOCK_USER.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold">{MOCK_USER.name}</h2>
                <p className="text-muted-foreground text-sm">Member since {MOCK_USER.joinedDate}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>{MOCK_USER.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span>{MOCK_USER.phone}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">Your Referral Program</h3>
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Your Referral Code:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={copyReferralCode}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-primary/10 rounded p-2 text-center font-mono font-bold text-primary">
                    {MOCK_USER.referralCode}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <span className="block text-3xl font-bold">{MOCK_USER.referrals}</span>
                    <span className="text-sm text-muted-foreground">Successful Referrals</span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <span className="block text-3xl font-bold">{MOCK_USER.rewards}</span>
                    <span className="text-sm text-muted-foreground">Rewards Earned</span>
                  </div>
                </div>
                
                <Button className="w-full gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Your Referral
                </Button>
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
                className={`pb-2 px-1 font-medium text-sm ${activeTab === 'rewards' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('rewards')}
              >
                Rewards & Referrals
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
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-muted-foreground">Upcoming Workshops</h3>
                  
                  {MOCK_REGISTERED_WORKSHOPS
                    .filter(workshop => workshop.status === 'upcoming')
                    .map(workshop => (
                      <div key={workshop.id} className="bg-card rounded-lg shadow-md overflow-hidden hover-scale">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-32 md:h-auto">
                            <img 
                              src={workshop.image} 
                              alt={workshop.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xl font-semibold mb-2">{workshop.title}</h4>
                              <div className="flex items-center text-sm text-muted-foreground mb-4">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{workshop.date} • {workshop.time}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <Button variant="outline" size="sm">
                                Add to Calendar
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/workshops/${workshop.id}`}>
                                  View Details
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  
                  <h3 className="text-lg font-semibold text-muted-foreground mt-8">Past Workshops</h3>
                  
                  {MOCK_REGISTERED_WORKSHOPS
                    .filter(workshop => workshop.status === 'completed')
                    .map(workshop => (
                      <div key={workshop.id} className="bg-card rounded-lg shadow-md overflow-hidden opacity-75">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-32 md:h-auto">
                            <img 
                              src={workshop.image} 
                              alt={workshop.title}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                          <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center">
                                <h4 className="text-xl font-semibold mb-2">{workshop.title}</h4>
                                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">Completed</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-4">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{workshop.date} • {workshop.time}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <Button variant="outline" size="sm">
                                Get Certificate
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/workshops/${workshop.id}`}>
                                  View Details
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            {/* Rewards Content */}
            {activeTab === 'rewards' && (
              <div className="animate-fade-in">
                <div className="text-center mb-10 py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-1">Your Reward Progress</h2>
                  <p className="text-muted-foreground">Refer friends and unlock exclusive benefits</p>
                  
                  <div className="mt-6 px-8">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                            Level 2
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-primary">
                            {MOCK_USER.referrals}/10 Referrals
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                        <div style={{ width: `${(MOCK_USER.referrals / 10) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <strong>2 more referrals</strong> to unlock your next reward
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Available Rewards</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Free Workshop Access</h4>
                        <p className="text-sm text-muted-foreground">Get access to any premium workshop for free</p>
                      </div>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">5 Referrals</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" disabled={MOCK_USER.referrals < 5}>
                      {MOCK_USER.referrals >= 5 ? 'Claim Reward' : `Need ${5 - MOCK_USER.referrals} more referral(s)`}
                    </Button>
                  </div>
                  
                  <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Exclusive Mentorship</h4>
                        <p className="text-sm text-muted-foreground">30-minute 1:1 session with an industry expert</p>
                      </div>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">10 Referrals</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" disabled={MOCK_USER.referrals < 10}>
                      {MOCK_USER.referrals >= 10 ? 'Claim Reward' : `Need ${10 - MOCK_USER.referrals} more referral(s)`}
                    </Button>
                  </div>
                  
                  <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Digital Certificate</h4>
                        <p className="text-sm text-muted-foreground">Receive a verified digital certificate of achievement</p>
                      </div>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">3 Referrals</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" disabled={MOCK_USER.referrals < 3}>
                      Claimed ✓
                    </Button>
                  </div>
                  
                  <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Workshop Resources Bundle</h4>
                        <p className="text-sm text-muted-foreground">Get exclusive access to premium learning resources</p>
                      </div>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">15 Referrals</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" disabled={MOCK_USER.referrals < 15}>
                      {MOCK_USER.referrals >= 15 ? 'Claim Reward' : `Need ${15 - MOCK_USER.referrals} more referral(s)`}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Certificates Content */}
            {activeTab === 'certificates' && (
              <div className="text-center py-16 animate-fade-in">
                <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Complete a workshop to earn your first certificate. Your achievements will be displayed here.
                </p>
                <Button className="mt-6" asChild>
                  <Link to="/workshops">Browse Workshops</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
