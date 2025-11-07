import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { UserComplaintInterface } from './components/UserComplaintInterface';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthInterface } from './components/AuthInterface';
import { Brain, User, Building2, Shield } from 'lucide-react';

// Mock data
const mockComplaints = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    title: 'Street Light Not Working',
    description: 'The street light on Oak Street has been out for 3 days, making it dangerous for pedestrians at night.',
    category: 'electricity',
    aiCategory: 'electricity',
    department: 'Electricity Department',
    status: 'pending',
    priority: 'medium',
    location: 'Oak Street, Block A',
    photo: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    submittedAt: new Date('2024-01-15'),
    aiAnalysis: 'Identified as electrical infrastructure issue. Classified as medium priority based on public safety impact.',
    aiConfidence: 0.95
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    title: 'Water Leak on Main Road',
    description: 'There is a significant water leak causing flooding on the main road near the shopping center.',
    category: 'water',
    aiCategory: 'water',
    department: 'Water Department',
    status: 'in-progress',
    priority: 'high',
    location: 'Main Road, Shopping Center',
    photo: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    submittedAt: new Date('2024-01-14'),
    resolvedAt: null,
    aiAnalysis: 'Water infrastructure emergency detected. High priority due to potential property damage and traffic disruption.',
    aiConfidence: 0.98
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    title: 'Pothole on Elm Street',
    description: 'Large pothole causing damage to vehicles and creating a safety hazard.',
    category: 'road',
    aiCategory: 'road',
    department: 'Road Maintenance',
    status: 'resolved',
    priority: 'medium',
    location: 'Elm Street, Mile 2',
    photo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    submittedAt: new Date('2024-01-10'),
    resolvedAt: new Date('2024-01-12'),
    aiAnalysis: 'Road maintenance issue identified. Medium priority based on traffic volume and safety risk.',
    aiConfidence: 0.92
  }
];

const mockDepartments = [
  { id: 'electricity', name: 'Electricity Department', complaints: 15, resolved: 12, pending: 3 },
  { id: 'water', name: 'Water Department', complaints: 23, resolved: 18, pending: 5 },
  { id: 'road', name: 'Road Maintenance', complaints: 31, resolved: 26, pending: 5 },
  { id: 'waste', name: 'Waste Management', complaints: 12, resolved: 10, pending: 2 },
];

export default function App() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('citizen');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (user, type) => {
    setCurrentUser(user);
    setUserType(type);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType('citizen');
    setIsAuthenticated(false);
  };

  const addComplaint = (newComplaint) => {
    const complaint = {
      ...newComplaint,
      id: Date.now().toString(),
      userId: currentUser?.id || 'anonymous',
      userName: currentUser?.name || 'Anonymous User',
      submittedAt: new Date(),
      status: 'pending',
      // AI Processing Simulation
      aiAnalysis: `AI analyzed this ${newComplaint.category} complaint and determined it requires ${newComplaint.priority} priority attention.`,
      aiConfidence: Math.random() * 0.3 + 0.7, // 0.7-1.0 confidence
      aiCategory: newComplaint.category, // AI confirms or corrects category
      department: getDepartmentForCategory(newComplaint.category)
    };
    setComplaints(prev => [complaint, ...prev]);
  };

  const updateComplaintStatus = (complaintId, newStatus) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { 
            ...complaint, 
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date() : null
          }
        : complaint
    ));
  };

  const getDepartmentForCategory = (category) => {
    const mapping = {
      electricity: 'Electricity Department',
      water: 'Water Department',
      road: 'Road Maintenance',
      waste: 'Waste Management',
      other: 'General Services'
    };
    return mapping[category] || 'General Services';
  };

  if (!isAuthenticated) {
    return <AuthInterface onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.jpeg" alt="logo" className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">Vaani</h1>
                <p className="text-sm text-muted-foreground">आपकी आवाज़ सरकार तक</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                {userType === 'citizen' && <User className="h-3 w-3" />}
                {userType === 'department' && <Building2 className="h-3 w-3" />}
                {userType === 'admin' && <Shield className="h-3 w-3" />}
                {userType.charAt(0).toUpperCase() + userType.slice(1)} View
              </Badge>
              <span className="text-sm">{currentUser?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={userType} onValueChange={setUserType} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="citizen" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Citizen
            </TabsTrigger>
            <TabsTrigger value="department" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Department
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citizen">
            <UserComplaintInterface 
              onSubmitComplaint={addComplaint}
              userComplaints={complaints.filter(c => c.userId === currentUser?.id)}
            />
          </TabsContent>

          <TabsContent value="department">
            <DepartmentDashboard 
              complaints={complaints}
              departments={mockDepartments}
              onUpdateStatus={updateComplaintStatus}
              currentDepartment={currentUser?.department}
            />
          </TabsContent>

          <TabsContent value="admin">
            <AdminDashboard 
              complaints={complaints}
              departments={mockDepartments}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}