
import React, { useState } from 'react';
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

const AdminSidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
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
      onMouseEnter={() => setSidebarCollapsed(false)}
      onMouseLeave={() => setSidebarCollapsed(true)}
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-md flex-shrink-0">
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
                  `}
                >
                  <span className="flex-shrink-0"><item.icon size={20} /></span>
                  <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    {item.title}
                  </span>
                </NavLink>
              ))}
              
              {/* Logout button */}
              <button 
                onClick={handleLogout}
                className="flex items-center p-3 rounded-md cursor-pointer transition-all text-gray-400 hover:bg-gray-800 w-full text-left"
              >
                <span className="flex-shrink-0"><LogOut size={20} /></span>
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                  Logout
                </span>
              </button>
              
              {/* Back to site button */}
              <NavLink
                to="/"
                className="flex items-center p-3 rounded-md cursor-pointer transition-all text-gray-400 hover:bg-gray-800 mt-4"
              >
                <span className="flex-shrink-0"><ArrowLeft size={20} /></span>
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
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
