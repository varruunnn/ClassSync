import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "info" | "purple" | "pink" | "orange" | "cyan" | "emerald";
}

const variantStyles = {
    default: "bg-white text-gray-900 hover:shadow-md",
    primary: "bg-blue-600 text-white hover:shadow-lg",
    success: "bg-green-600 text-white hover:shadow-lg",
    warning: "bg-yellow-500 text-white hover:shadow-lg",
    info: "bg-sky-500 text-white hover:shadow-lg",
    purple: "bg-purple-600 text-white hover:shadow-lg",
    pink: "bg-pink-500 text-white hover:shadow-lg",
    orange: "bg-orange-500 text-white hover:shadow-lg",
    cyan: "bg-cyan-500 text-white hover:shadow-lg",
    emerald: "bg-emerald-600 text-white hover:shadow-lg"
  };
  

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  className,
  variant = "default"
}: StatsCardProps) {
  const isColored = variant !== "default";
  
  return (
    <Card className={cn(
      "transition-all duration-300 transform hover:scale-105",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn(
              "text-sm font-medium mb-1",
              isColored ? "text-white/80" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className={cn(
                "text-2xl font-bold",
                isColored ? "text-white" : "text-foreground"
              )}>
                {value}
              </h3>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    trend.isPositive 
                      ? isColored 
                        ? "bg-white/20 text-white" 
                        : "bg-success/10 text-success"
                      : isColored 
                        ? "bg-white/20 text-white" 
                        : "bg-destructive/10 text-destructive"
                  )}
                >
                  {trend.isPositive ? "↗" : "↘"} {trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className={cn(
                "text-xs mt-1",
                isColored ? "text-white/70" : "text-muted-foreground"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "ml-4 p-3 rounded-lg",
            isColored ? "bg-white/20" : "bg-muted"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}