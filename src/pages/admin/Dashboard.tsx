import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Search, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/workshops')) return 'Workshop Management';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/settings')) return 'Settings';
    return 'Admin Panel';
  };

  return (
    <div className="flex h-screen bg-blue-50">
      <SidebarProvider>
        <AdminSidebar 
          sidebarCollapsed={sidebarCollapsed}
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
        />
        
        {/* Main content with dynamic offset for sidebar */}
        <div 
          className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
          style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}
        >
          {/* Header */}
          <header className="bg-white p-4 flex justify-between items-center shadow-sm">
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 px-4 pr-10 border rounded-md w-64"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button className="p-2 text-gray-500">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  A
                </div>
                <span className="font-medium hidden sm:inline">Admin</span>
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
