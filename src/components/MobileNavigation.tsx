
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        <Button
          onClick={() => navigate('/admin')}
          variant="ghost"
          className={`flex flex-col items-center justify-center rounded-none h-full ${
            isActive('/admin') ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-xs mt-1">Dashboard</span>
        </Button>
        
        <Button
          onClick={() => navigate('/admin/workshops')}
          variant="ghost"
          className={`flex flex-col items-center justify-center rounded-none h-full ${
            isActive('/admin/workshops') ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
          }`}
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Workshops</span>
        </Button>
        
        <Button
          onClick={() => navigate('/admin/users')}
          variant="ghost"
          className={`flex flex-col items-center justify-center rounded-none h-full ${
            isActive('/admin/users') ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
          }`}
        >
          <Users size={20} />
          <span className="text-xs mt-1">Users</span>
        </Button>
        
        <Button
          onClick={() => navigate('/admin/notifications')}
          variant="ghost"
          className="flex flex-col items-center justify-center rounded-none h-full text-gray-500"
        >
          <Bell size={20} />
          <span className="text-xs mt-1">Alerts</span>
        </Button>
        
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="flex flex-col items-center justify-center rounded-none h-full text-gray-500"
        >
          <ArrowLeft size={20} />
          <span className="text-xs mt-1">Exit</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
