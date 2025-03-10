
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminOverview from "./pages/admin/Overview";
import AdminWorkshops from "./pages/admin/Workshops";
import AdminWorkshopAttendees from "./pages/admin/WorkshopAttendees";
import AdminUsers from "./pages/admin/Users";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:id" element={<WorkshopDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<UserProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="workshops/:id/attendees" element={<AdminWorkshopAttendees />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
