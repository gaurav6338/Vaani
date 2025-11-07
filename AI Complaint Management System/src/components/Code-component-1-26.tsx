import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  FileText,
  Building2,
  Users,
  Brain,
  Download,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AdminDashboard({ complaints, departments }) {
  const [dateFilter, setDateFilter] = useState('30');

  // Calculate statistics
  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Calculate average resolution time (mock data)
    const avgResolutionTime = 2.5; // days

    // Category breakdown
    const categoryStats = complaints.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {});

    // Department performance
    const departmentPerformance = departments.map(dept => {
      const deptComplaints = complaints.filter(c => c.department === dept.name);
      const resolved = deptComplaints.filter(c => c.status === 'resolved').length;
      const rate = deptComplaints.length > 0 ? Math.round((resolved / deptComplaints.length) * 100) : 0;
      return {
        ...dept,
        resolutionRate: rate,
        totalComplaints: deptComplaints.length
      };
    });

    // Weekly trend data (mock)
    const weeklyData = [
      { week: 'Week 1', complaints: 12, resolved: 8 },
      { week: 'Week 2', complaints: 19, resolved: 15 },
      { week: 'Week 3', complaints: 15, resolved: 12 },
      { week: 'Week 4', complaints: 22, resolved: 18 }
    ];

    // Priority distribution
    const priorityStats = complaints.reduce((acc, complaint) => {
      acc[complaint.priority] = (acc[complaint.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      resolved,
      pending,
      inProgress,
      resolutionRate,
      avgResolutionTime,
      categoryStats,
      departmentPerformance,
      weeklyData,
      priorityStats
    };
  }, [complaints, departments]);

  // Prepare chart data
  const categoryChartData = Object.entries(stats.categoryStats).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    // @ts-ignore
    percentage: Math.round((count / stats.total) * 100)
  }));

  const priorityChartData = Object.entries(stats.priorityStats).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count
  }));

  const generateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: `Last ${dateFilter} days`,
      summary: {
        totalComplaints: stats.total,
        resolvedComplaints: stats.resolved,
        pendingComplaints: stats.pending,
        resolutionRate: stats.resolutionRate,
        avgResolutionTime: stats.avgResolutionTime
      },
      departmentPerformance: stats.departmentPerformance,
      categoryBreakdown: stats.categoryStats,
      aiInsights: [
        'Peak complaint hours: 9 AM - 11 AM and 2 PM - 4 PM',
        'Most common issues: Road maintenance (35%), Electricity (28%)',
        'Average citizen satisfaction: 4.2/5',
        'Seasonal pattern: Water complaints increase by 40% during summer'
      ]
    };

    // Create and download JSON report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
            <p className="text-muted-foreground">System overview and analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={generateReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-semibold">{stats.resolutionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
                <p className="text-2xl font-semibold">{stats.avgResolutionTime} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Departments</p>
                <p className="text-2xl font-semibold">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Complaint Status Distribution</CardTitle>
                <CardDescription>Current status of all complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="font-medium">{stats.pending}</span>
                  </div>
                  <Progress value={(stats.pending / stats.total) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <span className="font-medium">{stats.inProgress}</span>
                  </div>
                  <Progress value={(stats.inProgress / stats.total) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Resolved</span>
                    </div>
                    <span className="font-medium">{stats.resolved}</span>
                  </div>
                  <Progress value={(stats.resolved / stats.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
                <CardDescription>Distribution across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trend Analysis</CardTitle>
              <CardDescription>Complaint submission and resolution trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="complaints" stroke="#8884d8" name="Submitted" />
                  <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Resolution rates and workload by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.departmentPerformance.map((dept, index) => (
                  <div key={dept.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {dept.totalComplaints} total complaints
                          </p>
                        </div>
                      </div>
                      <Badge variant={dept.resolutionRate > 80 ? 'default' : dept.resolutionRate > 60 ? 'secondary' : 'destructive'}>
                        {dept.resolutionRate}% resolved
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium text-lg">{dept.complaints || dept.totalComplaints}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Resolved</p>
                        <p className="font-medium text-lg text-green-600">{dept.resolved}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Pending</p>
                        <p className="font-medium text-lg text-orange-600">{dept.pending}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Progress value={dept.resolutionRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Complaints by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={priorityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key operational indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Citizen Satisfaction</span>
                    <span className="text-sm font-medium">4.2/5</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">First Response Time</span>
                    <span className="text-sm font-medium">2.1 hours</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">AI Accuracy</span>
                    <span className="text-sm font-medium">94.5%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">System Uptime</span>
                    <span className="text-sm font-medium">99.7%</span>
                  </div>
                  <Progress value={99.7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Performance Metrics
                </CardTitle>
                <CardDescription>Artificial intelligence system performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Categorization Accuracy</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={94.5} className="flex-1 h-2" />
                    <span className="text-sm font-medium">94.5%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI correctly categorized 94.5% of complaints
                  </p>
                </div>
                
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Priority Assessment</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={91.2} className="flex-1 h-2" />
                    <span className="text-sm font-medium">91.2%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Priority levels match department assessments
                  </p>
                </div>
                
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Department Routing</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={97.8} className="flex-1 h-2" />
                    <span className="text-sm font-medium">97.8%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complaints routed to correct department
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Automated analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                    <h4 className="font-medium text-blue-900">Pattern Detection</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Road maintenance complaints increase by 23% after rainfall. Consider proactive inspections.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
                    <h4 className="font-medium text-green-900">Performance Trend</h4>
                    <p className="text-sm text-green-800 mt-1">
                      Electricity Department has improved resolution time by 35% this month. Best practices identified.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded">
                    <h4 className="font-medium text-orange-900">Resource Allocation</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Water Department may need additional resources. Backlog growing by 12% week-over-week.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 bg-purple-50 p-3 rounded">
                    <h4 className="font-medium text-purple-900">Citizen Behavior</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      Peak complaint submission: 9-11 AM and 2-4 PM. Staff availability should match these patterns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}