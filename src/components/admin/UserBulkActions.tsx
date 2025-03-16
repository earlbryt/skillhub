import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  UserCheck, 
  UserX, 
  Shield, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface UserBulkActionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedUserIds: string[];
}

const UserBulkActions: React.FC<UserBulkActionsProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedUserIds
}) => {
  const { toast } = useToast();
  
  // Form state
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Handle action selection
  const handleActionChange = (value: string) => {
    setSelectedAction(value);
    
    // Reset email message if not sending email
    if (value !== 'email') {
      setEmailMessage('');
    }
  };
  
  // Handle message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailMessage(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedAction) {
      setError('Please select an action to perform.');
      return;
    }
    
    if (selectedAction === 'email' && !emailMessage.trim()) {
      setError('Please enter a message to send.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      switch (selectedAction) {
        case 'activate':
          await updateUserStatus(true);
          break;
        case 'deactivate':
          await updateUserStatus(false);
          break;
        case 'grant_admin':
          await updateAdminStatus(true);
          break;
        case 'remove_admin':
          await updateAdminStatus(false);
          break;
        case 'email':
          await sendEmail();
          break;
        default:
          throw new Error('Invalid action selected.');
      }
      
      setSuccess(true);
      
      toast({
        title: "Bulk action completed",
        description: `Action successfully performed on ${selectedUserIds.length} users.`,
        variant: "default",
      });
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error performing bulk action:', err);
      setError(err.message || 'An error occurred while performing the bulk action.');
      toast({
        title: "Error",
        description: err.message || 'An error occurred while performing the bulk action.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update user status (activate/deactivate)
  const updateUserStatus = async (isActive: boolean) => {
    // In a real app, this would update the user status in the database
    // For demo purposes, we'll just show a toast
    
    toast({
      title: isActive ? "Users Activated" : "Users Deactivated",
      description: `${selectedUserIds.length} users have been ${isActive ? 'activated' : 'deactivated'}.`,
      variant: "default",
    });
    
    // Simulate a delay for the operation
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  // Update admin status (grant/remove admin access)
  const updateAdminStatus = async (isAdmin: boolean) => {
    // In a real app, this would update the admin status in the database
    // For demo purposes, we'll just show a toast
    
    toast({
      title: isAdmin ? "Admin Access Granted" : "Admin Access Removed",
      description: `Admin access has been ${isAdmin ? 'granted to' : 'removed from'} ${selectedUserIds.length} users.`,
      variant: "default",
    });
    
    // Simulate a delay for the operation
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  // Send email to selected users
  const sendEmail = async () => {
    // In a real app, this would send emails to the selected users
    // For demo purposes, we'll just show a toast
    
    toast({
      title: "Emails Sent",
      description: `Email has been sent to ${selectedUserIds.length} users.`,
      variant: "default",
    });
    
    // Simulate a delay for the operation
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Actions</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <p className="text-sm text-gray-600 mb-4">
            Perform actions on {selectedUserIds.length} selected users.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start mb-4">
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Bulk action completed successfully!</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action">Select Action</Label>
              <Select value={selectedAction} onValueChange={handleActionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action to perform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span>Activate Users</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="deactivate">
                    <div className="flex items-center">
                      <UserX className="h-4 w-4 mr-2 text-red-500" />
                      <span>Deactivate Users</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="grant_admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Grant Admin Access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="remove_admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Remove Admin Access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Send Email</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedAction === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="message">Email Message</Label>
                <Textarea
                  id="message"
                  value={emailMessage}
                  onChange={handleMessageChange}
                  placeholder="Enter your message to send to all selected users"
                  rows={5}
                  required
                />
              </div>
            )}
            
            <p className="text-xs text-gray-500 italic">
              Note: In this demo, actions are simulated and don't persist between sessions.
            </p>
            
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
                    Processing...
                  </>
                ) : (
                  'Apply to Selected Users'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserBulkActions; 