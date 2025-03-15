import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowRight, Award, Zap, Star, Timer, ThumbsUp, TrendingUp, Shield } from 'lucide-react';
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
  skillLevel?: string;
  outcome?: string;
  duration?: string;
  rating?: number;
  popularity?: string;
}

const WorkshopCard = ({ workshop, className, style }: { workshop: WorkshopProps, className?: string, style?: React.CSSProperties }) => {
  const { 
    id, 
    title, 
    category, 
    date, 
    time, 
    capacity, 
    enrolled, 
    image, 
    isFeatured, 
    skillLevel = "Beginner", 
    outcome = "Practical skills", 
    duration = "3 hours",
    rating = 4.7,
    popularity = "High demand"
  } = workshop;
  
  // Calculate capacity percentage
  const capacityPercentage = Math.round((enrolled / capacity) * 100);
  const isAlmostFull = capacityPercentage >= 80;
  
  // Generate rating stars
  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={14} className="fill-amber-500 text-amber-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="relative">
          <Star size={14} className="text-gray-300" />
          <Star size={14} className="absolute top-0 left-0 fill-amber-500 text-amber-500 overflow-hidden w-[7px]" />
        </span>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  // Get popularity badge color
  const getPopularityColor = () => {
    if (popularity === "High demand") return "text-emerald-600";
    if (popularity === "Limited seats") return "text-amber-600";
    if (popularity === "Filling fast") return "text-blue-600";
    return "text-gray-600";
  };
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-white/95 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg border border-border/40",
        isFeatured && "md:col-span-2 md:flex",
        className
      )}
      style={style}
    >
      <div className={cn("relative overflow-hidden", isFeatured ? "md:w-1/2" : "h-56", "group")}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <Timer size={16} className="mr-1 text-primary" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="mb-4 bg-white/80 p-3 rounded-md border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="flex mr-1">
                {renderRatingStars()}
              </div>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className={`flex items-center text-xs font-medium ${getPopularityColor()}`}>
              <TrendingUp size={14} className="mr-1" />
              {popularity}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-foreground/80">
              <ThumbsUp size={14} className="text-primary mr-2 flex-shrink-0" />
              <p className="text-sm">
                <span className="font-medium">{Math.round(rating * 20)}%</span> of students recommend this workshop
              </p>
            </div>
            
            <div className="flex items-center text-sm text-foreground/80">
              <Shield size={14} className="text-emerald-500 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Includes certificate of completion
              </p>
            </div>
          </div>
          
          {isAlmostFull && (
            <div className="mt-2 text-xs font-medium text-amber-600 flex items-center border-t border-border/50 pt-2">
              <Users size={14} className="mr-1" />
              Only {capacity - enrolled} spots left!
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button asChild variant="outline" className="gap-1">
            <Link to={`/workshops/${id}`}>
              View Details <ArrowRight size={16} />
            </Link>
          </Button>
          
          <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            <Link to={`/workshops/${id}`}>
              Enroll Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
