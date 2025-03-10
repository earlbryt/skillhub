
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Mail, 
  Phone, 
  MessageSquare,
  Copy,
  Share2,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
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

// Step components
interface StepProps {
  isActive: boolean;
  isCompleted: boolean;
  number: number;
  title: string;
}

const Step = ({ isActive, isCompleted, number, title }: StepProps) => (
  <div className="flex items-center">
    <div 
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors",
        isActive && !isCompleted ? "bg-primary text-white" : "",
        isCompleted ? "bg-green-500 text-white" : "",
        !isActive && !isCompleted ? "bg-muted text-foreground/50" : ""
      )}
    >
      {isCompleted ? <CheckCircle size={20} /> : number}
    </div>
    <span 
      className={cn(
        "font-medium",
        isActive || isCompleted ? "text-foreground" : "text-foreground/50"
      )}
    >
      {title}
    </span>
  </div>
);

// Registration progress steps
const steps = [
  { title: "Personal Information", number: 1 },
  { title: "Workshop Selection", number: 2 },
  { title: "Confirmation Method", number: 3 },
  { title: "Referral Information", number: 4 }
];

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const workshopId = searchParams.get('workshop');
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    workshopId: workshopId || '',
    confirmationMethod: 'email',
    referralSource: '',
  });
  const [isComplete, setIsComplete] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  
  // Find selected workshop
  const selectedWorkshop = workshops.find(workshop => workshop.id === formData.workshopId);
  
  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return !!formData.workshopId;
      case 3:
        return !!formData.confirmationMethod;
      default:
        return true;
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle workshop selection
  const handleWorkshopSelect = (id: string) => {
    setFormData(prev => ({ ...prev, workshopId: id }));
  };
  
  // Handle confirmation method selection
  const handleConfirmationMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, confirmationMethod: value }));
  };
  
  // Navigation between steps
  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete registration
      completeRegistration();
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
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
  
  // Share on social media (just examples, would link to actual share APIs)
  const shareOnSocial = (platform: string) => {
    toast.success(`Shared on ${platform}!`);
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Select a Workshop</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workshops.map(workshop => (
                <div 
                  key={workshop.id}
                  className={cn(
                    "border rounded-xl overflow-hidden cursor-pointer transition-all",
                    workshop.id === formData.workshopId 
                      ? "border-primary shadow-md" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleWorkshopSelect(workshop.id)}
                >
                  <div className="relative h-40">
                    <img 
                      src={workshop.image} 
                      alt={workshop.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 text-xs rounded-md">
                      {workshop.category}
                    </div>
                    
                    <div 
                      className={cn(
                        "absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        workshop.id === formData.workshopId 
                          ? "border-primary bg-primary text-white" 
                          : "border-white"
                      )}
                    >
                      {workshop.id === formData.workshopId ? <CheckCircle size={14} /> : <Circle size={14} className="text-white" />}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{workshop.title}</h3>
                    <div className="text-sm text-foreground/70 space-y-1">
                      <div className="flex items-center">
                        <span className="w-20">Date:</span>
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20">Time:</span>
                        <span>{workshop.time}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20">Capacity:</span>
                        <span>{workshop.enrolled} / {workshop.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Choose Confirmation Method</h2>
            
            <p className="text-foreground/70 mb-6">
              How would you like to receive your workshop confirmation and reminders?
            </p>
            
            <RadioGroup 
              value={formData.confirmationMethod} 
              onValueChange={handleConfirmationMethodChange}
              className="space-y-4"
            >
              <div className={cn(
                "flex items-start space-x-4 rounded-lg border p-4 transition-all",
                formData.confirmationMethod === "email" ? "border-primary bg-primary/5" : "border-border"
              )}>
                <RadioGroupItem value="email" id="email" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="email" className="text-base font-medium flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-primary" />
                    Email
                  </Label>
                  <p className="text-sm text-foreground/70 mt-1">
                    Receive confirmation and reminders via email at {formData.email || "your email address"}
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-start space-x-4 rounded-lg border p-4 transition-all",
                formData.confirmationMethod === "sms" ? "border-primary bg-primary/5" : "border-border"
              )}>
                <RadioGroupItem value="sms" id="sms" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="sms" className="text-base font-medium flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-primary" />
                    SMS
                  </Label>
                  <p className="text-sm text-foreground/70 mt-1">
                    Receive confirmation and reminders via text message at {formData.phone || "your phone number"}
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-start space-x-4 rounded-lg border p-4 transition-all",
                formData.confirmationMethod === "both" ? "border-primary bg-primary/5" : "border-border"
              )}>
                <RadioGroupItem value="both" id="both" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="both" className="text-base font-medium flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Both Email & SMS
                  </Label>
                  <p className="text-sm text-foreground/70 mt-1">
                    Receive confirmation and reminders via both email and text message
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Referral Information</h2>
            
            <p className="text-foreground/70 mb-6">
              Help us understand how you heard about this workshop (optional).
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <Input 
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                placeholder="Friend, Social Media, School, etc."
              />
            </div>
            
            <div className="mt-10 p-6 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Registration Summary</h3>
              
              {selectedWorkshop && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedWorkshop.image} 
                      alt={selectedWorkshop.title} 
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{selectedWorkshop.title}</h4>
                      <p className="text-sm text-foreground/70">{selectedWorkshop.date} • {selectedWorkshop.time}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Name:</span>
                      <span>{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Email:</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Phone:</span>
                      <span>{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Confirmation Method:</span>
                      <span className="capitalize">{formData.confirmationMethod}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render success screen
  const renderSuccessScreen = () => (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold mb-3">Registration Successful!</h2>
        <p className="text-foreground/70">
          You've successfully registered for {selectedWorkshop?.title}. 
          We've sent a confirmation to {formData.confirmationMethod === 'sms' ? 'your phone' : 'your email'}.
        </p>
      </div>
      
      <div className="bg-muted rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">Invite Friends & Earn Rewards</h3>
        <p className="text-foreground/70 mb-4">
          Share your unique referral link with friends and earn rewards when they register for workshops.
        </p>
        
        <div className="flex items-center bg-background rounded-lg border border-border p-2 mb-4">
          <input 
            type="text" 
            value={referralLink} 
            readOnly
            className="flex-1 bg-transparent border-none focus:outline-none px-2"
          />
          <Button variant="ghost" size="sm" onClick={copyReferralLink} className="flex items-center">
            <Copy size={16} className="mr-1" />
            Copy
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={() => shareOnSocial('Facebook')}
          >
            <Facebook size={16} className="mr-2" />
            Facebook
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={() => shareOnSocial('Twitter')}
          >
            <Twitter size={16} className="mr-2" />
            Twitter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={() => shareOnSocial('LinkedIn')}
          >
            <Linkedin size={16} className="mr-2" />
            LinkedIn
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={() => shareOnSocial('WhatsApp')}
          >
            <Share2 size={16} className="mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
      
      <div className="space-x-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          Return to Home
        </Button>
        <Button onClick={() => navigate("/workshops")}>
          Browse More Workshops
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {!isComplete ? (
            <>
              {/* Progress Steps */}
              <div className="mb-8 md:mb-12">
                <div className="hidden md:flex justify-between max-w-3xl mx-auto">
                  {steps.map((step, index) => (
                    <Step 
                      key={index}
                      number={step.number}
                      title={step.title}
                      isActive={currentStep === step.number}
                      isCompleted={currentStep > step.number}
                    />
                  ))}
                </div>
                
                {/* Mobile Progress */}
                <div className="md:hidden flex items-center justify-between mb-6">
                  <Step 
                    number={currentStep}
                    title={steps[currentStep - 1].title}
                    isActive={true}
                    isCompleted={false}
                  />
                  <span className="text-sm text-foreground/50">
                    Step {currentStep} of {steps.length}
                  </span>
                </div>
                
                <div className="h-2 bg-muted rounded-full mt-6 md:mt-8 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                <div className="mt-10 flex justify-between">
                  {currentStep > 1 ? (
                    <Button 
                      variant="outline" 
                      onClick={goToPrevStep}
                      className="flex items-center"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  <Button 
                    onClick={goToNextStep}
                    disabled={!validateStep()}
                    className="flex items-center"
                  >
                    {currentStep < steps.length ? (
                      <>Continue <ChevronRight size={16} className="ml-1" /></>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Success Screen
            renderSuccessScreen()
          )}
        </div>
      </main>
      
      <Footer />
      <ChatbotAssistant />
    </div>
  );
};

export default Register;
