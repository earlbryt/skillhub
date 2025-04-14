
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  
  // Don't render on desktop, admin routes, or when chat is open
  if (!isMobile || 
      location.pathname.startsWith('/admin') || 
      document.body.classList.contains('chat-open')) {
    return null;
  }
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="grid grid-cols-3 h-16">
        {/* Home button */}
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center ${
            isActive('/') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        {/* Workshops button */}
        <button
          onClick={() => navigate('/workshops')}
          className={`flex flex-col items-center justify-center ${
            isActive('/workshops') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Workshops</span>
        </button>
        
        {/* Profile/Login button */}
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
      </div>
    </div>
  );
};

export default MobileNavigation;
