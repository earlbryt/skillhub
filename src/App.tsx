
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Workshops } from './pages/Workshops';
import { WorkshopDetails } from './pages/WorkshopDetails';
import { UserProfile } from './pages/UserProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';
import AdminSidebar from './components/admin/AdminSidebar';
import Dashboard from './pages/admin/Dashboard';
import AdminWorkshops from './pages/admin/Workshops';
import AdminUsers from './pages/admin/Users';
import AdminOverview from './pages/admin/Overview';
import WorkshopAttendees from './pages/admin/WorkshopAttendees';
import Analytics from './pages/admin/Analytics';
import { SearchProvider } from './pages/admin/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:id" element={<WorkshopDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminSidebar />}>
            <Route index element={<Dashboard />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="workshops/:id/attendees" element={<WorkshopAttendees />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SearchProvider>
    </div>
  );
}

export default App;
