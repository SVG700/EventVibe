'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const eventFormSchema = z.object({
  eventName: z.string().min(3, 'Event name must be at least 3 characters.'),
  eventType: z.string().min(1, 'Please select an event type.'),
  eventDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Please enter a valid date.",
  }),
  eventLocation: z.string().min(3, 'Location must be at least 3 characters.'),
  eventDescription: z.string().min(10, 'Description must be at least 10 characters.'),
});

export default function CreateEventPage() {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: '',
      eventType: '',
      eventDate: '',
      eventLocation: '',
      eventDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    if (!firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Database connection not available.' });
        return;
    }
    setIsLoading(true);

    try {
        const eventsCollection = collection(firestore, 'events');
        await addDoc(eventsCollection, {
            name: values.eventName,
            category: values.eventType,
            startTime: new Date(values.eventDate).toISOString(),
            endTime: new Date(values.eventDate).toISOString(), // Assuming same start/end for simplicity
            location: values.eventLocation,
            description: values.eventDescription,
            createdAt: serverTimestamp(),
        });
        
        toast({
            title: 'Event Created!',
            description: `${values.eventName} is now live for participants to see.`,
        });
        
        router.push('/organizer/dashboard');

    } catch (error) {
        console.error('Error creating event:', error);
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem creating your event. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
            <PlusCircle className='h-6 w-6' />
            Create a New Event
        </CardTitle>
        <CardDescription>Fill out the details below to create and publish your event.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVENT NAME</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Tech Summit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVENT TYPE</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the category of your event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tech Competition">Tech Competition</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Cultural Event">Cultural Event</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVENT DATE</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="eventLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVENT LOCATION</FormLabel>
                  <FormControl>
                     <Input placeholder="e.g., Grand Convention Center" {...field} />
                  </FormControl>
                   <FormDescription>
                    You can also provide a full address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVENT DESCRIPTION</FormLabel>
                  <FormControl>
                    <Textarea
                        placeholder="Tell participants about your event..."
                        className="min-h-[150px]"
                        {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} size='lg'>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Event
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
