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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full flex flex-col hover:shadow-md transition-all duration-300 relative">
      {/* Rating stars */}
      <div className="flex mb-4 relative z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "text-secondary fill-secondary drop-shadow-sm" : "text-muted-foreground"}
          />
        ))}
      </div>
      
      {/* Testimonial text */}
      <blockquote className="flex-grow mb-6 relative">
        <div className="absolute -top-4 -left-2 text-5xl text-primary/10 font-serif">"</div>
        <p className="text-foreground/80 italic relative z-10">{text}</p>
        <div className="absolute -bottom-4 -right-2 text-5xl text-primary/10 font-serif">"</div>
        {workshopName && (
          <p className="text-primary text-sm mt-4 font-medium">Workshop: {workshopName}</p>
        )}
      </blockquote>
      
      {/* User info */}
      <div className="flex items-center mt-auto pt-4 border-t border-gray-200">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-foreground/60">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
