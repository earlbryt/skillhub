import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  BookOpen, 
  LogOut,
  ArrowLeft
} from 'lucide-react';

// Add CSS for hiding scrollbars
import './sidebar.css';

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
  ];

  const handleLogout = () => {
    // In a real application, perform logout logic here
    // For example: clear auth tokens, user data, etc.
    
    // Then navigate to the login page or home page
    navigate('/');
  };

  return (
    <Sidebar 
      className="fixed h-full z-10 bg-gradient-to-b from-blue-600 to-blue-800 transition-all duration-300 ease-in-out flex flex-col hide-scrollbar"
      style={{ width: sidebarCollapsed ? '4rem' : '16rem' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <SidebarContent className="flex-1 overflow-hidden hover:overflow-y-auto hide-scrollbar">
        <SidebarGroup>
          <div className="flex items-center justify-between p-4 border-b border-blue-500/30">
            <div className="flex items-center">
              <div className={`bg-white rounded-md flex items-center justify-center ${sidebarCollapsed ? 'w-8 h-8' : 'p-2'}`}>
                <span className="text-blue-700 font-bold">WA</span>
              </div>
              <span className={`text-white font-bold ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                Workshop Admin
              </span>
            </div>
          </div>
          
          <SidebarGroupContent className="hide-scrollbar">
            <div className="flex flex-col gap-2 mt-6 px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-md cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-white/20 text-white font-medium' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className="flex-shrink-0"><item.icon size={20} /></span>
                  <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
                    {item.title}
                  </span>
                </NavLink>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer with back to site button */}
      <div className="px-3 pb-4 mt-auto border-t border-blue-500/30 pt-4">
        <button 
          onClick={handleLogout}
          className={`
            flex items-center p-3 rounded-md cursor-pointer transition-all w-full
            text-white bg-white/10 hover:bg-white/20
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          <span className="flex-shrink-0"><ArrowLeft size={20} /></span>
          <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
            Back to Site
          </span>
        </button>
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;
