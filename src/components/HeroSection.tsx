
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain, Globe, GraduationCap, Search, BookOpen, Users, Award, Star, MapPin, School } from 'lucide-react';
import { Button } from './ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Workshop } from '@/types/supabase';
import { getWorkshops } from '@/services/workshopService';
import { motion } from 'framer-motion';

// Modal component for Hero section
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const workshops = await getWorkshops();
        const upcoming = workshops
          .filter(workshop => new Date(workshop.start_date) > new Date())
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 3);
        
        setUpcomingWorkshops(upcoming);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Magnetic effect for buttons
  useEffect(() => {
    const buttons = heroRef.current?.querySelectorAll('.magnetic-button');
    
    buttons?.forEach(button => {
      button.addEventListener('mousemove', (e: any) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / 8;
        const deltaY = (y - centerY) / 8;

        button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        (button as HTMLElement).style.transform = 'translate(0, 0)';
      });
    });
  }, []);

  const scrollToUniversities = () => {
    const universitiesSection = document.getElementById('universities');
    if (universitiesSection) {
      universitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <section id="home" ref={heroRef} className="relative pt-32 pb-20 overflow-hidden hardware-accelerated">
        {/* Background with reduced opacity for better performance */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-90"></div>
          
          {/* Geometric Patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Neural Network Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative z-10">
              {/* Floating Badge with iOS-like blur */}
              <div className="absolute -top-12 left-4 md:-left-6 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2 shadow-xl border border-indigo-50/50 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  AI-Powered Education
                </span>
              </div>

              {/* Main Content with optimized animations */}
              <h1 className="text-6xl font-bold leading-tight mb-6">
                <span className="block mb-2">Discover Your</span>
                <span className="relative">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                    Perfect Academic
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 400 8" fill="none">
                    <path d="M1 5.5C100 2.5 200 2.5 399 5.5" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="1" y1="5.5" x2="399" y2="5.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F46E5"/>
                        <stop offset="0.5" stopColor="#9333EA"/>
                        <stop offset="1" stopColor="#EC4899"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="block mt-2">Journey</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Connect with university advisors and leverage AI-powered insights to make informed decisions about your academic future.
              </p>

              {/* iOS-like CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => setShowGetStartedModal(true)}
                  className="magnetic-button px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={scrollToUniversities}
                  className="magnetic-button px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-indigo-600/20 hover:bg-indigo-50 text-gray-700 font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  <span>Explore Workshops</span>
                  <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>

              {/* Stats with iOS-like cards */}
              <div className="flex flex-wrap items-center gap-4 text-center">
                {[
                  { value: '50+', label: 'Workshops' },
                  { value: '1000+', label: 'Students' },
                  { value: '95%', label: 'Success Rate' }
                ].map((stat, index) => (
                  <div key={index} className="backdrop-blur-md bg-white/80 rounded-2xl p-4 shadow-lg border border-indigo-50/50 flex-1 min-w-[120px]">
                    <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Interactive Elements */}
            <div className="relative">
              {/* Decorative Background Elements */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
              
              {/* Main Content Container */}
              <div className="relative mx-4 sm:mx-0">
                {/* Premium Badge */}
                <div className="absolute -top-6 right-4 sm:right-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full shadow-xl transform -rotate-2 z-20">
                  <span className="text-sm font-semibold">Premium Guidance</span>
                </div>

                {/* Main Image Container */}
                <div className="relative bg-gradient-to-br from-white to-indigo-50/50 rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/50">
                  {/* Workshop Cards */}
                  <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Workshops</h2>
                    
                    {loading ? (
                      <div className="space-y-4">
                        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ) : upcomingWorkshops.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingWorkshops.map((workshop) => (
                          <Link 
                            key={workshop.id} 
                            to={`/workshops/${workshop.id}`}
                            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{workshop.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {new Date(workshop.start_date).toLocaleDateString('en-US', { 
                                    weekday: 'short',
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {workshop.location}
                                </p>
                              </div>
                              <span className="text-primary font-medium">
                                GH₵ {workshop.price?.toFixed(2)}
                              </span>
                            </div>
                          </Link>
                        ))}
                        
                        <Button variant="outline" className="w-full mt-4" asChild>
                          <Link to="/workshops">View All Workshops <ChevronRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No upcoming workshops available at the moment.</p>
                        <Button variant="outline" className="mt-4" asChild>
                          <Link to="/workshops">View All Workshops</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="hidden sm:block absolute -left-16 top-1/3 bg-white rounded-2xl shadow-xl p-4 transform -rotate-6 hover:rotate-0 transition-all duration-300 border border-indigo-50 z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Smart Matching</div>
                      <div className="text-sm text-gray-600">98% accuracy rate</div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block absolute -right-16 bottom-1/3 bg-white rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-all duration-300 border border-indigo-50 z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Premium Support</div>
                      <div className="text-sm text-gray-600">24/7 guidance</div>
                    </div>
                  </div>
                </div>

                {/* Active Users Indicator */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center sm:space-x-3 border border-indigo-50 hover:shadow-2xl transition-all duration-300 max-w-[90%] sm:max-w-none mx-auto">
                  <div className="flex -space-x-1.5 sm:-space-x-2 mb-2 sm:mb-0">
                    {[
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
                      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=150&q=80",
                      "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?auto=format&fit=crop&w=150&q=80"
                    ].map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Advisor ${index + 1}`}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 border-2 border-white flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs font-bold text-white">47+</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">50 Advisors Online</div>
                    <div className="flex items-center space-x-1 sm:space-x-1.5">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] sm:text-xs text-green-600 font-medium">Available Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={showGetStartedModal}
        onClose={() => setShowGetStartedModal(false)}
        title="Welcome to EduGuide!"
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Find Programs',
                description: 'Discover academic programs that match your interests and goals',
                icon: <Search className="w-5 h-5" />,
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                title: 'Compare Universities',
                description: 'Compare different universities side by side',
                icon: <School className="w-5 h-5" />,
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Application Guide',
                description: 'Step-by-step guidance for your university applications',
                icon: <BookOpen className="w-5 h-5" />,
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Connect with Advisors',
                description: 'Get personalized guidance from academic advisors',
                icon: <Users className="w-5 h-5" />,
                gradient: 'from-pink-500 to-rose-500'
              }
            ].map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
                
                <div className="relative flex flex-col h-full">
                  <div className={`mb-4 inline-block p-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 flex-grow">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Popular Searches</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Computer Science",
                "Business Administration",
                "Engineering",
                "Medicine",
                "Law",
                "Architecture",
                "Data Science",
                "Psychology"
              ].map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 rounded-xl bg-white text-gray-700 text-sm font-medium hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow group"
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                    {tag}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 pt-6">
            <button
              onClick={() => setShowGetStartedModal(false)}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-3 font-medium shadow-lg shadow-indigo-500/20"
            >
              <span>Start Your Journey</span>
              <div className="p-1 bg-white/20 rounded-lg">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HeroSection;
