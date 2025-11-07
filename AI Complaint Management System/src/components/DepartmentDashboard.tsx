import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './sideUI/ImageWithFallback';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Calendar,
  User,
  Brain,
  MessageSquare,
  Filter,
  Search,
  Eye
} from 'lucide-react';
import { Input } from './ui/input';

export function DepartmentDashboard({ complaints, departments, onUpdateStatus, currentDepartment = 'Electricity Department' }) {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateNote, setUpdateNote] = useState('');

  // Filter complaints for current department
  const departmentComplaints = complaints.filter(complaint => 
    complaint.department === currentDepartment
  );

  // Apply filters
  const filteredComplaints = departmentComplaints.filter(complaint => {
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const departmentStats = departments.find(d => d.name === currentDepartment) || {
    complaints: 0, resolved: 0, pending: 0
  };

  const handleStatusUpdate = (complaintId, newStatus) => {
    onUpdateStatus(complaintId, newStatus);
    setUpdateNote('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">{currentDepartment}</h2>
            <p className="text-muted-foreground">Manage and resolve complaints</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-semibold">{departmentStats.complaints}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold">{departmentStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-semibold">
                  {departmentComplaints.filter(c => c.status === 'in-progress').length}
                </p>
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
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-semibold">{departmentStats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>Department Complaints</CardTitle>
          <CardDescription>
            {filteredComplaints.length} complaints found
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No complaints found matching your criteria
              </p>
            ) : (
              filteredComplaints.map(complaint => (
                <div key={complaint.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{complaint.title}</h4>
                        <Badge className={getPriorityColor(complaint.priority)} variant="outline">
                          {complaint.priority} priority
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {complaint.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {complaint.userName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {complaint.submittedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(complaint.status)}>
                        {getStatusIcon(complaint.status)}
                        <span className="ml-1 capitalize">{complaint.status.replace('-', ' ')}</span>
                      </Badge>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{complaint.title}</DialogTitle>
                            <DialogDescription>
                              Complaint ID: {complaint.id} • Submitted on {complaint.submittedAt.toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Status and Priority */}
                            <div className="flex items-center gap-4">
                              <Badge className={getStatusColor(complaint.status)} variant="outline">
                                {getStatusIcon(complaint.status)}
                                <span className="ml-1 capitalize">{complaint.status.replace('-', ' ')}</span>
                              </Badge>
                              <Badge className={getPriorityColor(complaint.priority)} variant="outline">
                                {complaint.priority} priority
                              </Badge>
                            </div>

                            {/* User Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Citizen Information</h4>
                                <p className="text-sm text-muted-foreground">
                                  <User className="h-3 w-3 inline mr-1" />
                                  {complaint.userName}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Location</h4>
                                <p className="text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  {complaint.location}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">{complaint.description}</p>
                            </div>

                            {/* AI Analysis */}
                            {complaint.aiAnalysis && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Brain className="h-4 w-4 text-blue-600" />
                                  AI Analysis
                                </h4>
                                <p className="text-sm text-blue-800 mb-2">{complaint.aiAnalysis}</p>
                                <p className="text-xs text-blue-600">
                                  Confidence: {Math.round(complaint.aiConfidence * 100)}%
                                </p>
                              </div>
                            )}

                            {/* Photo */}
                            {complaint.photo && (
                              <div>
                                <h4 className="font-medium mb-2">Submitted Photo</h4>
                                <div className="w-full h-64 rounded border overflow-hidden">
                                  <ImageWithFallback 
                                    src={complaint.photo}
                                    alt={complaint.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Status Update */}
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-3">Update Status</h4>
                              <div className="space-y-3">
                                <Select 
                                  value={complaint.status} 
                                  onValueChange={(value) => handleStatusUpdate(complaint.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                        Pending
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="in-progress">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        In Progress
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="resolved">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Resolved
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>

                                <Textarea
                                  placeholder="Add update notes (optional)"
                                  value={updateNote}
                                  onChange={(e) => setUpdateNote(e.target.value)}
                                  className="min-h-20"
                                />
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    {complaint.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Start Working
                      </Button>
                    )}
                    {complaint.status === 'in-progress' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}