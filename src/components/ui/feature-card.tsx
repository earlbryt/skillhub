import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  className
}: FeatureCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center space-x-3 mb-2">
        <div className={`w-10 h-10 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="font-semibold text-gray-900">{title}</div>
      </div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
};

export default FeatureCard;
