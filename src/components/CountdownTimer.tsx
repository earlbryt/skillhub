
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownProps {
  targetDate: string;
  className?: string;
}

const CountdownTimer = ({ targetDate, className }: CountdownProps) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={cn("flex space-x-3 sm:space-x-4", className)}>
      {timeUnits.map((unit) => (
        <div 
          key={unit.label} 
          className="flex flex-col items-center"
        >
          <div className="bg-primary/10 rounded-lg p-2 sm:p-3 min-w-[60px] text-center">
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {unit.value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-foreground/70">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
