
import React from 'react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  gradient?: string;
  className?: string;
}

const StatCard = ({ value, label, icon, gradient = "from-primary via-accent to-secondary", className }: StatCardProps) => {
  return (
    <div className={cn(
      "backdrop-blur-sm bg-white/80 rounded-2xl p-4 shadow-lg border border-white/30 flex-1 min-w-[120px] hover:shadow-xl transition-all duration-300 transform hover:scale-105",
      className
    )}>
      {icon && (
        <div className="mb-2">{icon}</div>
      )}
      <div className={cn(
        "text-2xl font-bold", 
        gradient ? `bg-gradient-to-r ${gradient} text-transparent bg-clip-text` : "text-gradient-primary"
      )}>
        {value}
      </div>
      <div className="text-sm text-foreground/70">{label}</div>
    </div>
  );
};

export default StatCard;
