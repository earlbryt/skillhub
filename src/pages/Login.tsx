import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signInWithGoogle, user } = useAuth();
  const { checkAdminStatus } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from query params, if any
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  useEffect(() => {
    // If user is already logged in, redirect to home page or specified path
    if (user) {
      if (redirectPath.includes('/admin')) {
        // If trying to access admin, check admin status first
        checkAdminStatus().then(isAdmin => {
          if (isAdmin) {
            navigate(redirectPath);
          } else {
            navigate('/');
            toast({
              title: "Access Denied",
              description: "You don't have admin privileges",
              variant: "destructive"
            });
          }
        });
      } else {
        navigate(redirectPath);
      }
    }
  }, [user, navigate, redirectPath, checkAdminStatus, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    setIsLoading(false);
    
    if (!error) {
      // The auth context will handle navigation based on redirectPath
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  const handleAdminLogin = async () => {
    // Set the admin credentials
    const adminEmail = 'admin@workshops.com';
    const adminPassword = 'admin123';
    
    setEmail(adminEmail);
    setPassword(adminPassword);
    
    toast({
      title: "Admin Credentials Set",
      description: "You can now sign in as an admin",
    });
    
    // Check if this admin email already exists as a user
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (userError) {
      // Admin user doesn't exist, try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (signUpError) {
        toast({
          title: "Error",
          description: "Failed to create admin user: " + signUpError.message,
          variant: "destructive"
        });
        return;
      }
      
      // If signup was successful and we have a user, make them an admin
      if (signUpData && signUpData.user) {
        // Insert into admin_users table
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([{ user_id: signUpData.user.id }]);
        
        if (adminError) {
          toast({
            title: "Error",
            description: "Failed to set admin privileges: " + adminError.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Admin user created successfully",
          });
        }
      }
    } else if (userData && userData.user) {
      // User exists, check if they are already an admin
      const { data: adminData, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      if (adminCheckError && adminCheckError.code !== 'PGRST116') {
        // Real error, not just "no rows returned"
        toast({
          title: "Error",
          description: "Failed to check admin status: " + adminCheckError.message,
          variant: "destructive"
        });
      } else if (!adminData) {
        // User exists but is not an admin, make them an admin
        const { error: adminInsertError } = await supabase
          .from('admin_users')
          .insert([{ user_id: userData.user.id }]);
        
        if (adminInsertError) {
          toast({
            title: "Error",
            description: "Failed to set admin privileges: " + adminInsertError.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Admin privileges granted",
          });
        }
      } else {
        toast({
          title: "Admin Ready",
          description: "This user already has admin privileges",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="rounded border-input h-4 w-4 text-primary focus:ring-primary"
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">Remember me</Label>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            
            {/* Admin Login Option */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Admin Access</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={handleAdminLogin}
            >
              <span className="flex items-center gap-2">
                Use Admin Credentials
              </span>
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account?</span>{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
