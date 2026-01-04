'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Ticket } from 'lucide-react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface EventDetails {
  id: string;
  name: string;
  location: string;
  date: string;
}

interface RegistrationButtonProps {
  event: EventDetails;
}

export function RegistrationButton({ event }: RegistrationButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check registration status when user or event changes
    const checkRegistration = async () => {
      if (!user || !firestore) {
        setIsRegistered(false);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const registrationsRef = collection(
          firestore,
          'users',
          user.uid,
          'registrations'
        );
        const q = query(registrationsRef, where('eventId', '==', event.id));
        const querySnapshot = await getDocs(q);
        setIsRegistered(!querySnapshot.empty);
      } catch (error) {
        console.error('Error checking registration status:', error);
        // Keep isRegistered as false on error
      } finally {
        setIsLoading(false);
      }
    };

    checkRegistration();
  }, [user, event.id, firestore]);

  const handleRegister = async () => {
    if (!user) {
      // Store intended event and redirect to login
      sessionStorage.setItem('postLoginRedirect', window.location.pathname);
      sessionStorage.setItem('postLoginEventId', event.id);
      router.push('/login');
      return;
    }

    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not connect to the database.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add to user-specific subcollection
      const userRegRef = collection(firestore, 'users', user.uid, 'registrations');
      await addDoc(userRegRef, {
        userId: user.uid,
        eventId: event.id,
        eventName: event.name,
        eventLocation: event.location,
        eventDate: event.date,
        registrationTimestamp: serverTimestamp(),
      });

      // Add to general registrations collection
      const registrationsRef = collection(firestore, 'registrations');
       await addDoc(registrationsRef, {
        userId: user.uid,
        eventId: event.id,
        eventName: event.name,
        eventLocation: event.location,
        eventDate: event.date,
        registrationTimestamp: serverTimestamp(),
      });


      setIsRegistered(true);
      toast({
        title: 'Registration Successful!',
        description: `You are now registered for ${event.name}.`,
      });
    } catch (error) {
      console.error('Error writing document: ', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking Status...
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <Button variant="secondary" disabled className="w-full">
        <CheckCircle className="mr-2 h-4 w-4" />
        Registered
      </Button>
    );
  }

  return (
    <Button onClick={handleRegister} className="w-full">
      <Ticket className="mr-2 h-4 w-4" />
      Get Registered
    </Button>
  );
}
