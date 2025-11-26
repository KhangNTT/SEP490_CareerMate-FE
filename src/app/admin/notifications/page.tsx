'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Send, Loader2, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'MEDIUM',
    targetRole: 'ALL',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setLastError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        setIsLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        priority: formData.priority,
        targetRole: formData.targetRole === 'ALL' ? null : formData.targetRole,
      };

      console.log('🔔 Sending broadcast notification:', {
        url: `${apiUrl}/api/notifications/broadcast`,
        payload,
        hasToken: !!token
      });

      const response = await fetch(`${apiUrl}/api/notifications/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to send broadcast notification';
        
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('❌ Error response:', error);
          errorMessage = error.message || error.error || errorMessage;
        } else {
          const errorText = await response.text();
          console.error('❌ Error text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        
        if (response.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (response.status === 403) {
          errorMessage = 'Access denied. Admin privileges required.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Broadcast sent successfully:', result);
      
      toast.success('Broadcast notification sent successfully!');
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        priority: 'MEDIUM',
        targetRole: 'ALL',
      });

    } catch (error: any) {
      console.error('❌ Failed to send broadcast:', error);
      const errorMsg = error.message || 'Failed to send broadcast notification. Check console for details.';
      setLastError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="w-8 h-8" />
          Broadcast Notifications
        </h1>
        <p className="text-gray-600 mt-2">
          Send notifications to all users or specific roles
        </p>
      </div>

      {/* Error Alert */}
      {lastError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error sending notification</h3>
              <p className="text-sm text-red-700 mt-1">{lastError}</p>
              <p className="text-xs text-red-600 mt-2">
                Check browser console (F12) for detailed error information.
              </p>
            </div>
            <button 
              onClick={() => setLastError(null)}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Create Broadcast Notification</CardTitle>
          <CardDescription>
            This notification will be sent to all selected users in real-time via SSE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Role */}
            <div className="space-y-2">
              <Label htmlFor="targetRole">
                Target Audience <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.targetRole}
                onValueChange={(value) => setFormData({ ...formData, targetRole: value })}
              >
                <SelectTrigger id="targetRole">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Users</SelectItem>
                  <SelectItem value="ADMIN">Admins Only</SelectItem>
                  <SelectItem value="RECRUITER">Recruiters Only</SelectItem>
                  <SelectItem value="CANDIDATE">Candidates Only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Choose who will receive this notification
              </p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High - Critical/Urgent</SelectItem>
                  <SelectItem value="MEDIUM">Medium - Important</SelectItem>
                  <SelectItem value="LOW">Low - Informational</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                High priority notifications appear prominently
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Notification Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., System Maintenance Scheduled"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Enter the notification message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                maxLength={500}
                required
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                {formData.message.length}/500 characters
              </p>
            </div>

            {/* Preview */}
            {(formData.title || formData.message) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{formData.title || 'Notification Title'}</p>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                        {formData.message || 'Notification message will appear here...'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          formData.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          formData.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {formData.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          To: {formData.targetRole === 'ALL' ? 'All Users' : formData.targetRole}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Broadcast Notification
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  title: '',
                  message: '',
                  priority: 'MEDIUM',
                  targetRole: 'ALL',
                })}
                disabled={isLoading}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Real-time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Notifications are delivered instantly via Server-Sent Events (SSE)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Role Targeting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Send to specific user roles or broadcast to everyone
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Priority Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Set urgency level to help users prioritize notifications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
