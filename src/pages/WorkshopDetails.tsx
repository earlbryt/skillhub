
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getWorkshopById, registerForWorkshop, getWorkshopRegistrationsCount, checkUserRegisteredForWorkshop } from '@/services/workshopService';
import { Workshop } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, User, Users, DollarSign, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { format } from 'date-fns';
import Footer from '@/components/Footer';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const registrationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

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

  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    if (profile) {
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: user?.email || '',
      }));
    }
  }, [profile, user]);

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
      const validationResult = registrationSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
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
      
      const { success, error } = await registerForWorkshop({
        workshop_id: workshop.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        user_id: user?.id || null
      });
      
      if (success) {
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
          description: error?.message || "An unexpected error occurred. Please try again.",
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

  const getCapacityColor = () => {
    const percentage = (registrationsCount / (workshop?.capacity || 1)) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };
  
  const getWorkshopStatusBadge = () => {
    if (!workshop) return null;
    
    const now = new Date();
    const startDate = new Date(workshop.start_date);
    const endDate = new Date(workshop.end_date);
    
    if (now > endDate) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Completed</Badge>
    } else if (now >= startDate) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">In Progress</Badge>
    } else if (registrationsCount >= workshop.capacity) {
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Full</Badge>
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Upcoming</Badge>
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading workshop details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Workshop Not Found</h1>
            <p className="mt-2 text-gray-600">The workshop you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/workshops')} className="mt-6">
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

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />

      <div className="container mx-auto py-12 px-4">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/workshops')} className="flex items-center gap-2 text-gray-700">
            <ArrowLeft size={16} />
            <span>Back to Workshops</span>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Workshop header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{workshop.title}</h1>
                {getWorkshopStatusBadge()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Date</div>
                    <div className="text-gray-600">{formatDate(workshop.start_date)}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Time</div>
                    <div className="text-gray-600">
                      {formatTime(workshop.start_date)} - {formatTime(workshop.end_date)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600">{workshop.location}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Capacity</div>
                    <div className="text-gray-600">
                      {registrationsCount} / {workshop.capacity} registered
                    </div>
                  </div>
                </div>
                
                {workshop.instructor && (
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Instructor</div>
                      <div className="text-gray-600">{workshop.instructor}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Fee</div>
                    <div className="text-gray-600">{workshop.price ? `GH₵${workshop.price.toFixed(2)}` : 'Free'}</div>
                  </div>
                </div>
              </div>
              
              {/* Capacity bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Registration Capacity</span>
                  <span className={`${isWorkshopFull ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {registrationsCount}/{workshop.capacity} spots filled
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getCapacityColor()}`}
                    style={{ width: `${Math.min((registrationsCount / workshop.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Workshop image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-white shadow-md">
              {workshop.image_url ? (
                <img 
                  src={workshop.image_url} 
                  alt={workshop.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>

            {/* Workshop Description */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this workshop</h2>
              <div className="prose prose-blue max-w-none">
                <p className="whitespace-pre-line text-gray-700">{workshop.description}</p>
              </div>
            </div>

            <div className="md:hidden mt-8">
              {renderRegistrationCard()}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-8">
              {renderRegistrationCard()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );

  function renderRegistrationCard() {
    return (
      <Card className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Register for this workshop</h2>
          <p className="text-gray-600 text-sm">
            {!isWorkshopFull && !isWorkshopInPast && !alreadyRegistered && `${workshop.capacity - registrationsCount} spots remaining`}
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
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center text-gray-700">
            <AlertCircle className="h-5 w-5 mr-2 text-gray-500" />
            <p>This workshop has already ended.</p>
          </div>
        </div>
      );
    }

    if (registrationSuccess || alreadyRegistered) {
      return (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center text-green-700">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <p>You're registered for this workshop!</p>
          </div>
          <div className="mt-4">
            <Button className="w-full" variant="outline" onClick={() => navigate('/workshops')}>
              Browse More Workshops
            </Button>
          </div>
        </div>
      );
    }

    if (isWorkshopFull) {
      return (
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center text-gray-700">
            <AlertCircle className="h-5 w-5 mr-2 text-gray-500" />
            <p>This workshop is full. Please check back later or explore other workshops.</p>
          </div>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate('/workshops')}>
              Browse Other Workshops
            </Button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            aria-invalid={!!formErrors.first_name}
            className="border-gray-300"
          />
          {formErrors.first_name && (
            <p className="text-sm text-red-600">{formErrors.first_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            aria-invalid={!!formErrors.last_name}
            className="border-gray-300"
          />
          {formErrors.last_name && (
            <p className="text-sm text-red-600">{formErrors.last_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            aria-invalid={!!formErrors.email}
            className="border-gray-300"
          />
          {formErrors.email && (
            <p className="text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="border-gray-300"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : (
            'Register Now'
          )}
        </Button>

        {!isWorkshopFull && (
          <p className="text-sm text-gray-500 text-center mt-2">
            {workshop.capacity - registrationsCount} {workshop.capacity - registrationsCount === 1 ? 'spot' : 'spots'} remaining
          </p>
        )}
      </form>
    );
  }
};

export default WorkshopDetails;
