import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkshopById, getRegistrationsForWorkshop, registerForWorkshop } from '@/services/workshopService';
import { Workshop } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, MapPin, Users, User } from 'lucide-react';
import { format } from 'date-fns';

const WorkshopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationCount, setRegistrationCount] = useState(0);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      if (user) {
        setEmail(user.email || '');
      }
    }
  }, [profile, user]);

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      if (!id) return;
      
      try {
        const workshopData = await getWorkshopById(id);
        if (workshopData) {
          setWorkshop(workshopData);
          
          // Get registration count
          const registrations = await getRegistrationsForWorkshop(id);
          setRegistrationCount(registrations.length);
        } else {
          toast({
            title: "Not Found",
            description: "The workshop you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate('/workshops');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load workshop details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [id, navigate, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const getDateRangeText = () => {
    if (!workshop) return '';
    
    const startDate = formatDate(workshop.start_date);
    const endDate = formatDate(workshop.end_date);
    
    return startDate === endDate 
      ? startDate
      : `${startDate} - ${formatDate(workshop.end_date)}`;
  };

  const getTimeRangeText = () => {
    if (!workshop) return '';
    
    return `${formatTime(workshop.start_date)} - ${formatTime(workshop.end_date)}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workshop) return;
    
    if (!firstName || !lastName || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { success, error } = await registerForWorkshop({
        workshop_id: workshop.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        user_id: user?.id || null
      });
      
      if (success) {
        toast({
          title: "Success!",
          description: `You've successfully registered for "${workshop.title}".`,
        });
        
        // Refresh registration count
        const registrations = await getRegistrationsForWorkshop(workshop.id);
        setRegistrationCount(registrations.length);
        
        // Clear form if not logged in
        if (!user) {
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhone('');
        }
      } else {
        toast({
          title: "Registration failed",
          description: error?.message || "There was an error with your registration. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for the workshop. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Skeleton className="h-72 w-full mb-6" />
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-6" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Workshop Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The workshop you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/workshops')}>
              Back to Workshops
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const spotsRemaining = workshop.capacity - registrationCount;
  const isFull = spotsRemaining <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{workshop.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Workshop image */}
              {workshop.image_url ? (
                <img
                  src={workshop.image_url}
                  alt={workshop.title}
                  className="w-full h-auto rounded-lg mb-6 object-cover max-h-[400px]"
                />
              ) : (
                <div className="w-full h-72 bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
              
              {/* Workshop details */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{getDateRangeText()}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{getTimeRangeText()}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{workshop.location}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-2" />
                  <span>
                    {isFull 
                      ? "Fully booked" 
                      : `${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} remaining`
                    }
                  </span>
                </div>
                
                {workshop.instructor && (
                  <div className="flex items-center text-muted-foreground">
                    <User className="h-5 w-5 mr-2" />
                    <span>Instructor: {workshop.instructor}</span>
                  </div>
                )}
                
                {workshop.price > 0 ? (
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    ${workshop.price.toFixed(2)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-base px-3 py-1 border-green-500 text-green-600">
                    Free
                  </Badge>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Workshop description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">About This Workshop</h2>
                <div className="prose max-w-none text-muted-foreground">
                  <p className="whitespace-pre-line">{workshop.description}</p>
                </div>
              </div>
            </div>
            
            {/* Registration form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {isFull ? "Workshop Full" : "Register Now"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isFull ? (
                    <div className="text-center">
                      <p className="mb-4 text-muted-foreground">This workshop has reached its capacity.</p>
                      <Button variant="outline" onClick={() => navigate('/workshops')}>
                        Browse Other Workshops
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={submitting || isFull}
                        >
                          {submitting ? "Registering..." : "Register for Workshop"}
                        </Button>
                        
                        {!user && (
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            Note: You're registering as a guest. <br />
                            <a href="/login" className="text-primary hover:underline">Sign in</a> to track all your registrations.
                          </p>
                        )}
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetails;
