import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AcademicNotices = () => {
  const { schoolId: ctxSchoolId } = useAuth();
  const [notices, setNotices] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [seenNotices, setSeenNotices] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("noticesSeen") === "true";
    if (!hasSeen && notices.length > 0) {
      setSeenNotices(false);
      setTimeout(() => {
        localStorage.setItem("noticesSeen", "true");
        setSeenNotices(true);
      }, 1000);
    } else {
      setSeenNotices(true);
    }
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/notices/${ctxSchoolId}?audience=students`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const studentNotices = data.notices.filter((n: any) =>
          ["all", "students"].includes(n.targetAudience)
        );
        studentNotices.sort(
          (a: any, b: any) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
        setNotices(studentNotices);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load notices:", err);
        setLoading(false);
      });
  }, [ctxSchoolId]);

  const getNoticeIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNoticeStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-200 bg-red-50";
      case "medium":
        return "border-l-4 border-yellow-200 bg-yellow-50";
      default:
        return "border-l-4 border-blue-200 bg-blue-50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Academic Notices
            <Badge variant="outline">Loading...</Badge>
          </h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">
              Loading notices...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Academic Notices
          {!seenNotices && notices.length > 0 && (
            <Badge variant="destructive">{notices.length}</Badge>
          )}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-4 rounded-md ${getNoticeStyles(
                      notice.priority || "low"
                    )}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getNoticeIcon(notice.priority)}
                        <h3 className="font-medium text-lg">{notice.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(notice.publishDate)}
                      </div>
                    </div>

                    {notice.content && (
                      <p className="text-sm text-gray-700 mb-3">
                        {notice.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Target: {notice.targetAudience}</span>
                        {notice.category && (
                          <span>Category: {notice.category}</span>
                        )}
                      </div>
                      {notice.priority && (
                        <Badge
                          variant={
                            notice.priority === "high"
                              ? "destructive"
                              : notice.priority === "medium"
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {notice.priority} priority
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No notices available
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check back later for new announcements
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {notices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Notice Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-md bg-blue-50">
                  <p className="text-2xl font-bold text-blue-600">
                    {notices.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Notices</p>
                </div>
                <div className="text-center p-3 rounded-md bg-green-50">
                  <p className="text-2xl font-bold text-green-600">
                    {
                      notices.filter((n) => {
                        const publishDate = new Date(n.publishDate);
                        const today = new Date();
                        return (
                          publishDate.toDateString() === today.toDateString()
                        );
                      }).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
                <div className="text-center p-3 rounded-md bg-orange-50">
                  <p className="text-2xl font-bold text-orange-600">
                    {notices.filter((n) => n.type === "warning").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AcademicNotices;
