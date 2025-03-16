import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  ArrowLeft
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarCollapsed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const AdminSidebar = ({ sidebarCollapsed, onMouseEnter, onMouseLeave }: AdminSidebarProps) => {
  const navigate = useNavigate();
  
  const navItems = [
    { title: 'Dashboard', path: '/admin', icon: Home },
    { title: 'Workshops', path: '/admin/workshops', icon: BookOpen },
    { title: 'Users', path: '/admin/users', icon: Users },
    { title: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    // In a real application, perform logout
    navigate('/');
  };

  return (
    <Sidebar 
      className="fixed h-full z-10 bg-gray-900 transition-all duration-300 ease-in-out"
      style={{ width: sidebarCollapsed ? '4rem' : '16rem' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className={`bg-blue-500 rounded-md flex items-center justify-center ${sidebarCollapsed ? 'w-8 h-8' : 'p-2'}`}>
                <span className="text-white font-bold">WA</span>
              </div>
              <span className={`text-white font-bold ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                Workshop Admin
              </span>
            </div>
          </div>
          
          <SidebarGroupContent>
            <div className="flex flex-col gap-2 mt-6 px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-md cursor-pointer transition-all
                    ${isActive ? 'bg-blue-500/20 text-blue-500' : 'text-gray-400 hover:bg-gray-800'}
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className="flex-shrink-0"><item.icon size={20} /></span>
                  <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
                    {item.title}
                  </span>
                </NavLink>
              ))}
              
              {/* Logout button */}
              <button 
                onClick={handleLogout}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-all text-gray-400 hover:bg-gray-800 w-full text-left ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <span className="flex-shrink-0"><LogOut size={20} /></span>
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
                  Logout
                </span>
              </button>
              
              {/* Back to site button */}
              <NavLink
                to="/"
                className={`flex items-center p-3 rounded-md cursor-pointer transition-all text-gray-400 hover:bg-gray-800 mt-4 ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <span className="flex-shrink-0"><ArrowLeft size={20} /></span>
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
                  Back to Site
                </span>
              </NavLink>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
