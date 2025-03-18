
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className={cn('p-6', bgColor)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h4 className={cn('text-2xl font-bold mt-1', textColor)}>{value}</h4>
            {trend && (
              <p className={cn('flex items-center text-sm mt-1', 
                trend.isPositive ? 'text-green-600' : 'text-red-600')}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                <span className="text-gray-500 ml-1.5">from last month</span>
              </p>
            )}
          </div>
          <div className="p-2 bg-opacity-10 rounded-full bg-gray-100">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
