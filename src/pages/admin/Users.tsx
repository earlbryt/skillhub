
import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Mail, Edit, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock users data
const mockUsers = [
  { id: "1", name: "John Doe", email: "john.doe@example.com", role: "admin", status: "active", joinDate: "2023-12-15", workshops: 3 },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com", role: "user", status: "active", joinDate: "2024-01-10", workshops: 2 },
  { id: "3", name: "Michael Johnson", email: "michael.j@example.com", role: "user", status: "active", joinDate: "2024-01-20", workshops: 1 },
  { id: "4", name: "Emily Wilson", email: "emily.w@example.com", role: "user", status: "inactive", joinDate: "2024-01-25", workshops: 0 },
  { id: "5", name: "David Brown", email: "david.b@example.com", role: "user", status: "active", joinDate: "2024-02-05", workshops: 2 },
  { id: "6", name: "Sarah Lee", email: "sarah.l@example.com", role: "user", status: "active", joinDate: "2024-02-10", workshops: 1 },
  { id: "7", name: "Robert Taylor", email: "robert.t@example.com", role: "user", status: "pending", joinDate: "2024-02-15", workshops: 0 },
  { id: "8", name: "Lisa Anderson", email: "lisa.a@example.com", role: "user", status: "active", joinDate: "2024-02-20", workshops: 1 },
];

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button className="gap-2">
          <UserPlus size={16} /> Add User
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Workshops</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      user.status === 'active' ? 'default' : 
                      user.status === 'pending' ? 'secondary' : 'outline'
                    }>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{user.workshops}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;
