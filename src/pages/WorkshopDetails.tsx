import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getWorkshopById, registerForWorkshop, getWorkshopRegistrationsCount, checkUserRegisteredForWorkshop, RegistrationData } from '@/services/workshopService';
import { Workshop } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, User, DollarSign, AlertCircle, ArrowLeft, Check, Shield, Star, Award, BookOpen, Zap } from 'lucide-react';
import { format } from 'date-fns';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define the registration form data type
interface RegistrationFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

// Custom validation function
const validateForm = (data: RegistrationFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.first_name.trim()) {
    errors.first_name = "First name is required";
  }
  
  if (!data.last_name.trim()) {
    errors.last_name = "Last name is required";
  }
  
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
    errors.email = "Please enter a valid email";
  }
  
  return errors;
};

const WorkshopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationsCount, setRegistrationsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate a consistent instructor image based on the instructor name
  const getInstructorImage = (name: string) => {
    // Use a hash of the name to get a consistent image for the same instructor
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://i.pravatar.cc/300?img=${(hash % 70) + 1}`;
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchWorkshopDetails = async () => {
      try {
        const workshop = await getWorkshopById(id);
        
        if (!workshop) {
          navigate('/workshops');
          toast({
            title: "Workshop not found",
            description: "The workshop you're looking for doesn't exist.",
            variant: "destructive"
          });
          return;
        }
        
        setWorkshop(workshop);

        // Get registrations count
        const count = await getWorkshopRegistrationsCount(id);
        setRegistrationsCount(count);

        // Check if user is already registered
        if (user?.id) {
          const isRegistered = await checkUserRegisteredForWorkshop(id, user.id);
          setAlreadyRegistered(isRegistered);
        }
      } catch (error) {
        console.error("Error fetching workshop details:", error);
        toast({
          title: "Error",
          description: "Failed to load workshop details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [id, user?.id, navigate, toast]);

  useEffect(() => {
    if (user) {
      // Pre-fill with user's email if available
      setFormData(prev => ({
        ...prev,
        // Use empty strings as fallbacks if properties don't exist
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form using our custom validation function
      const errors = validateForm(formData);
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      
      setIsSubmitting(true);
      
      if (!workshop) {
        toast({
          title: "Error",
          description: "Workshop information is missing.",
          variant: "destructive"
        });
        return;
      }
      
      // Create the registration data
      const registrationData: RegistrationData = {
        workshop_id: workshop.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        user_id: user?.id || null
      };
      
      const result = await registerForWorkshop(registrationData);
      
      if (result.success) {
        setRegistrationSuccess(true);
        toast({
          title: "Registration Successful",
          description: `You have successfully registered for ${workshop.title}.`,
        });
        
        setRegistrationsCount(prev => prev + 1);
        
        if (user?.id) {
          setAlreadyRegistered(true);
        }
        
        if (!user) {
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: ''
          });
        }
      } else {
        toast({
          title: "Registration Failed",
          description: result.error?.message || "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (date: string) => {
    return format(new Date(date), 'h:mm a');
  };
  
  const formatCurrency = (price: number | null) => {
    if (!price) return 'Free';
    return `GH₵${price.toFixed(2)}`;
  };
  
  const getWorkshopStatusBadge = () => {
    if (!workshop) return null;
    
    const now = new Date();
    const startDate = new Date(workshop.start_date);
    const endDate = new Date(workshop.end_date);
    
    if (now > endDate) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">Completed</Badge>
    } else if (now >= startDate) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">In Progress</Badge>
    } else if (registrationsCount >= workshop.capacity) {
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 px-3 py-1">Full</Badge>
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">Upcoming</Badge>
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto py-16 px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading workshop details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto py-16 px-4">
          <div className="text-center max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Workshop Not Found</h1>
            <p className="mt-2 text-slate-600 mb-6">The workshop you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/workshops')} className="bg-primary hover:bg-primary/90">
              View All Workshops
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isWorkshopFull = workshop.capacity <= registrationsCount;
  const isWorkshopInPast = new Date(workshop.end_date) < new Date();

  function renderRegistrationCard() {
    return (
      <Card className="border-none shadow-xl bg-white rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <h2 className="text-xl font-bold mb-1">Register for this workshop</h2>
          <p className="text-white/80 text-sm">
            Secure your spot today
          </p>
        </div>
        
        <div className="p-6">
          {renderRegistrationForm()}
        </div>
      </Card>
    );
  }

  function renderRegistrationForm() {
    if (isWorkshopInPast) {
      return (
        <div className="bg-slate-100 p-6 rounded-lg">
          <div className="flex items-center text-slate-700">
            <AlertCircle className="h-5 w-5 mr-3 text-slate-500" />
            <p className="font-medium">This workshop has already ended.</p>
          </div>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate('/workshops')}>
              Browse Other Workshops
            </Button>
          </div>
        </div>
      );
    }

    if (registrationSuccess || alreadyRegistered) {
      return (
        <div className="bg-emerald-50 p-6 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium text-emerald-800 mb-2">Registration Complete!</h3>
            <p className="text-emerald-700">You're all set for this workshop!</p>
          </div>
          <div className="mt-6">
            <Button className="w-full" variant="outline" onClick={() => navigate('/workshops')}>
              Browse More Workshops
            </Button>
          </div>
        </div>
      );
    }

    if (isWorkshopFull) {
      return (
        <div className="bg-slate-100 p-6 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Workshop is Full</h3>
            <p className="text-slate-700">This workshop is at capacity. Please check back later or explore other workshops.</p>
          </div>
          <div className="mt-6">
            <Button className="w-full" onClick={() => navigate('/workshops')}>
              Browse Other Workshops
            </Button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-slate-700">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            aria-invalid={!!formErrors.first_name}
            className="border-slate-200 focus:border-primary focus:ring-primary"
            placeholder="Enter your first name"
          />
          {formErrors.first_name && (
            <p className="text-sm text-red-600">{formErrors.first_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-slate-700">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            aria-invalid={!!formErrors.last_name}
            className="border-slate-200 focus:border-primary focus:ring-primary"
            placeholder="Enter your last name"
          />
          {formErrors.last_name && (
            <p className="text-sm text-red-600">{formErrors.last_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            aria-invalid={!!formErrors.email}
            className="border-slate-200 focus:border-primary focus:ring-primary"
            placeholder="your.email@example.com"
          />
          {formErrors.email && (
            <p className="text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700">Phone Number (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="border-slate-200 focus:border-primary focus:ring-primary"
            placeholder="(123) 456-7890"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 h-12 text-base mt-6 shadow-lg shadow-primary/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : (
            'Register Now'
          )}
        </Button>
      </form>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />

      {/* Hero Section with Workshop Image */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {workshop.image_url ? (
          <>
            <img 
              src={workshop.image_url} 
              alt={workshop.title}
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          </>
        ) : (
          <div className="absolute w-full h-full bg-gradient-to-br from-primary/90 via-primary/70 to-blue-600/60">
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white/30"
                  style={{
                    width: `${Math.random() * 10 + 5}rem`,
                    height: `${Math.random() * 10 + 5}rem`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-16 pt-20">
            <div className="flex flex-col items-start gap-4 max-w-4xl">
              <Button variant="outline" size="sm" onClick={() => navigate('/workshops')} 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white flex items-center gap-2">
                <ArrowLeft size={16} />
                <span>Back to Workshops</span>
              </Button>
              
              <div className="flex items-center gap-3 flex-wrap">
                {getWorkshopStatusBadge()}
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-3 py-1">
                  {formatCurrency(workshop.price)}
                </Badge>
                {workshop.instructor && (
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-3 py-1 flex items-center gap-1">
                    <User size={14} />
                    <span>{workshop.instructor}</span>
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md">
                {workshop.title}
              </h1>
              
              <p className="text-lg text-white/90 max-w-3xl">
                {workshop.description.substring(0, 150)}...
              </p>
              
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(workshop.start_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="h-5 w-5" />
                  <span>{formatTime(workshop.start_date)} - {formatTime(workshop.end_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-5 w-5" />
                  <span>{workshop.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Workshop Information Card - Condensed */}
            <Card className="overflow-hidden border-none shadow-xl bg-white rounded-xl">
              <div className="p-6 md:p-8 space-y-8">
                {/* Benefits Section */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">What You'll Get</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl transition-all hover:bg-slate-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Comprehensive learning materials</span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl transition-all hover:bg-slate-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Expert-led instruction</span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl transition-all hover:bg-slate-100">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-amber-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Hands-on practical exercises</span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl transition-all hover:bg-slate-100">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-rose-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Workshop Description Card */}
            <Card className="overflow-hidden border-none shadow-xl bg-white rounded-xl">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Workshop Description</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed">{workshop.description}</p>
                </div>
              </div>
            </Card>

            {/* Instructor Card */}
            {workshop.instructor && (
              <Card className="overflow-hidden border-none shadow-xl bg-white rounded-xl">
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Meet Your Instructor</h2>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img 
                          src={getInstructorImage(workshop.instructor)} 
                          alt={workshop.instructor}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                        <Star className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{workshop.instructor}</h3>
                      <p className="text-primary font-medium mb-3">Expert Instructor</p>
                      
                      <p className="text-slate-600 mb-4">
                        A passionate educator with extensive experience in this field. 
                        Dedicated to providing an engaging and valuable learning experience for all participants.
                      </p>
                      
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Expert</Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">Certified</Badge>
                        <Badge className="bg-amber-100 text-amber-800 border border-amber-200">4.9 Rating</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="md:hidden">
              {renderRegistrationCard()}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-24">
              {renderRegistrationCard()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WorkshopDetails;
