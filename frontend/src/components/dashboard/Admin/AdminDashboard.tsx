import AdminDashboard from "@/components/layout/Admin/AdminDashboard";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, BookOpen, TrendingUp, AlertTriangle, Settings, Server, DollarSign, Activity, Shield, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";


const AdminDashboardPage = () => {
  const adminStats = {
    totalStudents: 1250,
    totalTeachers: 85,
    totalClasses: 45,
    attendanceRate: 92,
    systemUptime: 99.8,
    storage: 12,
    activeUsers: 1180
  };

  const systemAlerts = [
    { id: 1, type: "critical", message: "Database backup failed", time: "15 minutes ago", priority: "high" },
    { id: 2, type: "warning", message: "Server maintenance scheduled for tonight", time: "2 hours ago", priority: "medium" },
    { id: 3, type: "info", message: "New teacher registration pending approval", time: "4 hours ago", priority: "low" },
    { id: 4, type: "success", message: "System update completed successfully", time: "6 hours ago", priority: "low" }
  ];

  const recentActivities = [
    { id: 1, action: "New student enrolled", user: "John Doe", time: "10 minutes ago", type: "user" },
    { id: 2, action: "Teacher profile updated", user: "Prof. Smith", time: "1 hour ago", type: "update" },
    { id: 3, action: "Class schedule modified", user: "Admin", time: "2 hours ago", type: "system" },
    { id: 4, action: "Payment processed", user: "Jane Smith", time: "3 hours ago", type: "payment" }
  ];

  const departmentStats = [
    { name: "Mathematics", students: 320, teachers: 12, performance: 85, budget: 4, status: "healthy" },
    { name: "Science", students: 280, teachers: 15, performance: 78, budget: 5, status: "needs-attention" },
    { name: "English", students: 350, teachers: 10, performance: 92, budget: 3, status: "excellent" },
    { name: "History", students: 180, teachers: 8, performance: 88, budget: 2, status: "healthy" }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'healthy': return 'text-blue-600 bg-blue-100';
      case 'needs-attention': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminDashboard student={currentStudent} title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">System Overview 🛡️</h1>
              <p className="text-purple-100">Monitor and manage your educational institution</p>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{adminStats.systemUptime}%</div>
                <div className="text-sm text-purple-100">Uptime</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{adminStats.activeUsers}</div>
                <div className="text-sm text-purple-100">Active Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{adminStats.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% this year
                  </p>
                </div>
                <Users className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Teachers</p>
                  <p className="text-3xl font-bold text-green-600">{adminStats.totalTeachers}</p>
                  <p className="text-xs text-green-600">98% retention rate</p>
                </div>
                <UserCheck className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage (Monthly)</p>
                  <p className="text-3xl font-bold text-purple-600">{adminStats.storage.toLocaleString()}GB</p>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </div>
                <Database className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-3xl font-bold text-orange-600">{adminStats.systemUptime}%</p>
                  <p className="text-xs text-green-600">All systems operational</p>
                </div>
                <Server className="h-12 w-12 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Alerts - Enhanced */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getAlertColor(alert.type)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <Badge variant={alert.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities - Enhanced */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'payment' ? 'bg-green-100' :
                      activity.type === 'system' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                      {activity.type === 'system' && <Settings className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'update' && <Shield className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add New User
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Department
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance - Enhanced */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <Badge className={getStatusColor(dept.status)}>
                      {dept.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{dept.students}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{dept.teachers}</div>
                      <div className="text-xs text-muted-foreground">Teachers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{dept.budget.toLocaleString()}GB</div>
                      <div className="text-xs text-muted-foreground">Storage</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Performance Score</span>
                      <span className="font-medium">{dept.performance}%</span>
                    </div>
                    <Progress value={dept.performance} className="h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboard>
  );
};

export default AdminDashboardPage;