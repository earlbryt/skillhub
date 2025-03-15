
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { useAuth } from "./contexts/AuthContext";
import { useAdmin } from "./contexts/AdminContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Workshops from "./pages/Workshops";
import WorkshopDetails from "./pages/WorkshopDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";

// Admin imports
import AdminDashboard from "./pages/admin/Dashboard";
import AdminWorkshops from "./pages/admin/Workshops";
import AdminWorkshopAttendees from "./pages/admin/WorkshopAttendees";
import AdminUsers from "./pages/admin/Users";
import AdminOverview from "./pages/admin/Overview";

const queryClient = new QueryClient();

// Scroll to top on every navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route for Admin pages
const AdminRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Checking permissions...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            {/* Add ScrollToTop component to handle scrolling on route changes */}
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/workshops/:id" element={<WorkshopDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<UserProfile />} />
              
              {/* Admin Routes protected by AdminRoute */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="workshops" element={<AdminWorkshops />} />
                  <Route path="workshops/:id/attendees" element={<AdminWorkshopAttendees />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
