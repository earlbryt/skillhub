import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAdmin, loading: adminLoading } = useAdmin(); // Access admin context
  
  const activeStyle = "text-blue-600 hover:text-blue-800 font-semibold transition-colors";
  const inactiveStyle = "text-gray-600 hover:text-gray-800 transition-colors";

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-semibold text-xl">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="hidden sm:inline">Workshop Hub</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={isActiveLink("/") ? activeStyle : inactiveStyle}>
            Home
          </Link>
          <Link to="/workshops" className={isActiveLink("/workshops") ? activeStyle : inactiveStyle}>
            Workshops
          </Link>
          
          {/* Admin Dashboard Link - only visible to admin users */}
          {!adminLoading && isAdmin && (
            <Link to="/admin" className={isActiveLink("/admin") ? activeStyle : inactiveStyle}>
              Admin
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-500 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* User Menu */}
        <div className="hidden md:block">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.email && user.email[0].toUpperCase()}
                </div>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white border rounded-md shadow-xl z-10">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  {/* Admin Dashboard link in dropdown - only for admin users */}
                  {!adminLoading && isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleSignOut} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className={isActiveLink("/") ? activeStyle : inactiveStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/workshops" 
              className={isActiveLink("/workshops") ? activeStyle : inactiveStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Workshops
            </Link>
            
            {/* Admin Dashboard link in mobile menu - only for admin users */}
            {!adminLoading && isAdmin && (
              <Link 
                to="/admin" 
                className={isActiveLink("/admin") ? activeStyle : inactiveStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block py-2 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }} 
                  className="block w-full text-left py-2 text-gray-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
