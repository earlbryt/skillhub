
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">SK</span>
          </div>
          <span className="font-bold text-xl">SkillHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="font-medium text-foreground/90 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/workshops" 
            className="font-medium text-foreground/90 hover:text-primary transition-colors"
          >
            Workshops
          </Link>
          <Link 
            to="/about" 
            className="font-medium text-foreground/90 hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login" className="flex items-center gap-2">
              <User size={16} />
              Login
            </Link>
          </Button>
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/register">Register</Link>
          </Button>
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
          "md:hidden fixed inset-0 bg-background z-40 pt-20 px-6 transition-transform duration-300 ease-in-out transform",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-6">
          <Link 
            to="/" 
            className="font-medium text-xl py-2 border-b border-border"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/workshops" 
            className="font-medium text-xl py-2 border-b border-border"
            onClick={() => setIsMenuOpen(false)}
          >
            Workshops
          </Link>
          <Link 
            to="/about" 
            className="font-medium text-xl py-2 border-b border-border"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          
          <div className="flex flex-col space-y-4 mt-6">
            <Button variant="outline" className="w-full justify-center" asChild>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </Button>
            <Button className="w-full justify-center bg-primary hover:bg-primary/90" asChild>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
