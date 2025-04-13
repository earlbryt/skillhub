
import React, { useState, createContext, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MobileNavigation from '@/components/MobileNavigation';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/workshops')) return 'Workshop Management';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/settings')) return 'Settings';
    return 'Admin Panel';
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="flex h-screen bg-gray-100">
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
              position: 'absolute',
              left: sidebarCollapsed ? '4rem' : '16rem',
              right: 0,
              top: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            {/* Header */}
            <header className="bg-white p-4 flex justify-between items-center shadow-md border-b border-gray-200 sticky top-0 z-10">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
                <div className="h-6 w-1 bg-blue-500 rounded-full mx-3 hidden md:block"></div>
                <span className="text-sm text-gray-500 hidden md:block">Admin Control Panel</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="py-2 px-4 pr-10 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </header>

            {/* Dashboard content */}
            <main className={`flex-1 overflow-auto p-6 space-y-6 ${isMobile ? 'pb-20' : ''}`}>
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
