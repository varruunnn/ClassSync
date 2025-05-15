import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SubjectType } from "@/types";

interface PerformanceChartProps {
  performanceData: {
    month: string;
    math: number;
    science: number;
    english: number;
    history: number;
    art: number;
  }[];
}

export default function PerformanceChart({ performanceData }: PerformanceChartProps) {
  const subjectColors = {
    math: "#3b82f6", 
    science: "#10b981", 
    english: "#8b5cf6", 
    history: "#f59e0b", 
    art: "#ec4899"
  };

  // Extract subject names for tabs
  const subjects = Object.keys(performanceData[0]).filter(key => key !== 'month') as SubjectType[];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>View your academic progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Subjects</TabsTrigger>
            {subjects.map((subject) => (
              <TabsTrigger key={subject} value={subject} className="capitalize">
                {subject}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                {subjects.map((subject) => (
                  <Line
                    key={subject}
                    type="monotone"
                    dataKey={subject}
                    name={subject.charAt(0).toUpperCase() + subject.slice(1)}
                    stroke={subjectColors[subject]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          {subjects.map((subject) => (
            <TabsContent key={subject} value={subject} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={subject}
                    name={subject.charAt(0).toUpperCase() + subject.slice(1)}
                    stroke={subjectColors[subject]}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
