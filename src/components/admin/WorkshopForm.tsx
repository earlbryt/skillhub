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
    }
  }, [workshop]);
  
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
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for submission
      const now = new Date().toISOString();
      const workshopData = {
        ...formData,
        updated_at: now
      };
      
      if (!isEditing) {
        // Add created_at for new workshops
        workshopData.created_at = now;
      }
      
      if (isEditing) {
        // Update existing workshop
        const { error } = await supabase
          .from('workshops')
          .update(workshopData)
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
          .insert([workshopData]);
          
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Workshop' : 'Add New Workshop'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Workshop title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Workshop description"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date & Time <span className="text-red-500">*</span></Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date || ''}
                  onChange={handleChange}
                  className={errors.start_date ? 'border-red-500' : ''}
                />
                {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date & Time <span className="text-red-500">*</span></Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date || ''}
                  onChange={handleChange}
                  className={errors.end_date ? 'border-red-500' : ''}
                />
                {errors.end_date && <p className="text-red-500 text-xs">{errors.end_date}</p>}
              </div>
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="Workshop location"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
            </div>
            
            {/* Capacity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity <span className="text-red-500">*</span></Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity || ''}
                  onChange={handleChange}
                  placeholder="Maximum attendees"
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && <p className="text-red-500 text-xs">{errors.capacity}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (GH₵)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
              </div>
            </div>
            
            {/* Instructor */}
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                name="instructor"
                value={formData.instructor || ''}
                onChange={handleChange}
                placeholder="Workshop instructor"
              />
            </div>
            
            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500">Enter a URL for the workshop image</p>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Workshop' : 'Create Workshop'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopForm; 