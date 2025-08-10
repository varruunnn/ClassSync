import { useEffect, useState } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  Bell,
  AlertCircle,
  Info,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notice {
  _id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  publishDate: string;
  targetAudience: string;
}

export default function TeacherCalendar() {
  const today = new Date();
  const [expandedNotices, setExpandedNotices] = useState<Set<string>>(
    new Set()
  );
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const toggleNotice = (noticeId: string) => {
    setExpandedNotices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noticeId)) {
        newSet.delete(noticeId);
      } else {
        newSet.add(noticeId);
      }
      return newSet;
    });
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/notices/1?target=teachers`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.notices as Notice[]).filter(
          (n) => n.status === "published" && n.targetAudience === "teachers"
        );
        setNotices(filtered);
      })
      .catch(console.error);
  }, []);

  const getNoticeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "important":
        return <Star className="h-4 w-4 text-orange-500" />;
      case "general":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNoticeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "urgent":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "important":
        return "bg-orange-50 border-orange-200 hover:bg-orange-100";
      case "general":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "urgent":
        return "destructive";
      case "important":
        return "default";
      case "general":
        return "secondary";
      default:
        return "outline";
    }
  };

  const noticeTypes = ["all", ...new Set(notices.map((n) => n.type))];
  const filteredNotices =
    selectedFilter === "all"
      ? notices
      : notices.filter((n) => n.type === selectedFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <TeacherDashboard student={null as any} title="Notices">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Teacher Notices
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Stay updated with important announcements and information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Notices</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notices.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      notices.filter((n) => n.type.toLowerCase() === "urgent")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Important</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      notices.filter(
                        (n) => n.type.toLowerCase() === "important"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CalendarDays className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      notices.filter((n) => {
                        const noticeDate = new Date(n.publishDate);
                        return (
                          noticeDate.getMonth() === today.getMonth() &&
                          noticeDate.getFullYear() === today.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                All Notices
              </CardTitle>
              <div className="flex items-center gap-2">
                {noticeTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedFilter === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotices.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    No notices found for the selected filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNotices.map((notice) => (
                    <div
                      key={notice._id}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${getNoticeColor(
                        notice.type
                      )}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getNoticeIcon(notice.type)}
                          <Badge
                            variant={getBadgeVariant(notice.type)}
                            className="text-xs capitalize"
                          >
                            {notice.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDate(notice.publishDate)}
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {notice.title}
                      </h4>

                      <p
                        className={`text-sm text-gray-600 mb-4 ${
                          expandedNotices.has(notice._id) ? "" : "line-clamp-3"
                        }`}
                      >
                        {notice.content}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          {new Date(notice.publishDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNotice(notice._id);
                          }}
                        >
                          {expandedNotices.has(notice._id)
                            ? "Show Less"
                            : "Read More"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherDashboard>
  );
}
