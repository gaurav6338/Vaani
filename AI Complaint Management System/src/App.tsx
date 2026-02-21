import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { UserComplaintInterface } from './components/UserComplaintInterface';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthInterface } from './components/AuthInterface';
import { User, Building2, Shield } from 'lucide-react';

type AppUser = {
  id?: string;
  email?: string;
  name?: string;
  type?: string;
  department?: string;
};

type AppComplaint = {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  aiCategory?: string;
  department?: string;
  status: string;
  priority: string;
  location?: string;
  photo?: string;
  submittedAt: Date;
  resolvedAt?: Date | null;
  aiAnalysis?: string;
  aiConfidence?: number;
};

// Mock data
const mockComplaints = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Gaurav Rai',
    title: 'Street Light Not Working',
    description: 'the street light of my colony is not working from 3 days. Please fix it asap.',
    category: 'electricity',
    aiCategory: 'electricity',
    department: 'Electricity Department',
    status: 'pending',
    priority: 'medium',
    location: 'varansi, Block A',
    photo: 'https://images.unsplash.com/photo-1603032678140-faeae4d6aee5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    submittedAt: new Date('2024-01-15'),
    aiAnalysis: 'Identified as electrical infrastructure issue. Classified as medium priority based on public safety impact.',
    aiConfidence: 0.95
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'khushi singh',
    title: 'Water Leak on Main Road',
    description: 'There is a significant water leak causing flooding on the main road near the shopping center.',
    category: 'water',
    aiCategory: 'water',
    department: 'Water Department',
    status: 'in-progress',
    priority: 'high',
    location: 'Main Road, Shopping Center',
    photo: 'https://media.istockphoto.com/id/531709707/photo/road-spurt-water-beside-traffic-cones.jpg?s=1024x1024&w=is&k=20&c=gjK_QcsOswjnnDUa5Z23Iq_8oIrzEpgsYY6-LpwkI-w=',
    submittedAt: new Date('2024-01-14'),
    resolvedAt: null,
    aiAnalysis: 'Water infrastructure emergency detected. High priority due to potential property damage and traffic disruption.',
    aiConfidence: 0.98
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'yashi yadav',
    title: 'Pothole on amroha Street',
    description: 'Large pothole causing damage to vehicles and creating a safety hazard.',
    category: 'road',
    aiCategory: 'road',
    department: 'Road Maintenance',
    status: 'resolved',
    priority: 'medium',
    location: 'amroha, Block C',
    photo: 'https://media.istockphoto.com/id/502561495/photo/pot-holed-road.jpg?s=1024x1024&w=is&k=20&c=XrGYa8BwBP8U96-00tfCcsZ55aXqRfMD4BYv84ze688=',
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
  const [complaints, setComplaints] = useState<AppComplaint[]>(mockComplaints as AppComplaint[]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [userType, setUserType] = useState<string>('citizen');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = (user: AppUser, type: string) => {
    setCurrentUser(user);
    setUserType(type);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType('citizen');
    setIsAuthenticated(false);
  };

  const addComplaint = (newComplaint: Partial<AppComplaint>) => {
    const complaint: AppComplaint = {
      ...(newComplaint as AppComplaint),
      id: Date.now().toString(),
      userId: currentUser?.id || 'anonymous',
      userName: currentUser?.name || 'Anonymous User',
      submittedAt: new Date(),
      status: 'pending',
      // AI Processing Simulation
      aiAnalysis: `AI analyzed this ${newComplaint.category} complaint and determined it requires ${newComplaint.priority} priority attention.`,
      aiConfidence: Math.random() * 0.3 + 0.7, // 0.7-1.0 confidence
      aiCategory: newComplaint.category || '', // AI confirms or corrects category
      department: getDepartmentForCategory(newComplaint.category || 'other')
    };
    setComplaints(prev => [complaint, ...prev]);
  };

  const updateComplaintStatus = (complaintId: string, newStatus: string) => {
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

  const getDepartmentForCategory = (category: string) => {
    const mapping: Record<string, string> = {
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
                userComplaints={complaints
                  .filter(c => c.userId === currentUser?.id)
                  .map(c => ({
                    id: c.id,
                    title: c.title,
                    location: c.location || '',
                    status: c.status,
                    submittedAt: c.submittedAt,
                    department: c.department || '',
                    priority: c.priority,
                    category: c.category,
                    description: c.description || '',
                    photo: c.photo,
                    aiAnalysis: c.aiAnalysis,
                    aiConfidence: c.aiConfidence
                  }))}
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