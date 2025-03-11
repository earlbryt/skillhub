
import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingBadgeProps {
  icon: LucideIcon;
  text: string;
  position: string;
  rotate?: string;
  className?: string;
}

const FloatingBadge = ({
  icon: Icon,
  text,
  position,
  rotate = "",
  className
}: FloatingBadgeProps) => {
  return (
    <div className={cn(
      `absolute ${position} bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl border border-white/30 
       flex items-center space-x-2 animate-float ${rotate} z-10`,
      className
    )}>
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text">
        {text}
      </span>
    </div>
  );
};

export default FloatingBadge;
