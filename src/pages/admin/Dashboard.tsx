
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Site
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-180px)] w-full border rounded-lg overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 p-6 bg-card">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AdminDashboard;
