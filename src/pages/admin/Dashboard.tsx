import React, { useState, createContext, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Search } from 'lucide-react';

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
            style={{ 
              position: 'absolute',
              left: sidebarCollapsed ? '4rem' : '16rem',
              right: 0,
              top: 0,
              bottom: 0
            }}
          >
            {/* Header */}
            <header className="bg-white p-4 flex justify-between items-center shadow-sm">
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="py-2 px-4 pr-10 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </header>

            {/* Dashboard content */}
            <main className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Outlet />
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </SearchContext.Provider>
  );
};

export default AdminDashboard;
