
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
        "rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300 border border-border",
        isFeatured && "md:col-span-2 md:flex",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", isFeatured ? "md:w-1/2" : "h-48")}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <Badge 
          className="absolute top-4 left-4 bg-accent hover:bg-accent text-white"
        >
          {category}
        </Badge>
        {isFeatured && (
          <Badge 
            className="absolute top-4 right-4 bg-secondary hover:bg-secondary text-white"
          >
            Featured
          </Badge>
        )}
      </div>
      
      <div className={cn("p-5", isFeatured && "md:w-1/2 md:p-6")}>
        <h3 className={cn("font-bold", isFeatured ? "text-2xl mb-3" : "text-xl mb-2")}>
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-y-2 mb-4 text-sm text-foreground/70">
          <div className="flex items-center mr-4">
            <Calendar size={16} className="mr-1 text-primary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center mr-4">
            <Clock size={16} className="mr-1 text-primary" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center">
            <Users size={16} className="mr-1 text-primary" />
            <span>{enrolled} / {capacity}</span>
          </div>
        </div>
        
        {/* Capacity bar */}
        <div className="mb-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                isAlmostFull ? "bg-secondary" : "bg-primary"
              )}
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{isAlmostFull ? "Almost full!" : `${capacityPercentage}% full`}</span>
            <span>{capacity - enrolled} spots left</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button asChild variant="default" className="gap-1 btn-hover">
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
