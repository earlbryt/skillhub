
import React, { useState, createContext, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MobileNavigation from '@/components/MobileNavigation';
import { Search, Bell, HelpCircle, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Create a context for search functionality
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export const useSearch = () => useContext(SearchContext);

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/workshops')) return 'Workshop Management';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/settings')) return 'Settings';
    if (path.includes('/admin/analytics')) return 'Analytics';
    if (path.includes('/admin/notifications')) return 'Notifications';
    if (path.includes('/admin/help')) return 'Help & Support';
    return 'Admin Panel';
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="flex h-screen bg-gray-50">
        <SidebarProvider>
          <AdminSidebar 
            sidebarCollapsed={sidebarCollapsed}
            onMouseEnter={() => setSidebarCollapsed(false)}
            onMouseLeave={() => setSidebarCollapsed(true)}
          />
          
          {/* Main content with dynamic offset for sidebar */}
          <div 
            className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out pb-16 md:pb-0"
            style={{ 
              marginLeft: sidebarCollapsed ? '4rem' : '16rem',
            }}
          >
            {/* Header */}
            <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-gray-200 sticky top-0 z-10">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                <div className="h-6 w-1 bg-blue-500 rounded-full mx-3 hidden md:block"></div>
                <span className="text-sm text-gray-500 hidden md:block">Admin Control Panel</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="hidden md:block relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="py-2 px-4 pr-10 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell size={20} />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-auto">
                      <div className="p-3 hover:bg-gray-100 cursor-pointer">
                        <p className="text-sm font-medium">New workshop created</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-100 cursor-pointer">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="ghost" size="icon">
                  <HelpCircle size={20} />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <UserCircle size={24} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {}}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {}}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Dashboard content */}
            <main className="flex-1 overflow-auto p-6 space-y-6">
              {/* Breadcrumb */}
              <nav className="text-sm mb-6" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <Link to="/admin" className="text-blue-600 hover:text-blue-800">
                      Admin
                    </Link>
                    {location.pathname !== '/admin' && (
                      <>
                        <span className="mx-2 text-gray-500">/</span>
                        <span className="text-gray-600">{getPageTitle()}</span>
                      </>
                    )}
                  </li>
                </ol>
              </nav>
              
              <Outlet />
            </main>
          </div>
          
          {/* Mobile Navigation */}
          <MobileNavigation />
        </SidebarProvider>
      </div>
    </SearchContext.Provider>
  );
};

export default AdminDashboard;
