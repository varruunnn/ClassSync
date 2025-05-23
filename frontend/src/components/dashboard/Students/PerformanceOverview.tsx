import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PerformanceStats } from "@/types";

interface PerformanceOverviewProps {
  stats: PerformanceStats;
}

export default function PerformanceOverview({ stats }: PerformanceOverviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Overall academic performance this semester</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Average</span>
            <span className="text-xl font-bold">{stats.overall.average}%</span>
          </div>
          <Progress value={stats.overall.average} className="h-2" />
        </div>

        <div>
          <h3 className="font-medium mb-3">Subject Performance</h3>
          <div className="space-y-4">
            {stats.subjects.map((subject) => (
              <div key={subject.subject} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="capitalize font-medium">{subject.subject}</span>
                  <div className="flex items-center gap-2">
                    <span>{subject.average}%</span>
                    {subject.trend !== 0 && (
                      <span 
                        className={`text-xs ${subject.trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {subject.trend > 0 ? '↑' : '↓'} {Math.abs(subject.trend)}%
                      </span>
                    )}
                  </div>
                </div>
                <Progress 
                  value={subject.average} 
                  className={`h-2 [&>div]:bg-${subject.subject}`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
