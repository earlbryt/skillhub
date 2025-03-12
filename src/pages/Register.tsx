
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, Calendar, Clock, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotAssistant from '@/components/ChatbotAssistant';
import { WorkshopProps } from '@/components/WorkshopCard';
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
  const searchParams = new URLSearchParams(location.search);
  const workshopId = searchParams.get('workshop');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    createAccount: false,
    password: '',
    workshopId: workshopId || '',
  });
  const [isComplete, setIsComplete] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  
  // Find selected workshop
  const selectedWorkshop = workshops.find(workshop => workshop.id === formData.workshopId);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  // Handle workshop selection
  const handleWorkshopSelect = (id: string) => {
    setFormData(prev => ({ ...prev, workshopId: id }));
  };
  
  // Register for workshop
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (formData.createAccount && !formData.password) {
      toast.error("Please enter a password to create an account");
      return;
    }
    
    // Complete registration
    completeRegistration();
  };
  
  // Complete registration
  const completeRegistration = () => {
    setIsComplete(true);
    
    // Generate a referral link
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralLink(`https://skillhub.com/register?ref=${referralCode}`);
    
    // Show success toast
    toast.success("Registration successful!", {
      description: "You have successfully registered for the workshop."
    });
  };
  
  // Return to workshops
  const goBackToWorkshops = () => {
    navigate('/workshops');
  };
  
  if (!selectedWorkshop) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Workshop Not Found</h1>
            <p className="mb-6">The workshop you're looking for could not be found.</p>
            <Button onClick={goBackToWorkshops}>
              Browse Workshops
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          {!isComplete ? (
            <div className="max-w-3xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={goBackToWorkshops} 
                className="mb-8 flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Workshops
              </Button>
              
              <div className="bg-white rounded-md shadow-sm border overflow-hidden mb-8">
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img 
                    src={selectedWorkshop.image} 
                    alt={selectedWorkshop.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{selectedWorkshop.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1.5" />
                        <span>{selectedWorkshop.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1.5" />
                        <span>{selectedWorkshop.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1.5" />
                        <span>{selectedWorkshop.enrolled} / {selectedWorkshop.capacity} enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Registration</h2>
                  <p className="text-muted-foreground mb-6">
                    Fill out the form below to secure your spot in this workshop. Account creation is optional.
                  </p>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
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
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox 
                        id="createAccount" 
                        name="createAccount" 
                        checked={formData.createAccount}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, createAccount: checked === true }))
                        }
                      />
                      <label
                        htmlFor="createAccount"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Create an account for easier registration next time
                      </label>
                    </div>
                    
                    {formData.createAccount && (
                      <div>
                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full md:w-auto" size="lg">
                        Register for Workshop
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            // Success Screen
            <div className="max-w-2xl mx-auto bg-white rounded-md shadow-sm border p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
              <p className="text-muted-foreground mb-8">
                You've successfully registered for <strong>{selectedWorkshop.title}</strong>.
                We've sent a confirmation to {formData.email}.
              </p>
              
              <div className="bg-muted rounded-md p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4 text-center">Workshop Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{selectedWorkshop.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{selectedWorkshop.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">Main Campus, Room 204</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">What to bring:</span>
                    <span className="font-medium">Laptop, Notebook</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate("/workshops")}>
                  Browse More Workshops
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Return to Home
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
