
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addAdminUser, removeAdminUser, isUserAdmin } from '@/services/userService';

interface UserManagementProps {
  userId: string;
  email: string;
  isAdmin: boolean;
  onStatusChange: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  userId, 
  email, 
  isAdmin, 
  onStatusChange 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isAdmin);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggleAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (currentStatus) {
        // Remove admin status
        await removeAdminUser(userId);
        setCurrentStatus(false);
        setSuccess(`Admin privileges removed from ${email}`);
        toast({
          title: "Admin Privileges Removed",
          description: `${email} is no longer an admin user.`,
          variant: "default",
        });
      } else {
        // Add admin status
        await addAdminUser(userId);
        setCurrentStatus(true);
        setSuccess(`Admin privileges granted to ${email}`);
        toast({
          title: "Admin Privileges Granted",
          description: `${email} is now an admin user.`,
          variant: "default",
        });
      }
      
      // Call the parent component's callback to refresh the user list
      onStatusChange();
    } catch (err: any) {
      console.error('Error toggling admin status:', err);
      setError(err.message || 'An error occurred while updating admin status.');
      toast({
        title: "Error",
        description: err.message || 'An error occurred while updating admin status.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-center text-green-500 text-sm">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>{success}</span>
        </div>
      )}
      
      <Button
        variant={currentStatus ? "destructive" : "default"}
        size="sm"
        onClick={handleToggleAdmin}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : currentStatus ? (
          <span className="flex items-center">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Remove Admin
          </span>
        ) : (
          <span className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Make Admin
          </span>
        )}
      </Button>
    </div>
  );
};

export default UserManagement;
