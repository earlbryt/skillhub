
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, Lock, Globe, Bell, Users, ShieldAlert } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gradient-primary">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/40 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-primary" size={20} />
                <h3 className="text-xl font-semibold">General Settings</h3>
              </div>
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-sm font-medium">Site Name</Label>
                    <Input 
                      id="siteName" 
                      defaultValue="Workshop Registration Portal" 
                      className="premium-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl" className="text-sm font-medium">Site URL</Label>
                    <Input 
                      id="siteUrl" 
                      defaultValue="https://workshops.example.com" 
                      className="premium-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-sm font-medium">Admin Email</Label>
                  <Input 
                    id="adminEmail" 
                    type="email" 
                    defaultValue="admin@example.com" 
                    className="premium-input"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance" className="text-sm font-medium flex items-center gap-2">
                      <ShieldAlert size={16} className="text-amber-500" />
                      Maintenance Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
                  </div>
                  <Switch id="maintenance" className="data-[state=checked]:bg-amber-500" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border border-border/40 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-primary" size={20} />
                <h3 className="text-xl font-semibold">Registration Settings</h3>
              </div>
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowRegistration" className="text-sm font-medium">Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">Enable new user registrations</p>
                  </div>
                  <Switch id="allowRegistration" defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireApproval" className="text-sm font-medium">Require Admin Approval</Label>
                    <p className="text-sm text-muted-foreground">Require admin approval for new registrations</p>
                  </div>
                  <Switch id="requireApproval" className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications for new registrations</p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="border border-border/40 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-primary" size={20} />
                <h3 className="text-xl font-semibold">Notifications</h3>
              </div>
              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="userNotifications" className="text-sm font-medium">User Registrations</Label>
                  <Switch id="userNotifications" defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="workshopNotifications" className="text-sm font-medium">Workshop Enrollments</Label>
                  <Switch id="workshopNotifications" defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="paymentNotifications" className="text-sm font-medium">Payment Confirmations</Label>
                  <Switch id="paymentNotifications" defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border border-border/40 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-primary" size={20} />
                <h3 className="text-xl font-semibold">Security</h3>
              </div>
              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactor" className="text-sm font-medium">Two-Factor Authentication</Label>
                  <Switch id="twoFactor" className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sessionTimeout" className="text-sm font-medium">Session Timeout (4 hours)</Label>
                  <Switch id="sessionTimeout" defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button className="premium-button flex items-center gap-2 py-2.5 px-6">
          <Save size={16} />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
