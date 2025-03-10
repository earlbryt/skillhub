
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <Separator className="mb-6" />
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="Workshop Registration Portal" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input id="siteUrl" defaultValue="https://workshops.example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input id="adminEmail" type="email" defaultValue="admin@example.com" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
              </div>
              <Switch id="maintenance" />
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Registration Settings</h3>
          <Separator className="mb-6" />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowRegistration">Allow New Registrations</Label>
                <p className="text-sm text-muted-foreground">Enable new user registrations</p>
              </div>
              <Switch id="allowRegistration" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireApproval">Require Admin Approval</Label>
                <p className="text-sm text-muted-foreground">Require admin approval for new registrations</p>
              </div>
              <Switch id="requireApproval" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications for new registrations</p>
              </div>
              <Switch id="emailNotifications" defaultChecked />
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save size={16} />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
