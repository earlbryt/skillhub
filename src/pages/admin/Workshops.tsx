
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
import { Eye, Search, Plus, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const AdminWorkshops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data
  const workshops = [
    {
      id: "1",
      title: "Web Development Fundamentals",
      category: "Programming",
      date: "March 15, 2024",
      capacity: 30,
      enrolled: 25,
      status: "active"
    },
    {
      id: "2",
      title: "Digital Marketing Masterclass",
      category: "Marketing",
      date: "March 20, 2024",
      capacity: 25,
      enrolled: 15,
      status: "active"
    },
    {
      id: "3",
      title: "UI/UX Design Workshop",
      category: "Design",
      date: "March 25, 2024",
      capacity: 20,
      enrolled: 18,
      status: "active"
    },
    {
      id: "4",
      title: "Mobile App Development",
      category: "Programming",
      date: "April 5, 2024",
      capacity: 15,
      enrolled: 8,
      status: "upcoming"
    },
    {
      id: "5",
      title: "Advanced JavaScript",
      category: "Programming",
      date: "February 10, 2024",
      capacity: 20,
      enrolled: 20,
      status: "completed"
    }
  ];

  // Filter workshops based on search query
  const filteredWorkshops = workshops.filter(workshop => 
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Workshops</h2>
        <Button className="gap-2">
          <Plus size={16} /> Add Workshop
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search workshops..."
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
                <TableHead>Workshop</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkshops.map((workshop) => (
                <TableRow key={workshop.id}>
                  <TableCell className="font-medium">{workshop.title}</TableCell>
                  <TableCell>{workshop.category}</TableCell>
                  <TableCell>{workshop.date}</TableCell>
                  <TableCell>{workshop.enrolled}/{workshop.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={
                      workshop.status === 'active' ? 'default' : 
                      workshop.status === 'upcoming' ? 'secondary' : 'outline'
                    }>
                      {workshop.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/workshops/${workshop.id}/attendees`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4" />
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

export default AdminWorkshops;
