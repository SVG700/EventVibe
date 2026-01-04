'use client';

import { useFirebase, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, AlertCircle, PlusCircle } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrganizerDashboardPage() {
  const { firestore, user } = useFirebase();

  // Fetch user profile to get their name
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const eventsRef = collection(firestore, 'events');
    return query(eventsRef, orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: events, isLoading: isLoadingEvents, error } = useCollection(eventsQuery);

  const isLoading = isProfileLoading || isLoadingEvents;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome, {isProfileLoading ? <Skeleton className='h-8 w-48 inline-block' /> : userProfile?.name || 'Organizer'}!
        </h1>
        <p className="text-muted-foreground">Manage your created events and view their performance.</p>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/organizer/create-event">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>A list of events you have created.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Loading your events...</p>
            </div>
          )}

          {error && (
             <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="mt-4 font-semibold text-destructive">Could not load events</p>
                <p className="mt-2 text-sm text-muted-foreground">There was an error fetching your events. Please try again later.</p>
            </div>
          )}

          {!isLoading && !error && events?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Calendar className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">No Events Created Yet</h3>
              <p className="mb-6 mt-2 text-center text-sm text-muted-foreground">
                You haven't created any events. Let's get started!
              </p>
              <Button asChild>
                <Link href="/organizer/create-event">Create Your First Event</Link>
              </Button>
            </div>
          )}

          {!isLoading && !error && events && events.length > 0 && (
             <div className="space-y-4">
                {events.map((event) => (
                    <Card key={event.id} className="shadow-sm">
                        <CardHeader className='flex-row items-center justify-between'>
                            <div>
                                <CardTitle>{event.name}</CardTitle>
                                <CardDescription className='flex items-center gap-2 pt-1'>
                                    <Calendar className='h-4 w-4'/>
                                    {format(new Date(event.startTime), 'PPP p')}
                                </CardDescription>
                            </div>
                            <div>
                                <Button variant="outline" size="sm">Manage</Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
