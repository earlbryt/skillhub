
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto px-4 py-4">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} />
            Back to Site
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-6 text-slate-900">Admin Dashboard</h1>
        
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-160px)] w-full rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200">
            <AdminSidebar />
            <main className="flex-1 p-6 bg-white">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AdminDashboard;
