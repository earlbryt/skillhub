
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            Back to Site
          </Link>
        </Button>
        
        <h1 className="text-4xl font-bold mb-8 text-gradient-primary">Admin Dashboard</h1>
        
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-200px)] w-full border rounded-xl overflow-hidden shadow-sm">
            <AdminSidebar />
            <main className="flex-1 p-8 bg-card">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AdminDashboard;
