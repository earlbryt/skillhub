
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

type AdminContextType = {
  isAdmin: boolean;
  loading: boolean;
  checkAdminStatus: () => Promise<boolean>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // List of admin emails - in a real app, this would be stored in a database
  const adminEmails = ['admin@example.com', 'admin@workshops.com'];

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if user's email is in the admin list
      const userIsAdmin = adminEmails.includes(user.email || '');
      setIsAdmin(userIsAdmin);
      return userIsAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin privileges",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    const verifyAdminStatus = async () => {
      setLoading(true);
      await checkAdminStatus();
      setLoading(false);
    };

    if (user) {
      verifyAdminStatus();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user]);

  return (
    <AdminContext.Provider value={{ isAdmin, loading, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
