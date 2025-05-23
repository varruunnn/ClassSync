import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: string;
  subject?: string;
  title?: string;
  score?: number;
  date: string;
  comment?: string;
  teacher?: string;
  status?: string;
  reason?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string, subject?: string) => {
    const bgColor = subject 
      ? `bg-${subject}-light text-${subject}`
      : "bg-gray-100 text-gray-500";
    
    return (
      <div className={`p-2 rounded-full ${bgColor}`}>
        {type === "test_score" && (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
        {type === "assignment_submission" && (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        )}
        {type === "teacher_comment" && (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
        {type === "attendance" && (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )}
      </div>
    );
  };

  const renderActivityContent = (activity: ActivityItem) => {
    switch (activity.type) {
      case "test_score":
        return (
          <div>
            <p className="font-medium">
              Received {activity.score} marks in {activity.title}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {activity.subject} subject
            </p>
          </div>
        );
      case "assignment_submission":
        return (
          <div>
            <p className="font-medium">Submitted {activity.title}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {activity.subject} assignment
            </p>
          </div>
        );
      case "teacher_comment":
        return (
          <div>
            <p className="font-medium">Comment from {activity.teacher}</p>
            <p className="text-sm">{activity.comment}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {activity.subject} class
            </p>
          </div>
        );
      case "attendance":
        return (
          <div>
            <p className="font-medium capitalize">Marked {activity.status}</p>
            {activity.reason && (
              <p className="text-sm">Reason: {activity.reason}</p>
            )}
          </div>
        );
      default:
        return <p>Activity recorded</p>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest academic activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              {getActivityIcon(activity.type, activity.subject)}
              <div className="flex-1">
                {renderActivityContent(activity)}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(activity.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
