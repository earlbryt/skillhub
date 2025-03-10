
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, BookOpen, Calendar, Award } from 'lucide-react';

const AdminOverview = () => {
  // Mock data
  const stats = [
    { title: 'Total Users', value: '342', icon: Users, color: 'bg-primary/10 text-primary' },
    { title: 'Active Workshops', value: '18', icon: BookOpen, color: 'bg-accent/10 text-accent' },
    { title: 'Upcoming Events', value: '7', icon: Calendar, color: 'bg-secondary/10 text-secondary' },
    { title: 'Registrations', value: '289', icon: Award, color: 'bg-destructive/10 text-destructive' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <Card className="p-6">
        <p className="text-muted-foreground">View recent registrations and user activity here.</p>
      </Card>
    </div>
  );
};

export default AdminOverview;
