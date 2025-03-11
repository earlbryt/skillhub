
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

const WorkshopCard = ({ workshop, className }: { workshop: WorkshopProps, className?: string }) => {
  const { id, title, category, date, time, capacity, enrolled, image, isFeatured } = workshop;
  
  // Calculate capacity percentage
  const capacityPercentage = Math.round((enrolled / capacity) * 100);
  const isAlmostFull = capacityPercentage >= 80;
  
  return (
    <div 
      className={cn(
        "designer-card overflow-hidden bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-xl hover:shadow-2xl",
        isFeatured && "md:col-span-2 md:flex",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", isFeatured ? "md:w-1/2" : "h-56")}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        
        <Badge 
          className="absolute top-4 left-4 bg-accent hover:bg-accent text-white shadow-md"
        >
          {category}
        </Badge>
        {isFeatured && (
          <Badge 
            className="absolute top-4 right-4 bg-secondary hover:bg-secondary text-white shadow-md"
          >
            Featured
          </Badge>
        )}
        
        {/* Title on image for mobile view */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:hidden">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>
      
      <div className={cn("p-5", isFeatured && "md:w-1/2 md:p-6")}>
        <h3 className={cn("font-bold hidden md:block", isFeatured ? "text-2xl mb-3 gradient-heading" : "text-xl mb-2")}>
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-y-2 mb-4 text-sm text-foreground/70">
          <div className="flex items-center mr-4 bg-primary/5 px-2 py-1 rounded-full">
            <Calendar size={16} className="mr-1 text-primary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center mr-4 bg-primary/5 px-2 py-1 rounded-full">
            <Clock size={16} className="mr-1 text-primary" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center bg-primary/5 px-2 py-1 rounded-full">
            <Users size={16} className="mr-1 text-primary" />
            <span>{enrolled} / {capacity}</span>
          </div>
        </div>
        
        {/* Capacity bar */}
        <div className="mb-4 bg-muted/30 p-3 rounded-lg">
          <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                isAlmostFull ? "bg-gradient-to-r from-yellow-400 to-secondary" : "bg-gradient-to-r from-primary to-accent"
              )}
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="font-semibold">{isAlmostFull ? "Almost full!" : `${capacityPercentage}% full`}</span>
            <span className="font-semibold">{capacity - enrolled} spots left</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button asChild variant="default" className="gap-1 btn-hover bg-gradient-to-r from-primary to-accent shadow-md hover:shadow-lg">
            <Link to={`/register?workshop=${id}`}>
              Register <ArrowRight size={16} />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="sm" className="bg-white/50 hover:bg-white/80">
            <Link to={`/workshops/${id}`} className="text-primary">
              Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
