
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

const WorkshopCard = ({ workshop, className, style }: { workshop: WorkshopProps, className?: string, style?: React.CSSProperties }) => {
  const { id, title, category, date, time, capacity, enrolled, image, isFeatured } = workshop;
  
  // Calculate capacity percentage
  const capacityPercentage = Math.round((enrolled / capacity) * 100);
  const isAlmostFull = capacityPercentage >= 80;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-white/95 shadow-md hover:shadow-lg transition-all duration-300",
        isFeatured && "md:col-span-2 md:flex",
        className
      )}
      style={style}
    >
      <div className={cn("relative overflow-hidden", isFeatured ? "md:w-1/2" : "h-56")}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        
        <Badge 
          className="absolute top-4 left-4 bg-primary hover:bg-primary text-white"
        >
          {category}
        </Badge>
        {isFeatured && (
          <Badge 
            variant="outline"
            className="absolute top-4 right-4 bg-secondary/90 hover:bg-secondary text-white border-0 flex items-center gap-1"
          >
            Featured
          </Badge>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-4 md:hidden">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>
      
      <div className={cn("p-5 relative", isFeatured && "md:w-1/2 md:p-6")}>
        <h3 className={cn("font-bold hidden md:block", isFeatured ? "text-2xl mb-3" : "text-xl mb-2")}>
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-y-2 mb-4 text-sm text-foreground/70">
          <div className="flex items-center mr-4 bg-primary/5 px-2 py-1 rounded-md">
            <Calendar size={16} className="mr-1 text-primary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center mr-4 bg-primary/5 px-2 py-1 rounded-md">
            <Clock size={16} className="mr-1 text-primary" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center bg-primary/5 px-2 py-1 rounded-md">
            <Users size={16} className="mr-1 text-primary" />
            <span>{enrolled} / {capacity}</span>
          </div>
        </div>
        
        <div className="mb-4 bg-white/80 p-3 rounded-md border border-border">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                isAlmostFull ? "bg-amber-500" : "bg-primary"
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
          <Button asChild variant="default" className="gap-1">
            <Link to={`/register?workshop=${id}`}>
              Register <ArrowRight size={16} />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="sm">
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
