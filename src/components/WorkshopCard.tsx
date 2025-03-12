
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface WorkshopProps {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  capacity: number;
  enrolled: number;
  image: string;
  isFeatured?: boolean;
}

interface WorkshopCardProps {
  workshop: WorkshopProps;
  className?: string;
  style?: React.CSSProperties; // Add style prop to interface
}

const WorkshopCard = ({ workshop, className, style }: WorkshopCardProps) => {
  const { id, title, category, date, time, capacity, enrolled, image, isFeatured } = workshop;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Calculate capacity percentage
  const capacityPercentage = Math.round((enrolled / capacity) * 100);
  const isAlmostFull = capacityPercentage >= 80;

  // Quick register function - simplified for one-click registration
  const handleQuickRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to register for workshops",
        variant: "destructive",
      });
      navigate('/login?redirect=workshops');
      return;
    }

    // In a real app, this would make an API call to register
    // For now, just navigate directly to confirmation 
    navigate(`/register?workshop=${id}`);
  };
  
  return (
    <div 
      className={cn(
        "group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300",
        isFeatured && "md:col-span-2 md:flex",
        className
      )}
      style={style}
    >
      <div className={cn("relative overflow-hidden rounded-t-lg", 
        isFeatured ? "md:w-2/5 md:rounded-l-lg md:rounded-tr-none" : "h-48"
      )}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <Badge 
          className="absolute top-3 left-3 bg-blue-700 text-white"
        >
          {category}
        </Badge>
        
        <div className="absolute bottom-0 left-0 w-full p-3">
          <h3 className="text-lg font-semibold text-white drop-shadow-lg md:hidden">
            {title}
          </h3>
        </div>
      </div>
      
      <div className={cn("p-4 flex flex-col justify-between", isFeatured && "md:w-3/5")}>
        <div>
          <h3 className={cn("font-semibold hidden md:block", isFeatured ? "text-xl mb-2" : "text-lg mb-1")}>
            {title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-600">
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <Calendar size={14} className="mr-1 text-blue-700" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <Clock size={14} className="mr-1 text-blue-700" />
              <span>{time}</span>
            </div>
            
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <Users size={14} className="mr-1 text-blue-700" />
              <span>{enrolled} / {capacity}</span>
            </div>
          </div>
        </div>
        
        {/* Capacity bar */}
        <div className="mb-3">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                isAlmostFull ? "bg-amber-500" : "bg-blue-700"
              )}
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-600">
            <span>{isAlmostFull ? "Almost full!" : `${capacityPercentage}% full`}</span>
            <span>{capacity - enrolled} spots left</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="default" 
            className="flex-1 bg-blue-700 hover:bg-blue-800"
            onClick={handleQuickRegister}
          >
            Register Now
          </Button>
          
          <Button asChild variant="outline" size="icon" className="border-gray-300 text-gray-700">
            <Link to={`/workshops/${id}`}>
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
