import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users, Calendar, BookOpen, Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useSearch } from './Dashboard';

type DashboardStats = {
  totalUsers: number;
  totalWorkshops: number;
  upcomingWorkshops: number;
  registrationRate: number;
  recentRegistrations: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    workshop_title: string;
    created_at: string;
    status: string;
  }[];
};

const AdminOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalWorkshops: 0,
    upcomingWorkshops: 0,
    registrationRate: 0,
    recentRegistrations: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { searchQuery } = useSearch();
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        // Fetch workshops
        const { data: workshops, error: workshopsError } = await supabase
          .from('workshops')
          .select('*')
          .order('start_date', { ascending: false });
          
        if (workshopsError) throw workshopsError;
        
        // Fetch registrations
        const { data: registrations, error: registrationsError } = await supabase
          .from('registrations')
          .select('*, workshop:workshops(title)')
          .order('created_at', { ascending: false });
          
        if (registrationsError) throw registrationsError;
        
        // Get unique emails from registrations to count total users
        const uniqueEmails = new Set();
        registrations?.forEach(registration => {
          if (registration.email) {
            uniqueEmails.add(registration.email);
          }
        });
        
        const totalUniqueUsers = uniqueEmails.size;
        
        // Process the data for dashboard statistics
        const now = new Date();
        
        // Count upcoming workshops
        const upcomingWorkshops = workshops?.filter(w => new Date(w.start_date) > now) || [];
        const upcomingWorkshopsCount = upcomingWorkshops.length;
        
        // Calculate registration rate for upcoming workshops only
        let registrationRate = 0;
        if (upcomingWorkshopsCount > 0) {
          // Get total capacity of upcoming workshops
          const totalUpcomingCapacity = upcomingWorkshops.reduce((sum, w) => sum + w.capacity, 0);
          
          // Count registrations for upcoming workshops
          const upcomingWorkshopIds = upcomingWorkshops.map(w => w.id);
          const upcomingRegistrationsCount = registrations?.filter(
            r => upcomingWorkshopIds.includes(r.workshop_id)
          ).length || 0;
          
          // Calculate rate
          registrationRate = totalUpcomingCapacity > 0 
            ? Math.round((upcomingRegistrationsCount / totalUpcomingCapacity) * 100)
            : 0;
        }
        
        // Format recent registrations
        const recentRegistrations = (registrations || []).slice(0, 8).map(r => ({
          id: r.id,
          first_name: r.first_name,
          last_name: r.last_name,
          email: r.email,
          workshop_title: (r.workshop as any)?.title || 'Unknown',
          created_at: r.created_at,
          status: r.status
        }));
        
        setStats({
          totalUsers: totalUniqueUsers,
          totalWorkshops: workshops?.length || 0,
          upcomingWorkshops: upcomingWorkshopsCount,
          registrationRate,
          recentRegistrations,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: "Error loading dashboard",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, [toast]);
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd-MM-yyyy');
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch(status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'waitlisted':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    if (!status) return 'Registered';
    
    // Capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Stats cards data
  const statsCards = [
    { 
      title: 'Total Users', 
      amount: stats.totalUsers, 
      change: 'Unique registered users', 
      icon: <Users size={18} />, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Total Workshops', 
      amount: stats.totalWorkshops, 
      change: `${stats.upcomingWorkshops} upcoming`, 
      icon: <Calendar size={18} />, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Upcoming Workshops', 
      amount: stats.upcomingWorkshops, 
      change: `${stats.upcomingWorkshops} scheduled`, 
      icon: <BookOpen size={18} />, 
      color: 'bg-orange-400' 
    },
    { 
      title: 'Registration Rate', 
      amount: `${stats.registrationRate}%`, 
      change: 'of capacity filled', 
      icon: <Users size={18} />, 
      color: 'bg-blue-500' 
    },
  ];

  // Filter recent registrations based on search query
  const filteredRegistrations = stats.recentRegistrations.filter(registration => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      registration.first_name.toLowerCase().includes(query) ||
      registration.last_name.toLowerCase().includes(query) ||
      registration.email.toLowerCase().includes(query) ||
      registration.workshop_title.toLowerCase().includes(query) ||
      registration.status?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="bg-white shadow-md border-l-4 border-t-0 border-r-0 border-b-0 hover:shadow-lg transition-all duration-300" style={{ borderLeftColor: stat.color }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white shadow-sm`}>
                  {stat.icon}
                </div>
                <button>
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.amount}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Registrations</h2>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery 
                  ? `${filteredRegistrations.length} registrations found for "${searchQuery}"`
                  : `Showing ${stats.recentRegistrations.length} recent workshop registrations`
                }
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-sm">
                View All
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">User Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Workshop</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                          {registration.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{registration.first_name} {registration.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{registration.email}</td>
                    <td className="py-4 px-6 text-sm font-medium text-blue-600">{registration.workshop_title}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(registration.status)} shadow-sm`}>
                        {formatStatus(registration.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{formatDate(registration.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    {searchQuery 
                      ? `No registrations found matching "${searchQuery}"`
                      : "No recent registrations found"
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredRegistrations.length > 0 && (
          <div className="flex justify-between items-center p-6 border-t border-gray-200 text-sm bg-gray-50">
            <p className="text-gray-600">Page 1 of 1</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md bg-white flex items-center gap-1 text-gray-500 shadow-sm" disabled>
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button className="px-3 py-1 border border-transparent rounded-md bg-blue-500 text-white flex items-center gap-1 shadow-sm" disabled>
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
