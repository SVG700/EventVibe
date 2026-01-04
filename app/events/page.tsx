'use client';

import { useFirebase, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Calendar, MapPin, AlertCircle, Ticket, CheckCircle } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsPage() {
  const { firestore, user } = useFirebase();

  // Fetch user profile to get their name
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  // Fetch all available events
  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const eventsRef = collection(firestore, 'events');
    return query(eventsRef, orderBy('startTime', 'asc'));
  }, [firestore]);
  const { data: events, isLoading: isLoadingEvents, error: eventsError } = useCollection(eventsQuery);

  // Fetch user's registered events
  const registrationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'registrations'), orderBy('registrationTimestamp', 'desc'));
  }, [firestore, user]);
  const { data: registeredEvents, isLoading: isLoadingRegistrations, error: registrationsError } = useCollection(registrationsQuery);

  const isLoading = isProfileLoading || isLoadingEvents || isLoadingRegistrations;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome, {isProfileLoading ? <Skeleton className='h-8 w-48 inline-block' /> : userProfile?.name || 'Explorer'}!
        </h1>
        <p className="text-muted-foreground">Discover upcoming events and see what you've signed up for.</p>
      </div>

      {/* My Registrations Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Registered Events</CardTitle>
          <CardDescription>A list of events you are registered for.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRegistrations && (
             <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading your registrations...</p>
            </div>
          )}
           {registrationsError && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="mt-4 font-semibold text-destructive">Could not load registrations</p>
                <p className="mt-2 text-sm text-muted-foreground">There was an error fetching your registered events.</p>
            </div>
          )}
          {!isLoadingRegistrations && !registrationsError && registeredEvents?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center">
                <h3 className="text-xl font-semibold">No Registrations Yet</h3>
                <p className="mb-6 mt-2 text-center text-sm text-muted-foreground">
                    You haven't registered for any events. Find one below!
                </p>
            </div>
          )}
           {!isLoadingRegistrations && !registrationsError && registeredEvents && registeredEvents.length > 0 && (
             <div className="space-y-4">
                {registeredEvents.map((reg) => (
                    <Card key={reg.id} className="shadow-sm flex flex-col md:flex-row">
                       <div className="flex-grow p-6">
                         <h4 className="font-bold">{reg.eventName}</h4>
                         <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                            <Calendar className='h-4 w-4 shrink-0'/>
                            <span>{format(new Date(reg.eventDate), 'PPP p')}</span>
                        </div>
                         <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                            <MapPin className='h-4 w-4 shrink-0'/>
                            <span>{reg.eventLocation}</span>
                        </div>
                       </div>
                       <div className='p-6 border-t md:border-t-0 md:border-l bg-muted/30 flex items-center justify-center'>
                           <Button variant="secondary" disabled className="w-full md:w-auto">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Registered
                            </Button>
                       </div>
                    </Card>
                ))}
             </div>
          )}
        </CardContent>
      </Card>


      {/* Explore Events Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Explore More Events</h2>
        <p className="text-muted-foreground">Discover other upcoming events and activities.</p>
      </div>

       {isLoadingEvents && (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading events...</p>
        </div>
        )}

        {eventsError && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="mt-4 font-semibold text-destructive">Could not load events</p>
                <p className="mt-2 text-sm text-muted-foreground">There was an error fetching events. Please try again later.</p>
            </div>
        )}

        {!isLoadingEvents && !eventsError && events?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Calendar className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">No Events Found</h3>
              <p className="mb-6 mt-2 text-center text-sm text-muted-foreground">
                There are no upcoming events at the moment. Check back soon!
              </p>
            </div>
        )}

      {!isLoadingEvents && !eventsError && events && events.length > 0 && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <Card key={event.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className='text-xl'>{event.name}</CardTitle>
                        <CardDescription>{event.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex items-start gap-2 text-muted-foreground">
                            <Calendar className='h-5 w-5 mt-0.5 shrink-0'/>
                            <span>{format(new Date(event.startTime), 'PPP p')}</span>
                        </div>
                         <div className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className='h-5 w-5 mt-0.5 shrink-0'/>
                            <span>{event.location}</span>
                        </div>
                         <p className="text-sm line-clamp-3">{event.description}</p>
                    </CardContent>
                    <CardFooter>
                       {/* Future actions like 'Register' or 'View Details' can go here */}
                    </CardFooter>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
