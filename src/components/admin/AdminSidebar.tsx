
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
import { Users, BookOpen, LayoutDashboard } from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { title: 'Workshops', path: '/admin/workshops', icon: BookOpen },
    { title: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <Sidebar className="border-r border-slate-200 bg-slate-50">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-medium">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => 
                        isActive ? 'text-indigo-700 bg-indigo-50 font-medium' : 'text-slate-700 hover:bg-slate-100'
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
