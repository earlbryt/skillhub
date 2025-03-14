
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Calendar, Award, TrendingUp, DollarSign } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const AdminOverview = () => {
  // Mock data
  const stats = [
    { title: 'Total Users', value: '342', icon: Users, color: 'bg-primary/10 text-primary' },
    { title: 'Active Workshops', value: '18', icon: BookOpen, color: 'bg-accent/10 text-accent' },
    { title: 'Upcoming Events', value: '7', icon: Calendar, color: 'bg-secondary/10 text-secondary' },
    { title: 'Registrations', value: '289', icon: Award, color: 'bg-destructive/10 text-destructive' },
    { title: 'Monthly Revenue', value: '$4,280', icon: DollarSign, color: 'bg-green-500/10 text-green-500' },
    { title: 'Growth Rate', value: '+24%', icon: TrendingUp, color: 'bg-blue-500/10 text-blue-500' },
  ];

  // Mock recent activity data
  const recentActivity = [
    { user: 'Emma Thompson', action: 'Registered', workshop: 'UI/UX Design Principles', time: '2 hours ago' },
    { user: 'James Wilson', action: 'Cancelled', workshop: 'Data Science Essentials', time: '5 hours ago' },
    { user: 'Sophia Garcia', action: 'Completed', workshop: 'Web Development Fundamentals', time: '1 day ago' },
    { user: 'Lucas Kim', action: 'Registered', workshop: 'Mobile App Development', time: '1 day ago' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gradient-primary">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border border-border/40 hover:border-border/70 transition-all duration-300 shadow-sm hover:shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="text-2xl font-semibold mb-6">Recent Activity</h3>
      <Card className="border border-border/40 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Workshop</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity, index) => (
              <TableRow key={index} className="hover:bg-muted/20">
                <TableCell className="font-medium">{activity.user}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.action === 'Registered' ? 'bg-green-100 text-green-800' :
                    activity.action === 'Cancelled' ? 'bg-red-100 text-red-800' :
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
