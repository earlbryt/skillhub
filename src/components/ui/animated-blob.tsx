
import React from 'react';
import { cn } from "@/lib/utils";

interface AnimatedBlobProps {
  color: string;
  position: string;
  delay?: string;
  size?: string;
  opacity?: string;
  className?: string;
}

const AnimatedBlob = ({ 
  color, 
  position, 
  delay = "0s", 
  size = "w-72 h-72", 
  opacity = "opacity-70",
  className 
}: AnimatedBlobProps) => {
  return (
    <div 
      className={cn(
        `absolute ${position} ${size} ${color} ${opacity} rounded-full mix-blend-multiply filter blur-xl animate-blob`,
        className
      )}
      style={{ animationDelay: delay }}
    />
  );
};

export default AnimatedBlob;
