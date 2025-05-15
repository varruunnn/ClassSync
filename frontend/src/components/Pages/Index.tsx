import Applayout from "../layout/Applayout";
import { currentStudent, subjects, recentTests, performanceStats, performanceHistory, activityFeed } from "@/data/mockData";
import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import RecentTests from "@/components/dashboard/RecentTests";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import SubjectCards from "@/components/dashboard/SubjectCards";


const Index = () => {
  return (
    <Applayout student={currentStudent}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {currentStudent.name}!</h2>
            <SubjectCards subjects={subjects} />
          </div>
          <div className="md:w-1/3">
            <PerformanceOverview stats={performanceStats} />
          </div>
        </div>

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
    </Applayout>
  );
};

export default Index;
