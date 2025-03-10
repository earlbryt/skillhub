
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Users, BookOpen, Home, Settings, BarChart } from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { title: 'Overview', path: '/admin', icon: Home },
    { title: 'Workshops', path: '/admin/workshops', icon: BookOpen },
    { title: 'Users', path: '/admin/users', icon: Users },
    { title: 'Analytics', path: '/admin/analytics', icon: BarChart },
    { title: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => 
                        isActive ? 'text-primary' : 'text-foreground'
                      }
                      end={item.path === '/admin'}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
