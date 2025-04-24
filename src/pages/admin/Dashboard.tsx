
import React, { createContext, useContext, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  FileText,
  Users,
  MessageSquare,
  HelpCircle,
  Search,
} from 'lucide-react';

// Create a context for search functionality
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

// Custom hook to use the search context
export const useSearch = () => useContext(SearchContext);

// Create a provider component
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

const Dashboard = () => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>Summary of key metrics</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="text-sm font-medium">Total Revenue</div>
          <div className="text-2xl font-semibold">$240,000</div>
          <LineChart className="h-8 w-full" />
        </CardContent>
      </Card>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>How users are interacting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="text-sm font-medium">Active Users</div>
          <div className="text-2xl font-semibold">4,567</div>
          <BarChart className="h-8 w-full" />
        </CardContent>
      </Card>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
          <CardDescription>Performance of content pieces</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="text-sm font-medium">Most Popular Article</div>
          <div className="text-xl font-semibold">"10 Tips for Success"</div>
          <PieChart className="h-8 w-full" />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest activities on the platform</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">New Article Published</div>
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">User Registered</div>
            <Users className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">New Comment</div>
            <MessageSquare className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Support Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Support Requests</CardTitle>
          <CardDescription>Open support tickets</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="text-sm font-medium">Open Tickets</div>
          <div className="text-2xl font-semibold">32</div>
          <HelpCircle className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
