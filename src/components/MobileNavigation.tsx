
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogIn, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  
  // Don't render on desktop or admin routes
  if (!isMobile || location.pathname.startsWith('/admin')) return null;
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center ${
            isActive('/') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => navigate('/workshops')}
          className={`flex flex-col items-center justify-center ${
            isActive('/workshops') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Workshops</span>
        </button>
        
        {user ? (
          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center justify-center ${
              isActive('/profile') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className={`flex flex-col items-center justify-center ${
              isActive('/login') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <LogIn size={20} />
            <span className="text-xs mt-1">Login</span>
          </button>
        )}
        
        {user && (
          <button
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        )}
        
        {!user && (
          <button
            onClick={() => navigate('/signup')}
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <User size={20} />
            <span className="text-xs mt-1">Sign Up</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
