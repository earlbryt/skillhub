
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  Calendar, 
  Clock, 
  Users,
  CheckCircle,
  Share2,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  
  // Find selected workshop
  const selectedWorkshop = workshops.find(workshop => workshop.id === workshopId);

  // Auto-register user if logged in and workshop is selected
  useEffect(() => {
    if (user && selectedWorkshop && !isComplete && !isProcessing) {
      // Automatically register users without needing extra clicks
      handleRegister();
    }
  }, [user, selectedWorkshop]);

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!user && workshopId) {
      navigate(`/login?redirect=register?workshop=${workshopId}`);
    }
  }, [user, workshopId, navigate]);
  
  // Complete registration
  const handleRegister = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call with a short timeout
    setTimeout(() => {
      setIsComplete(true);
      setIsProcessing(false);
      
      // Generate a referral link
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setReferralLink(`https://skillhub.com/register?ref=${referralCode}`);
      
      // Show success toast
      toast.success("Registration successful!", {
        description: "You have successfully registered for the workshop."
      });
    }, 800);
  };
  
  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Copied to clipboard!");
  };
  
  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-10">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-700 border-r-transparent mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Registration</h2>
            <p className="text-gray-600">Just a moment while we secure your spot...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container max-w-4xl mx-auto px-4">
          {!isComplete ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-2">Workshop Registration</h1>
                <p className="text-gray-600">
                  Complete this form to secure your spot in the workshop
                </p>
              </div>
              
              {selectedWorkshop ? (
                <>
                  {/* Workshop Details */}
                  <div className="border rounded-lg p-4 mb-6 bg-gray-50 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <img
                        src={selectedWorkshop.image}
                        alt={selectedWorkshop.title}
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-xl font-semibold mb-2">{selectedWorkshop.title}</h2>
                      <div className="flex flex-wrap gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center mr-4">
                          <Calendar size={16} className="mr-1 text-blue-700" />
                          <span>{selectedWorkshop.date}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <Clock size={16} className="mr-1 text-blue-700" />
                          <span>{selectedWorkshop.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-1 text-blue-700" />
                          <span>{selectedWorkshop.enrolled} / {selectedWorkshop.capacity} participants</span>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            selectedWorkshop.enrolled / selectedWorkshop.capacity >= 0.8 
                              ? "bg-amber-500" : "bg-blue-700"
                          )}
                          style={{ width: `${(selectedWorkshop.enrolled / selectedWorkshop.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1 text-gray-600">
                        {selectedWorkshop.capacity - selectedWorkshop.enrolled} spots left
                      </div>
                    </div>
                  </div>
                
                  {/* Instant Registration with User Info */}
                  <div className="mb-6 text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-medium mb-3">One-Click Registration</h3>
                    <p className="text-gray-600 mb-4">
                      You'll be registered with your profile information:
                    </p>
                    
                    <div className="inline-block bg-white p-4 rounded-lg border border-gray-200 mb-6 text-left">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="block text-gray-500">Name:</span>
                          <span className="font-medium">{profile?.first_name || ''} {profile?.last_name || ''}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Email:</span>
                          <span className="font-medium">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="px-8 bg-blue-700 hover:bg-blue-800"
                      onClick={handleRegister}
                    >
                      Complete Registration
                    </Button>
                  </div>
                
                  {/* Action Buttons */}
                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/workshops')}
                      className="flex items-center text-gray-700 border-gray-300"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Back to Workshops
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Workshop Selected</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Please select a workshop from our catalog to register.
                  </p>
                  <Button onClick={() => navigate('/workshops')} className="bg-blue-700 hover:bg-blue-800">
                    Browse Workshops
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Success Screen
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">Registration Successful!</h2>
                <p className="text-gray-600">
                  You've successfully registered for {selectedWorkshop?.title}. 
                  We've sent a confirmation to your email.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-4">Invite Friends & Earn Rewards</h3>
                <p className="text-gray-600 mb-4">
                  Share your unique referral link with friends and earn rewards when they register for workshops.
                </p>
                
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-2 mb-4">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly
                    className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm"
                  />
                  <Button variant="ghost" size="sm" onClick={copyReferralLink} className="flex items-center text-blue-700">
                    <Copy size={14} className="mr-1" />
                    Copy
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center mx-auto text-gray-700 border-gray-300" 
                  onClick={() => toast.success("Sharing options opened!")}
                >
                  <Share2 size={14} className="mr-2" />
                  Share with Friends
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" onClick={() => navigate("/")} className="text-gray-700 border-gray-300">
                  Return to Home
                </Button>
                <Button onClick={() => navigate("/workshops")} className="bg-blue-700 hover:bg-blue-800">
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
