
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
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border h-full flex flex-col card-hover">
      {/* Rating stars */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "text-secondary fill-secondary" : "text-muted-foreground"}
          />
        ))}
      </div>
      
      {/* Testimonial text */}
      <blockquote className="flex-grow mb-6">
        <p className="text-foreground/80 italic">"{text}"</p>
        {workshopName && (
          <p className="text-primary text-sm mt-2">Workshop: {workshopName}</p>
        )}
      </blockquote>
      
      {/* User info */}
      <div className="flex items-center mt-auto">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3">
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-foreground/60">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
