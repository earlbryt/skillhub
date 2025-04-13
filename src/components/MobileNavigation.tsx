
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Settings, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't render on desktop
  if (!isMobile) return null;
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={() => navigate('/admin')}
          className={`flex flex-col items-center justify-center ${
            isActive('/admin') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Dashboard</span>
        </button>
        
        <button
          onClick={() => navigate('/admin/workshops')}
          className={`flex flex-col items-center justify-center ${
            isActive('/admin/workshops') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Workshops</span>
        </button>
        
        <button
          onClick={() => navigate('/admin/users')}
          className={`flex flex-col items-center justify-center ${
            isActive('/admin/users') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Users size={20} />
          <span className="text-xs mt-1">Users</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center text-gray-500"
        >
          <Settings size={20} />
          <span className="text-xs mt-1">Main Site</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
