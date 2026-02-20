import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ImageWithFallback } from './sideUI/ImageWithFallback';
import { 
  FileText, 
  Upload, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain,
  Camera,
  Send
} from 'lucide-react';

const categories = [
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'water', label: 'Water Supply', icon: '💧' },
  { value: 'road', label: 'Road Maintenance', icon: '🛣️' },
  { value: 'waste', label: 'Waste Management', icon: '🗑️' },
  { value: 'other', label: 'Other', icon: '📝' }
];

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  photo: File | null;
  photoPreview: string | ArrayBuffer | null;
}

interface Complaint {
  id: string;
  title: string;
  location: string;
  status: string;
  submittedAt: Date;
  department: string;
  priority: string;
  category: string;
  description: string;
  photo?: string;
  photoPreview?: string | ArrayBuffer | null;
  aiAnalysis?: string;
  aiConfidence?: number;
}

interface UserComplaintInterfaceProps {
  onSubmitComplaint: (complaint: Complaint) => void;
  userComplaints: Complaint[];
}

export function UserComplaintInterface({ onSubmitComplaint, userComplaints }: UserComplaintInterfaceProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium',
    photo: null,
    photoPreview: null
  });

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo, use a stock photo if no photo uploaded
    const photoUrl = typeof formData.photoPreview === 'string' 
      ? formData.photoPreview 
      : `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400`;

    const complaint: Complaint = {
      ...formData,
      photo: photoUrl,
      priority: formData.priority || 'medium',
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date(),
      department: 'Pending Assignment'
    };

    onSubmitComplaint(complaint);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      priority: 'medium',
      photo: null,
      photoPreview: null
    });
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your complaint has been submitted successfully! AI is processing your request and will assign it to the appropriate department.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit New Complaint
            </CardTitle>
            <CardDescription>
              Our AI will automatically categorize and route your complaint to the right department
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Street address or landmark"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value: string) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                    <SelectItem value="medium">Medium - Moderate impact</SelectItem>
                    <SelectItem value="high">High - Urgent attention needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the problem..."
                  className="min-h-24"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Upload Photo (Optional)</Label>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      aria-label="Upload photo"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo')?.click()}
                      className="w-full justify-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      {formData.photo ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </div>
                  
                  {formData.photoPreview && typeof formData.photoPreview === 'string' && (
                    <div className="relative w-full h-48 rounded-md overflow-hidden border">
                      <img 
                        src={formData.photoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 animate-pulse" />
                    AI Processing Complaint...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Complaint
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>My Complaints</CardTitle>
            <CardDescription>Track the status of your submitted complaints</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {userComplaints.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No complaints submitted yet
                </p>
              ) : (
                userComplaints.map((complaint: Complaint) => (
                  <div key={complaint.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground">{complaint.location}</p>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>
                        {getStatusIcon(complaint.status)}
                        <span className="ml-1 capitalize">{complaint.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {complaint.submittedAt.toLocaleDateString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {complaint.department}
                      </Badge>
                    </div>

                    {complaint.aiAnalysis && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="flex items-start gap-2">
                          <Brain className="h-3 w-3 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-blue-800">{complaint.aiAnalysis}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              AI Confidence: {complaint.aiConfidence ? Math.round(complaint.aiConfidence * 100) : 0}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {complaint.photo && (
                      <div className="w-full h-32 rounded overflow-hidden border">
                        <ImageWithFallback 
                          src={complaint.photo}
                          alt={complaint.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}