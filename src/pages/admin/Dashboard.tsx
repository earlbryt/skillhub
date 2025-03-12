
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-16 items-center border-b bg-card px-6">
        <Button variant="ghost" asChild size="sm" className="mr-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            Back to Site
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-64px)]">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            <div className="container max-w-7xl mx-auto p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
