
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SK</span>
          </div>
          <span className="font-bold text-xl">SkillHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={cn(
              "font-medium text-foreground/90 hover:text-blue-600 transition-colors",
              location.pathname === "/" && "text-blue-600"
            )}
          >
            Home
          </Link>
          <Link 
            to="/workshops" 
            className={cn(
              "font-medium text-foreground/90 hover:text-blue-600 transition-colors",
              location.pathname.includes("/workshops") && "text-blue-600"
            )}
          >
            Workshops
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User size={16} />
                  My Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut()} className="flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login" className="flex items-center gap-2">
                  <User size={16} />
                  Login
                </Link>
              </Button>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 bg-background z-50 transition-transform duration-300 ease-in-out transform",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ paddingTop: "4rem" }}
      >
        <div className="p-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={cn(
                "font-medium text-xl py-3 border-b border-border",
                location.pathname === "/" && "text-blue-600"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/workshops" 
              className={cn(
                "font-medium text-xl py-3 border-b border-border",
                location.pathname.includes("/workshops") && "text-blue-600"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Workshops
            </Link>
            
            <div className="flex flex-col space-y-4 pt-6">
              {user ? (
                <>
                  <Button variant="outline" className="w-full justify-center" asChild>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      My Profile
                    </Link>
                  </Button>
                  <Button 
                    variant="default" 
                    className="w-full justify-center bg-blue-600 hover:bg-blue-700" 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full justify-center" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700" asChild>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
