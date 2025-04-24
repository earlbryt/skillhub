import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Workshop } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  User, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface WorkshopFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workshop?: Workshop; // If provided, we're editing; if not, we're adding
}

const WorkshopForm: React.FC<WorkshopFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  workshop
}) => {
  const isEditing = !!workshop;
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<Partial<Workshop>>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    capacity: 20,
    price: 0,
    instructor: '',
    image_url: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [formTouched, setFormTouched] = useState(false);
  
  // Initialize form with workshop data if editing
  useEffect(() => {
    if (workshop) {
      // Format dates for datetime-local input
      const formattedStartDate = workshop.start_date 
        ? format(new Date(workshop.start_date), "yyyy-MM-dd'T'HH:mm")
        : '';
      
      const formattedEndDate = workshop.end_date
        ? format(new Date(workshop.end_date), "yyyy-MM-dd'T'HH:mm")
        : '';
      
      setFormData({
        ...workshop,
        start_date: formattedStartDate,
        end_date: formattedEndDate
      });
    } else {
      // Reset form for new workshop
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        capacity: 20,
        price: 0,
        instructor: '',
        image_url: ''
      });
    }
    
    // Reset form state
    setErrors({});
    setFormTouched(false);
    setActiveSection('basic');
  }, [workshop, isOpen]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric inputs to numbers
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    setFormTouched(true);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (formData.start_date && formData.end_date && 
               new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.capacity === undefined || formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // If there are errors, switch to the section with the first error
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0];
        if (['title', 'description'].includes(firstErrorField)) {
          setActiveSection('basic');
        } else if (['start_date', 'end_date', 'location'].includes(firstErrorField)) {
          setActiveSection('schedule');
        } else if (['capacity', 'price', 'instructor'].includes(firstErrorField)) {
          setActiveSection('details');
        } else {
          setActiveSection('media');
        }
      }
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for submission - remove any properties that don't exist in the database
      const now = new Date().toISOString();
      
      // Create a clean object with only the fields we want to send to the database
      const validFields = [
        'title', 'description', 'start_date', 'end_date', 
        'location', 'capacity', 'price', 'instructor', 'image_url'
      ];
      
      const cleanedData: Record<string, any> = {};
      
      // Only include valid fields that exist in our database schema
      validFields.forEach(field => {
        if (formData[field as keyof Partial<Workshop>] !== undefined) {
          cleanedData[field] = formData[field as keyof Partial<Workshop>];
        }
      });
      
      // Add updated_at timestamp
      cleanedData.updated_at = now;
      
      if (isEditing) {
        // Update existing workshop
        const { error } = await supabase
          .from('workshops')
          .update(cleanedData)
          .eq('id', workshop.id);
          
        if (error) throw error;
        
        toast({
          title: "Workshop updated",
          description: "The workshop has been updated successfully.",
        });
      } else {
        // Create new workshop
        const { error } = await supabase
          .from('workshops')
          .insert({
            ...cleanedData,
            title: cleanedData.title || '',
            description: cleanedData.description || '',
            start_date: cleanedData.start_date || now,
            end_date: cleanedData.end_date || now,
            location: cleanedData.location || '',
            capacity: cleanedData.capacity || 20,
            price: cleanedData.price || 0,
            created_at: now
          });
          
        if (error) throw error;
        
        toast({
          title: "Workshop created",
          description: "The workshop has been created successfully.",
        });
      }
      
      // Close form and refresh data
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving workshop:', error);
      toast({
        title: `Error ${isEditing ? 'updating' : 'creating'} workshop`,
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if a section has errors
  const sectionHasErrors = (section: string): boolean => {
    if (section === 'basic') {
      return !!errors.title || !!errors.description;
    } else if (section === 'schedule') {
      return !!errors.start_date || !!errors.end_date || !!errors.location;
    } else if (section === 'details') {
      return !!errors.capacity || !!errors.price || !!errors.instructor;
    } else if (section === 'media') {
      return !!errors.image_url;
    }
    return false;
  };

  // Get section status icon
  const getSectionIcon = (section: string) => {
    if (sectionHasErrors(section)) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    // Check if all fields in the section are filled
    if (section === 'basic' && formData.title && formData.description) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (section === 'schedule' && formData.start_date && formData.end_date && formData.location) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (section === 'details' && formData.capacity !== undefined && formData.price !== undefined) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (section === 'media' && formData.image_url) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    
    return null;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">
            {isEditing ? 'Edit Workshop' : 'Add New Workshop'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                activeSection === 'basic' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveSection('basic')}
            >
              Basic Info
              {getSectionIcon('basic')}
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                activeSection === 'schedule' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveSection('schedule')}
            >
              Schedule
              {getSectionIcon('schedule')}
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                activeSection === 'details' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveSection('details')}
            >
              Details
              {getSectionIcon('details')}
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                activeSection === 'media' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveSection('media')}
            >
              Media
              {getSectionIcon('media')}
            </button>
          </div>
          
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                <p className="text-sm text-gray-500">Enter the core details about your workshop.</p>
                
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Workshop Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Web Development"
                    className={`h-10 ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.title}
                    </p>
                  )}
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the workshop..."
                    rows={5}
                    className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Describe what participants will learn, the format, and any prerequisites.
                  </p>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setActiveSection('schedule')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Continue to Schedule
                  </Button>
                </div>
              </div>
            )}
            
            {/* Schedule Section */}
            {activeSection === 'schedule' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Schedule & Location</h3>
                <p className="text-sm text-gray-500">Set when and where the workshop will take place.</p>
                
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Start Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="datetime-local"
                      value={formData.start_date || ''}
                      onChange={handleChange}
                      className={`h-10 ${errors.start_date ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.start_date}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      End Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="datetime-local"
                      value={formData.end_date || ''}
                      onChange={handleChange}
                      className={`h-10 ${errors.end_date ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.end_date && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.end_date}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-red-500" />
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="e.g., Conference Room A, Virtual Zoom Meeting"
                    className={`h-10 ${errors.location ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.location}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Specify the physical address or virtual meeting details.
                  </p>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveSection('basic')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveSection('details')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Continue to Details
                  </Button>
                </div>
              </div>
            )}
            
            {/* Details Section */}
            {activeSection === 'details' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Workshop Details</h3>
                <p className="text-sm text-gray-500">Provide additional information about the workshop.</p>
                
                {/* Capacity and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-sm font-medium flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      Capacity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity || ''}
                      onChange={handleChange}
                      placeholder="Maximum attendees"
                      className={`h-10 ${errors.capacity ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.capacity && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.capacity}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Maximum number of participants allowed.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      Price (GH₵)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`h-10 ${errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.price}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Set to 0 for free workshops.
                    </p>
                  </div>
                </div>
                
                {/* Instructor */}
                <div className="space-y-2">
                  <Label htmlFor="instructor" className="text-sm font-medium flex items-center gap-1">
                    <User className="h-4 w-4 text-purple-500" />
                    Instructor
                  </Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={formData.instructor || ''}
                    onChange={handleChange}
                    placeholder="Name of the instructor"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500">
                    Who will be leading this workshop?
                  </p>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveSection('schedule')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveSection('media')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Continue to Media
                  </Button>
                </div>
              </div>
            )}
            
            {/* Media Section */}
            {activeSection === 'media' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Media & Preview</h3>
                <p className="text-sm text-gray-500">Add visual elements to your workshop listing.</p>
                
                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-sm font-medium flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                    Image URL
                  </Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500">
                    Enter a URL for the workshop image. This will be displayed on the workshop listing.
                  </p>
                </div>
                
                {/* Image Preview */}
                {formData.image_url && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Image Preview</Label>
                    <div className="mt-2 border rounded-md overflow-hidden bg-gray-50 aspect-video flex items-center justify-center">
                      <img 
                        src={formData.image_url} 
                        alt="Workshop preview" 
                        className="max-w-full max-h-[200px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Workshop Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-md border">
                  <h4 className="font-medium text-sm mb-2">Workshop Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Title:</span>
                      <span className="col-span-2 font-medium">{formData.title || 'Not set'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Date:</span>
                      <span className="col-span-2">
                        {formData.start_date 
                          ? format(new Date(formData.start_date), 'MMM d, yyyy h:mm a')
                          : 'Not set'
                        }
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Location:</span>
                      <span className="col-span-2">{formData.location || 'Not set'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="col-span-2">{formData.capacity || 'Not set'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Price:</span>
                      <span className="col-span-2">
                        {formData.price !== undefined && formData.price !== null
                          ? formData.price > 0 
                            ? `GH₵${formData.price}`
                            : 'Free'
                          : 'Not set'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveSection('details')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditing ? 'Update Workshop' : 'Create Workshop'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex justify-between w-full">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              
              {formTouched && (
                <div className="flex gap-2">
                  {activeSection !== 'media' ? (
                    <Button 
                      type="button" 
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        isEditing ? 'Update Workshop' : 'Create Workshop'
                      )}
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopForm;
