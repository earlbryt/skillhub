import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Define the user type for the form
interface UserFormData {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: string;
  is_admin?: boolean;
  is_active?: boolean;
  notes?: string;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserFormData; // If provided, we're editing; if not, we're adding
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user
}) => {
  const isEditing = !!user;
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'user',
    is_admin: false,
    is_active: true,
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        ...user
      });
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing && user?.id) {
        // Update existing user in registrations table
        // Note: In a real app, you would update all registrations for this user
        // or have a separate users table. This is a simplified approach.
        const { error: updateError } = await supabase
          .from('registrations')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            // Store metadata in a separate column or table in a real app
            // For demo purposes, we'll just update the registration
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        // If email is changed, update all registrations for this user
        if (user.email !== formData.email) {
          // This would typically be handled by a server function
          toast({
            title: "Email update",
            description: "Email changes require additional verification and will be processed separately.",
            variant: "default",
          });
        }
        
        setSuccess(true);
        toast({
          title: "User updated",
          description: "The user has been successfully updated.",
          variant: "default",
        });
        
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        // First, get the first workshop to use as a default
        const { data: workshops, error: workshopsError } = await supabase
          .from('workshops')
          .select('id')
          .limit(1);
          
        if (workshopsError) throw workshopsError;
        
        if (!workshops || workshops.length === 0) {
          throw new Error('No workshops found. Please create a workshop first.');
        }
        
        // Create new user registration
        // In a real app, this would create a user account first
        const { data: newRegistration, error: createError } = await supabase
          .from('registrations')
          .insert({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            status: 'active', // Default status for new registrations
            created_at: new Date().toISOString(),
            workshop_id: workshops[0].id, // Required field
            // In a real app, you would store role, admin status, etc. in a separate users table
            // For demo purposes, we're just creating a registration
          })
          .select();
          
        if (createError) throw createError;
        
        setSuccess(true);
        toast({
          title: "User created",
          description: "The user has been successfully created.",
          variant: "default",
        });
        
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving user:', err);
      setError(err.message || 'An error occurred while saving the user.');
      toast({
        title: "Error",
        description: err.message || 'An error occurred while saving the user.',
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
          <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start mb-4">
            <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{isEditing ? 'User updated successfully!' : 'User created successfully!'}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <div className="relative">
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <div className="relative">
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="pl-10"
                  disabled={isEditing} // Email can't be changed directly for existing users
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Email changes require additional verification and will be processed separately.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="pl-10"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <Select
                  value={formData.role || 'user'}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Regular User</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Note: In this demo, role changes are for display only.
                </p>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_admin">Admin Access</Label>
                    <p className="text-xs text-gray-500">Grant admin dashboard access</p>
                  </div>
                  <Switch
                    id="is_admin"
                    checked={formData.is_admin || false}
                    onCheckedChange={(checked) => handleSwitchChange('is_admin', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-xs text-gray-500">User can log in and access the system</p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active !== false}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Note: In this demo, status changes are for display only.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Admin Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="Add any notes about this user (only visible to admins)"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: In this demo, notes are for display only.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>{isEditing ? 'Update User' : 'Create User'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm; 