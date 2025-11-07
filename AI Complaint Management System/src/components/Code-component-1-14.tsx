import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Brain, User, Building2, Shield, LogIn, UserPlus } from 'lucide-react';

const mockUsers = [
  { id: 'user1', email: 'john.doe@email.com', name: 'John Doe', type: 'citizen' },
  { id: 'dept1', email: 'electricity@city.gov', name: 'Sarah Wilson', type: 'department', department: 'Electricity Department' },
  { id: 'admin1', email: 'admin@city.gov', name: 'Admin User', type: 'admin' }
];

export function AuthInterface({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    userType: 'citizen',
    department: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simulate login - find user by email
      const user = mockUsers.find(u => u.email === formData.email);
      if (user) {
        onLogin(user, user.type);
      } else {
        alert('User not found. Try: john.doe@email.com, electricity@city.gov, or admin@city.gov');
      }
    } else {
      // Simulate registration
      const newUser = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        type: formData.userType,
        department: formData.userType === 'department' ? formData.department : undefined
      };
      onLogin(newUser, formData.userType);
    }
  };

  const handleDemoLogin = (userType) => {
    const demoUsers = {
      citizen: mockUsers[0],
      department: mockUsers[1],
      admin: mockUsers[2]
    };
    onLogin(demoUsers[userType], userType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            {/* //changes */}
            <img src="/logo.jpeg" alt="logo" className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Vaani</h1>
          <p className="text-muted-foreground">Smart governance through AI-powered solutions</p>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="userType">User Type</Label>
                    <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Citizen
                          </div>
                        </SelectItem>
                        <SelectItem value="department">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Department
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Administrator
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.userType === 'department' && (
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electricity Department">Electricity Department</SelectItem>
                          <SelectItem value="Water Department">Water Department</SelectItem>
                          <SelectItem value="Road Maintenance">Road Maintenance</SelectItem>
                          <SelectItem value="Waste Management">Waste Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              <Button type="submit" className="w-full">
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </form>

            {isLogin && (
              <div className="mt-6 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoLogin('citizen')}
                    className="flex flex-col items-center gap-1 h-16"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-xs">Citizen</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoLogin('department')}
                    className="flex flex-col items-center gap-1 h-16"
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="text-xs">Department</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDemoLogin('admin')}
                    className="flex flex-col items-center gap-1 h-16"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="text-xs">Admin</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}