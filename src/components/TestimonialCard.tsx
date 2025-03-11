
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
  workshopName?: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialProps }) => {
  const { name, role, image, rating, text, workshopName } = testimonial;
  
  return (
    <div className="designer-card bg-white/80 backdrop-blur-sm p-6 shadow-xl border border-white/30 h-full flex flex-col hover:shadow-2xl transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-accent/5 to-primary/5 rounded-full blur-3xl" />
      
      {/* Rating stars */}
      <div className="flex mb-4 relative z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating 
              ? "text-secondary fill-secondary drop-shadow-sm animate-pulse" 
              : "text-muted-foreground"
            }
          />
        ))}
      </div>
      
      {/* Testimonial text */}
      <blockquote className="flex-grow mb-6 relative">
        <div className="absolute -top-4 -left-2 text-6xl text-primary/10 font-serif transform -rotate-12">"</div>
        <p className="text-foreground/80 italic relative z-10 leading-relaxed">{text}</p>
        <div className="absolute -bottom-4 -right-2 text-6xl text-primary/10 font-serif transform rotate-12">"</div>
        {workshopName && (
          <p className="text-primary text-sm mt-4 font-medium bg-primary/5 inline-block px-3 py-1 rounded-full">{workshopName}</p>
        )}
      </blockquote>
      
      {/* User info */}
      <div className="flex items-center mt-auto pt-4 border-t border-border/30 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/80 shadow-xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover relative z-10"
          />
        </div>
        <div className="ml-3">
          <h4 className="font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{name}</h4>
          <p className="text-sm text-foreground/60">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
