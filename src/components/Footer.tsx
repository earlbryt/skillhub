
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">SK</span>
              </div>
              <span className="font-bold text-xl">SkillHub</span>
            </Link>
            <p className="text-foreground/70 max-w-xs">
              Empowering students with practical skills through interactive workshops designed for the digital age.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="text-foreground/70 hover:text-primary transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-foreground/70 hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshops */}
          <div>
            <h3 className="font-bold text-lg mb-4">Popular Workshops</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/workshops/web-development" className="text-foreground/70 hover:text-primary transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/workshops/data-science" className="text-foreground/70 hover:text-primary transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/workshops/ui-design" className="text-foreground/70 hover:text-primary transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/workshops/digital-marketing" className="text-foreground/70 hover:text-primary transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link to="/workshops/mobile-development" className="text-foreground/70 hover:text-primary transition-colors">
                  Mobile Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-foreground/70">123 Innovation Street, Digital Campus, Africa</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <a href="mailto:info@skillhub.com" className="text-foreground/70 hover:text-primary transition-colors">
                  info@skillhub.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <a href="tel:+1234567890" className="text-foreground/70 hover:text-primary transition-colors">
                  +123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm">
              &copy; {new Date().getFullYear()} SkillHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-foreground/60 text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-foreground/60 text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-foreground/60 text-sm hover:text-primary transition-colors">
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
