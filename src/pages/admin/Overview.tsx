import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users, Calendar, BookOpen, Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Stats cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex-1 min-w-64 h-32">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <p className="text-3xl font-bold">{stat.amount}</p>
                  <p className="text-xs mt-1 text-gray-500">{stat.change}</p>
                </div>
              </div>
              <button className="self-start">
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-bold">Recent Registrations</h2>
            <p className="text-sm text-gray-500">Showing {stats.recentRegistrations.length} recent workshop registrations</p>
          </div>
          <div className="flex gap-3">
            <Button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              View All
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Workshop</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {registration.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{registration.first_name} {registration.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{registration.email}</td>
                    <td className="py-3 px-4 text-sm font-medium">{registration.workshop_title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(registration.status)}`}>
                        {formatStatus(registration.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(registration.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No recent registrations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
