
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users, Calendar, Clock, Ticket, CalendarCheck, TrendingUp, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type DashboardStats = {
  totalWorkshops: number;
  totalRegistrations: number;
  upcomingWorkshops: number;
  registrationRate: number;
  popularWorkshop: string;
  popularWorkshopRegistrations: number;
  recentWorkshops: Workshop[];
  recentRegistrations: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    workshop_title: string;
    created_at: string;
  }[];
  monthlyStats: {
    name: string;
    workshops: number;
    registrations: number;
  }[];
};

const AdminOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkshops: 0,
    totalRegistrations: 0,
    upcomingWorkshops: 0,
    registrationRate: 0,
    popularWorkshop: '',
    popularWorkshopRegistrations: 0,
    recentWorkshops: [],
    recentRegistrations: [],
    monthlyStats: []
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
        
        // Process the data for dashboard statistics
        const now = new Date();
        
        // Count upcoming workshops
        const upcomingWorkshops = workshops?.filter(w => new Date(w.start_date) > now).length || 0;
        
        // Calculate registration rate
        const registrationRate = workshops?.length && registrations?.length 
          ? Math.round((registrations.length / (workshops.reduce((sum, w) => sum + w.capacity, 0))) * 100) 
          : 0;
        
        // Find popular workshop
        const workshopCounts = new Map<string, { title: string, count: number }>();
        registrations?.forEach(registration => {
          const workshopId = registration.workshop_id;
          const workshopTitle = (registration.workshop as any)?.title || 'Unknown';
          
          if (!workshopCounts.has(workshopId)) {
            workshopCounts.set(workshopId, { title: workshopTitle, count: 0 });
          }
          
          const current = workshopCounts.get(workshopId);
          if (current) {
            workshopCounts.set(workshopId, { ...current, count: current.count + 1 });
          }
        });
        
        let popularWorkshop = '';
        let popularWorkshopRegistrations = 0;
        
        workshopCounts.forEach((value) => {
          if (value.count > popularWorkshopRegistrations) {
            popularWorkshopRegistrations = value.count;
            popularWorkshop = value.title;
          }
        });
        
        // Format recent registrations
        const recentRegistrations = (registrations || []).slice(0, 5).map(r => ({
          id: r.id,
          first_name: r.first_name,
          last_name: r.last_name,
          email: r.email,
          workshop_title: (r.workshop as any)?.title || 'Unknown',
          created_at: r.created_at
        }));
        
        // Generate monthly stats
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            date,
            month: format(date, 'MMM'),
            year: format(date, 'yyyy')
          };
        }).reverse();
        
        const monthlyStats = last6Months.map(month => {
          const monthStart = new Date(month.date.getFullYear(), month.date.getMonth(), 1);
          const monthEnd = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0);
          
          const workshopsInMonth = workshops?.filter(w => {
            const date = new Date(w.created_at);
            return date >= monthStart && date <= monthEnd;
          }).length || 0;
          
          const registrationsInMonth = registrations?.filter(r => {
            const date = new Date(r.created_at);
            return date >= monthStart && date <= monthEnd;
          }).length || 0;
          
          return {
            name: `${month.month}`,
            workshops: workshopsInMonth,
            registrations: registrationsInMonth
          };
        });
        
        setStats({
          totalWorkshops: workshops?.length || 0,
          totalRegistrations: registrations?.length || 0,
          upcomingWorkshops,
          registrationRate,
          popularWorkshop,
          popularWorkshopRegistrations,
          recentWorkshops: (workshops || []).slice(0, 3),
          recentRegistrations,
          monthlyStats
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
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Calculate workshop status
  const getWorkshopStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now > end) return 'completed';
    if (now >= start && now <= end) return 'active';
    return 'upcoming';
  };
  
  // Pie chart colors
  const COLORS = ['#6366f1', '#f43f5e', '#10b981'];
  
  // Prepare registration status data for pie chart
  const registrationStatusData = [
    { name: 'Upcoming', value: stats.upcomingWorkshops },
    { name: 'Active', value: stats.totalWorkshops - stats.upcomingWorkshops },
    { name: 'Filled', value: Math.round(stats.totalWorkshops * (stats.registrationRate / 100)) }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">View workshop and registration statistics</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Workshops</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.totalWorkshops}</h3>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700">
                  {stats.upcomingWorkshops} upcoming
                </Badge>
              </div>
            </Card>
            
            <Card className="p-6 border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Registrations</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.totalRegistrations}</h3>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Ticket className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                  {stats.registrationRate}% capacity filled
                </Badge>
              </div>
            </Card>
            
            <Card className="p-6 border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Popular Workshop</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 line-clamp-1">
                    {stats.popularWorkshop || "N/A"}
                  </h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                  {stats.popularWorkshopRegistrations} registrations
                </Badge>
              </div>
            </Card>
            
            <Card className="p-6 border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Upcoming Events</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.upcomingWorkshops}</h3>
                </div>
                <div className="bg-rose-100 p-3 rounded-lg">
                  <CalendarCheck className="h-6 w-6 text-rose-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700">
                  Next {Math.min(stats.upcomingWorkshops, 7)} days
                </Badge>
              </div>
            </Card>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Stats Chart */}
            <Card className="col-span-2 border border-slate-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">Monthly Activity</h3>
                <p className="text-sm text-slate-500">Workshops and registrations over time</p>
              </div>
              <div className="h-72 px-4">
                <ChartContainer 
                  config={{
                    workshops: { color: '#6366f1' },
                    registrations: { color: '#10b981' },
                  }}
                >
                  <BarChart data={stats.monthlyStats} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="workshops" name="Workshops" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="registrations" name="Registrations" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ChartContainer>
              </div>
            </Card>
            
            {/* Registration Status Chart */}
            <Card className="border border-slate-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">Workshop Status</h3>
                <p className="text-sm text-slate-500">Distribution by status</p>
              </div>
              <div className="h-72 flex items-center justify-center">
                <PieChart width={250} height={250}>
                  <Pie
                    data={registrationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {registrationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </Card>
          </div>
          
          {/* Recent Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Workshops */}
            <Card className="border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">Recent Workshops</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {stats.recentWorkshops.length > 0 ? (
                  stats.recentWorkshops.map((workshop) => {
                    const status = getWorkshopStatus(workshop.start_date, workshop.end_date);
                    return (
                      <div key={workshop.id} className="p-4 hover:bg-slate-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-900">{workshop.title}</h4>
                          <Badge variant={
                            status === 'active' ? 'default' : 
                            status === 'upcoming' ? 'secondary' : 'outline'
                          } className={
                            status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 
                            status === 'upcoming' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 
                            'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }>
                            {status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            {formatDate(workshop.start_date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            {formatTime(workshop.start_date)}
                          </div>
                          <div className="flex items-center col-span-2">
                            <Users className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            Capacity: {workshop.capacity}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    No recent workshops
                  </div>
                )}
              </div>
            </Card>
            
            {/* Recent Registrations */}
            <Card className="border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">Recent Registrations</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {stats.recentRegistrations.length > 0 ? (
                  stats.recentRegistrations.map((registration) => (
                    <div key={registration.id} className="p-4 hover:bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-900">
                          {registration.first_name} {registration.last_name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {format(new Date(registration.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-slate-400">{registration.email}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">
                            {registration.workshop_title}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    No recent registrations
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
