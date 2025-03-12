
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import StatCard from '@/components/ui/stat-card';

const AdminOverview = () => {
  // Mock data
  const stats = [
    { title: 'Total Users', value: '342', icon: <Users size={20} className="text-blue-600" />, gradient: "from-blue-600 to-blue-800" },
    { title: 'Active Workshops', value: '18', icon: <BookOpen size={20} className="text-indigo-600" />, gradient: "from-indigo-600 to-indigo-800" },
    { title: 'Upcoming Events', value: '7', icon: <Calendar size={20} className="text-violet-600" />, gradient: "from-violet-600 to-violet-800" },
    { title: 'Monthly Growth', value: '+24%', icon: <TrendingUp size={20} className="text-purple-600" />, gradient: "from-purple-600 to-purple-800" },
  ];

  const recentActivity = [
    { user: 'Emma Thompson', action: 'Registered', workshop: 'UI/UX Design Principles', time: '2 hours ago' },
    { user: 'James Wilson', action: 'Cancelled', workshop: 'Data Science Essentials', time: '5 hours ago' },
    { user: 'Sophia Garcia', action: 'Completed', workshop: 'Web Development Fundamentals', time: '1 day ago' },
    { user: 'Lucas Kim', action: 'Registered', workshop: 'Mobile App Development', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            value={stat.value}
            label={stat.title}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
      </div>

      <Card className="overflow-hidden border-none shadow-md bg-card">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Workshop</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">{activity.user}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.action === 'Registered' ? 'bg-emerald-100 text-emerald-800' :
                    activity.action === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.action}
                  </span>
                </TableCell>
                <TableCell>{activity.workshop}</TableCell>
                <TableCell className="text-muted-foreground">{activity.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminOverview;
