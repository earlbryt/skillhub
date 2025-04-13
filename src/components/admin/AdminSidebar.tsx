
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ArrowLeft,
  Bell,
  Settings,
  BarChart3,
  Search,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAdmin } from '@/contexts/AdminContext';

// Add CSS for hiding scrollbars
import './sidebar.css';

interface AdminSidebarProps {
  sidebarCollapsed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const AdminSidebar = ({ sidebarCollapsed, onMouseEnter, onMouseLeave }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  
  const mainNavItems = [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { title: 'Workshops', path: '/admin/workshops', icon: BookOpen },
    { title: 'Users', path: '/admin/users', icon: Users },
    { title: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const secondaryNavItems = [
    { title: 'Notifications', path: '/admin/notifications', icon: Bell },
    { title: 'Settings', path: '/admin/settings', icon: Settings },
    { title: 'Help & Support', path: '/admin/help', icon: HelpCircle },
  ];

  const handleLogout = () => {
    // In a real application, perform logout logic here
    // For example: clear auth tokens, user data, etc.
    
    // Then navigate to the login page or home page
    navigate('/');
  };

  return (
    <Sidebar 
      className="fixed h-full z-10 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col hide-scrollbar shadow-sm"
      style={{ width: sidebarCollapsed ? '4rem' : '16rem' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <SidebarHeader className="p-4">
        <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="bg-blue-600 rounded-md flex items-center justify-center h-8 w-8 flex-shrink-0">
            <span className="text-white font-bold">WA</span>
          </div>
          <h2 className={`font-semibold text-lg transition-opacity duration-300 text-gray-800 ${sidebarCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
            Workshop Admin
          </h2>
        </div>
      </SidebarHeader>
      
      <div className={`px-3 mt-2 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-9 pl-8 pr-3 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <SidebarContent className="flex-1 overflow-hidden hover:overflow-y-auto hide-scrollbar mt-4">
        <SidebarGroup>
          <div className={`mb-2 px-4 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Main</span>
          </div>
          
          <SidebarGroupContent>
            <div className="flex flex-col gap-1 px-2">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-md cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
        
        <Separator className="my-4 mx-2" />
        
        <SidebarGroup>
          <div className={`mb-2 px-4 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">System</span>
          </div>
          
          <SidebarGroupContent>
            <div className="flex flex-col gap-1 px-2">
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-md cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
      <SidebarFooter className="mt-auto pt-4 pb-4 border-t border-gray-200 px-3">
        <Button 
          onClick={handleLogout}
          variant="outline"
          className={`
            flex items-center w-full justify-between p-2 text-gray-700
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          <span className="flex items-center">
            <ArrowLeft size={18} className="flex-shrink-0" />
            <span className={`ml-2 whitespace-nowrap transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
              Back to Site
            </span>
          </span>
        </Button>
        
        {!sidebarCollapsed && (
          <div className="mt-4 px-2">
            <div className="flex items-center space-x-3 bg-blue-50 p-2 rounded-md">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {isAdmin ? 'A' : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@example.com</p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
