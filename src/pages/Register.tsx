
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight, 
  Calendar, 
  Clock, 
  Users,
  Mail, 
  Phone,
  CheckCircle,
  Share2,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotAssistant from '@/components/ChatbotAssistant';
import { WorkshopProps } from '@/components/WorkshopCard';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Sample workshops data
const workshops: WorkshopProps[] = [
  {
    id: "web-dev-1",
    title: "Web Development Fundamentals",
    category: "Coding",
    date: "June 15, 2023",
    time: "10:00 AM - 2:00 PM",
    capacity: 30,
    enrolled: 24,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ui-design-1",
    title: "UI/UX Design Principles",
    category: "Design",
    date: "June 18, 2023",
    time: "1:00 PM - 5:00 PM",
    capacity: 25,
    enrolled: 22,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "data-1",
    title: "Data Science Essentials",
    category: "Data",
    date: "June 20, 2023",
    time: "9:00 AM - 3:00 PM",
    capacity: 20,
    enrolled: 12,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mobile-1",
    title: "Mobile App Development",
    category: "Coding",
    date: "June 22, 2023",
    time: "10:00 AM - 4:00 PM",
    capacity: 25,
    enrolled: 15,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ai-1",
    title: "AI & Machine Learning",
    category: "Technology",
    date: "June 25, 2023",
    time: "9:00 AM - 2:00 PM",
    capacity: 20,
    enrolled: 18,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
  }
];

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const workshopId = searchParams.get('workshop');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    workshopId: workshopId || '',
    confirmationMethod: 'email',
  });
  const [isComplete, setIsComplete] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  
  // Find selected workshop
  const selectedWorkshop = workshops.find(workshop => workshop.id === formData.workshopId);

  useEffect(() => {
    // Pre-fill form with user data if available
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name || prev.firstName,
        lastName: profile.last_name || prev.lastName,
        email: user.email || prev.email,
        phone: profile.phone || prev.phone
      }));
    }
  }, [user, profile]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Complete registration
  const completeRegistration = () => {
    setIsComplete(true);
    
    // Generate a referral link
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setReferralLink(`https://skillhub.com/register?ref=${referralCode}`);
    
    // Show success toast
    toast.success("Registration successful!", {
      description: "You have successfully registered for the workshop."
    });
  };
  
  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Copied to clipboard!");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container max-w-4xl mx-auto px-4">
          {!isComplete ? (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-2">Workshop Registration</h1>
                <p className="text-muted-foreground">
                  Complete this form to secure your spot in the workshop
                </p>
              </div>
              
              {selectedWorkshop ? (
                <>
                  {/* Workshop Details */}
                  <div className="border rounded-lg p-4 mb-6 bg-muted/10 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <img
                        src={selectedWorkshop.image}
                        alt={selectedWorkshop.title}
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-xl font-semibold mb-2">{selectedWorkshop.title}</h2>
                      <div className="flex flex-wrap gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center mr-4">
                          <Calendar size={16} className="mr-1 text-primary" />
                          <span>{selectedWorkshop.date}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <Clock size={16} className="mr-1 text-primary" />
                          <span>{selectedWorkshop.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-1 text-primary" />
                          <span>{selectedWorkshop.enrolled} / {selectedWorkshop.capacity} participants</span>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            selectedWorkshop.enrolled / selectedWorkshop.capacity >= 0.8 
                              ? "bg-secondary" : "bg-primary"
                          )}
                          style={{ width: `${(selectedWorkshop.enrolled / selectedWorkshop.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1 text-muted-foreground">
                        {selectedWorkshop.capacity - selectedWorkshop.enrolled} spots left
                      </div>
                    </div>
                  </div>
                
                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Preference */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Contact Preference</h3>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div 
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border cursor-pointer",
                          formData.confirmationMethod === "email" 
                            ? "border-primary bg-primary/5" 
                            : "border-border"
                        )}
                        onClick={() => setFormData(prev => ({ ...prev, confirmationMethod: "email" }))}
                      >
                        <Mail className="h-5 w-5 text-primary" />
                        <span>Email</span>
                      </div>
                      <div 
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border cursor-pointer",
                          formData.confirmationMethod === "sms" 
                            ? "border-primary bg-primary/5" 
                            : "border-border"
                        )}
                        onClick={() => setFormData(prev => ({ ...prev, confirmationMethod: "sms" }))}
                      >
                        <Phone className="h-5 w-5 text-primary" />
                        <span>SMS</span>
                      </div>
                      <div 
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border cursor-pointer",
                          formData.confirmationMethod === "both" 
                            ? "border-primary bg-primary/5" 
                            : "border-border"
                        )}
                        onClick={() => setFormData(prev => ({ ...prev, confirmationMethod: "both" }))}
                      >
                        <Mail className="h-5 w-5 text-primary" />
                        <Phone className="h-5 w-5 text-primary" />
                        <span>Both</span>
                      </div>
                    </div>
                  </div>
                
                  {/* Action Buttons */}
                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/workshops')}
                      className="flex items-center"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Back to Workshops
                    </Button>
                    
                    <Button 
                      onClick={completeRegistration}
                      disabled={!formData.firstName || !formData.lastName || !formData.email}
                    >
                      Complete Registration
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-muted/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Workshop Selected</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Please select a workshop from our catalog to register.
                  </p>
                  <Button onClick={() => navigate('/workshops')}>
                    Browse Workshops
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Success Screen
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-primary" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">Registration Successful!</h2>
                <p className="text-muted-foreground">
                  You've successfully registered for {selectedWorkshop?.title}. 
                  We've sent a confirmation to {formData.confirmationMethod === 'sms' ? 'your phone' : 'your email'}.
                </p>
              </div>
              
              <div className="bg-muted/20 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-4">Invite Friends & Earn Rewards</h3>
                <p className="text-muted-foreground mb-4">
                  Share your unique referral link with friends and earn rewards when they register for workshops.
                </p>
                
                <div className="flex items-center bg-background rounded-lg border border-border p-2 mb-4">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly
                    className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm"
                  />
                  <Button variant="ghost" size="sm" onClick={copyReferralLink} className="flex items-center">
                    <Copy size={14} className="mr-1" />
                    Copy
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center mx-auto" 
                  onClick={() => toast.success("Sharing options opened!")}
                >
                  <Share2 size={14} className="mr-2" />
                  Share with Friends
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Return to Home
                </Button>
                <Button onClick={() => navigate("/workshops")}>
                  Browse More Workshops
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <ChatbotAssistant />
    </div>
  );
};

export default Register;
