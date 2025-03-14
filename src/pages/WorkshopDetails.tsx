
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
import { Calendar, Clock, MapPin, User, Users, DollarSign, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Footer from '@/components/Footer';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';

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

  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading workshop details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Workshop Not Found</h1>
            <p className="mt-2 text-muted-foreground">The workshop you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/workshops')} className="mt-6 bg-blue-600 hover:bg-blue-700">
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto py-12 px-4">
        <Card className="overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-3 gap-8 p-6">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-xl overflow-hidden bg-gray-100 border border-border shadow-md">
                {workshop.image_url ? (
                  <img 
                    src={workshop.image_url} 
                    alt={workshop.title} 
                    className="w-full h-[300px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[300px] flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-800">{workshop.title}</h1>
                
                <div className="flex flex-wrap gap-4 mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">
                      {format(new Date(workshop.start_date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">
                      {format(new Date(workshop.start_date), 'h:mm a')} - {format(new Date(workshop.end_date), 'h:mm a')}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">{workshop.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">{registrationsCount} / {workshop.capacity} registered</span>
                  </div>
                  
                  {workshop.instructor && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-slate-700">Instructor: {workshop.instructor}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">{workshop.price ? `GH₵${workshop.price.toFixed(2)}` : 'Free'}</span>
                  </div>
                </div>
              </div>

              <Card className="border border-slate-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">About this workshop</h2>
                  <p className="whitespace-pre-line text-slate-700">{workshop.description}</p>
                </CardContent>
              </Card>

              <div className="md:hidden mt-8">
                <Card className="border border-slate-200 shadow-md">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Register for this workshop</h2>
                    {renderRegistrationForm()}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="hidden md:block">
              <Card className="border border-slate-200 shadow-md sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Register for this workshop</h2>
                  {renderRegistrationForm()}
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );

  function renderRegistrationForm() {
    if (isWorkshopInPast) {
      return (
        <div className="bg-slate-100 p-4 rounded-md border border-slate-200">
          <div className="flex items-center text-slate-700">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p>This workshop has already ended.</p>
          </div>
        </div>
      );
    }

    if (alreadyRegistered) {
      return (
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <div className="flex items-center text-green-700">
            <AlertCircle className="h-5 w-5 mr-2 text-green-500" />
            <p>You're already registered for this workshop!</p>
          </div>
        </div>
      );
    }

    if (isWorkshopFull) {
      return (
        <div className="bg-slate-100 p-4 rounded-md border border-slate-200">
          <div className="flex items-center text-slate-700">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p>This workshop is full. Please check back later or explore other workshops.</p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
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

        <p className="text-sm text-slate-500 text-center mt-2">
          {workshop.capacity - registrationsCount} {workshop.capacity - registrationsCount === 1 ? 'spot' : 'spots'} remaining
        </p>
      </form>
    );
  }
};

export default WorkshopDetails;
