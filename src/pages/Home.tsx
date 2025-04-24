
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Workshop Management</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Find and register for upcoming workshops or manage your workshop administration
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Find Workshops</CardTitle>
            <CardDescription>Browse and register for upcoming workshops</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Discover workshops covering a wide range of topics led by expert instructors.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/workshops">Browse Workshops</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Manage workshops, users, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access the administration panel to manage workshops, track attendance, and view analytics.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/admin">Admin Panel</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
