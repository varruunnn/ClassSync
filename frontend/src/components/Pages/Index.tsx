import {
  currentStudent,
  subjects,
  recentTests,
  performanceStats,
  performanceHistory,
  activityFeed,
} from "@/data/mockData";
import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import RecentTests from "@/components/dashboard/RecentTests";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import SubjectCards from "@/components/dashboard/SubjectCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, BookOpen, Clock, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className=" px-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">
            Welcome back, {currentStudent.name}!
          </h2>
          <SubjectCards subjects={subjects} />
        </div>
        <div className="md:w-1/3">
          <PerformanceOverview stats={performanceStats} />
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">View Homework</h3>
              <p className="text-sm text-muted-foreground">
                3 assignments due this week
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">Upcoming Tests</h3>
              <p className="text-sm text-muted-foreground">
                Math test on Friday
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Study Resources</h3>
              <p className="text-sm text-muted-foreground">
                15 new resources available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Present Days</span>
              <span className="text-sm font-medium">18/20 days</span>
            </div>
            <Progress value={90} className="h-2" />
            <div className="flex flex-wrap gap-2 mt-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium ${
                    i === 7 || i === 14
                      ? "bg-red-100 text-red-600 border border-red-200"
                      : "bg-green-100 text-green-600 border border-green-200"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>2 absences this month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart performanceData={performanceHistory} />
        </div>
        <div>
          <ActivityFeed activities={activityFeed} />
        </div>
      </div>

      <RecentTests tests={recentTests} />
    </div>
  );
};

export default Index;
