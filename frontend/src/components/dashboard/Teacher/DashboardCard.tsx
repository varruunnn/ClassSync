import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "primary" | "success" | "warning" | "info" | "purple" | "rose" | "orange" | "cyan" | "emerald";
}

const cardVariants = {
    default: "bg-white text-gray-900 hover:shadow-md",
    gradient: "bg-white text-gray-900 hover:shadow-md", // alias for default
    primary: "bg-blue-600 text-white hover:shadow-lg border-blue-600/20",
    success: "bg-green-600 text-white hover:shadow-lg border-green-600/20",
    warning: "bg-yellow-400 text-white hover:shadow-lg border-yellow-500/20",
    info: "bg-sky-500 text-white hover:shadow-lg border-sky-500/20",
    purple: "bg-purple-500 text-white hover:shadow-lg border-purple-600/20",
    rose: "bg-rose-500 text-white hover:shadow-lg border-rose-500/20",
    orange: "bg-orange-500 text-white hover:shadow-lg border-orange-500/20",
    cyan: "bg-cyan-500 text-white hover:shadow-lg border-cyan-500/20",
    emerald: "bg-emerald-600 text-white hover:shadow-lg border-emerald-600/20"
  };
  

export function DashboardCard({ 
  title, 
  icon, 
  children, 
  className,
  variant = "default" 
}: DashboardCardProps) {
  const isColored = variant !== "default" && variant !== "gradient";
  
  return (
    <Card 
      className={cn(
        "transition-all duration-300 transform hover:scale-[1.02] border",
        cardVariants[variant],
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className={cn(
          "text-lg font-semibold flex items-center space-x-2",
          isColored ? "text-white" : "text-foreground"
        )}>
          <div className={cn(
            "p-2 rounded-lg",
            isColored ? "bg-white/20" : "bg-muted"
          )}>
            {icon}
          </div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        isColored && "text-white"
      )}>
        {children}
      </CardContent>
    </Card>
  );
}