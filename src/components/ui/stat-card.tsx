import React from 'react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  gradient?: string;
  className?: string;
}

const StatCard = ({ value, label, icon, gradient, className }: StatCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 min-w-[120px] hover:shadow-md transition-all duration-300",
      className
    )}>
      {icon && (
        <div className="mb-2">{icon}</div>
      )}
      <div className={cn(
        "text-2xl font-bold text-gray-900", 
        gradient ? `bg-gradient-to-r ${gradient} text-transparent bg-clip-text` : ""
      )}>
        {value}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};

export default StatCard;
