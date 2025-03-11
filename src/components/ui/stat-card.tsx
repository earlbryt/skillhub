
import React from 'react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

const StatCard = ({ value, label, className }: StatCardProps) => {
  return (
    <div className={cn(
      "backdrop-blur-sm bg-white/80 rounded-2xl p-4 shadow-lg border border-white/30 flex-1 min-w-[120px] hover:shadow-xl transition-all duration-300 transform hover:scale-105",
      className
    )}>
      <div className="text-2xl font-bold text-gradient-primary">{value}</div>
      <div className="text-sm text-foreground/70">{label}</div>
    </div>
  );
};

export default StatCard;
