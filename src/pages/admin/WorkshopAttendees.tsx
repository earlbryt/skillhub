
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { Search, ArrowLeft, Mail, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock workshop data
const workshops = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    category: "Programming",
    date: "March 15, 2024",
    time: "10:00 AM - 2:00 PM",
    capacity: 30,
    enrolled: 25,
  },
  {
    id: "2",
    title: "Digital Marketing Masterclass",
    category: "Marketing",
    date: "March 20, 2024",
    time: "2:00 PM - 6:00 PM",
    capacity: 25,
    enrolled: 15,
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    category: "Design",
    date: "March 25, 2024",
    time: "1:00 PM - 5:00 PM",
    capacity: 20,
    enrolled: 18,
  },
];

// Mock attendees data
const mockAttendees = [
  { id: "1", workshopId: "1", name: "John Doe", email: "john.doe@example.com", registrationDate: "2024-02-15", status: "confirmed" },
  { id: "2", workshopId: "1", name: "Jane Smith", email: "jane.smith@example.com", registrationDate: "2024-02-16", status: "confirmed" },
  { id: "3", workshopId: "1", name: "Michael Johnson", email: "michael.j@example.com", registrationDate: "2024-02-17", status: "pending" },
  { id: "4", workshopId: "1", name: "Emily Wilson", email: "emily.w@example.com", registrationDate: "2024-02-18", status: "confirmed" },
  { id: "5", workshopId: "1", name: "David Brown", email: "david.b@example.com", registrationDate: "2024-02-19", status: "confirmed" },
  { id: "6", workshopId: "2", name: "Sarah Lee", email: "sarah.l@example.com", registrationDate: "2024-02-20", status: "confirmed" },
  { id: "7", workshopId: "2", name: "Robert Taylor", email: "robert.t@example.com", registrationDate: "2024-02-21", status: "pending" },
  { id: "8", workshopId: "3", name: "Lisa Anderson", email: "lisa.a@example.com", registrationDate: "2024-02-22", status: "confirmed" },
];

const WorkshopAttendees = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [workshop, setWorkshop] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  
  useEffect(() => {
    // Find the workshop by ID
    const foundWorkshop = workshops.find(w => w.id === id);
    setWorkshop(foundWorkshop);
    
    // Filter attendees by workshop ID
    const workshopAttendees = mockAttendees.filter(a => a.workshopId === id);
    setAttendees(workshopAttendees);
  }, [id]);
  
  // Filter attendees based on search query
  const filteredAttendees = attendees.filter(attendee => 
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!workshop) {
    return <div>Workshop not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/workshops">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{workshop.title} - Attendees</h2>
          <p className="text-muted-foreground">
            {workshop.date} | {workshop.time} | {attendees.length} / {workshop.capacity} registered
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search attendees..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Mail size={16} />
            Email All
          </Button>
        </div>
      </Card>
      
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{new Date(attendee.registrationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={attendee.status === 'confirmed' ? 'default' : 'secondary'}>
                        {attendee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No attendees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default WorkshopAttendees;
