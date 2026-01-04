'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Users, LogIn, UserPlus, Building, User } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { signInWithEmail, signUpWithEmail } from '@/lib/firebase/auth';
import { useFirebase } from '@/firebase';
import { AuthError } from 'firebase/auth';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';


type AuthAction = 'signin' | 'signup';

const formSchema = z.object({
  username: z.string().optional(),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  userType: z.enum(['organizer', 'participant']).optional(),
  location: z.string().optional(),
});


export default function LoginPage() {
  const { auth, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [authAction, setAuthAction] = useState<AuthAction>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '', password: '', location: 'New York, NY' },
  });

  const handleAuthError = (error: AuthError) => {
    let title = 'Authentication Failed';
    let description = 'An unexpected error occurred. Please try again.';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        title = 'Invalid Credentials';
        description = 'The email or password you entered is incorrect.';
        break;
      case 'auth/email-already-in-use':
        title = 'Email In Use';
        description = 'An account with this email already exists. Please sign in.';
        setAuthAction('signin'); // Switch to sign-in view
        break;
      case 'auth/network-request-failed':
        title = 'Network Error';
        description = 'Could not connect to the server. Please check your internet connection.';
        break;
      default:
        console.error('Unhandled Auth Error:', error);
    }
    toast({ variant: 'destructive', title, description });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (!firestore || !auth) return;

    if (authAction === 'signin') {
        const { user, error, verified } = await signInWithEmail(auth, values.email, values.password);
        if (user) {
            if (verified) {
                // Fetch user role from Firestore
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const role = userData.role || 'participant'; // Default to participant
                    sessionStorage.setItem('userRole', role);
                    router.push('/dashboard');
                } else {
                     // Should not happen if signup is correct
                    toast({ variant: 'destructive', title: "Profile Error", description: "Could not find user profile." });
                    setIsLoading(false);
                }
            } else {
                 router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            }
        } else if (error) {
            handleAuthError(error);
            setIsLoading(false);
        }
    } else { // 'signup'
      if (!values.username || !values.userType || !values.location) {
        if (!values.username) form.setError('username', { message: 'Username is required.' });
        if (!values.userType) form.setError('userType', { type: 'manual', message: 'User type is required.' });
        if (!values.location) form.setError('location', { type: 'manual', message: 'Location is required.' });
        setIsLoading(false);
        return;
      }
      
      const { user, error } = await signUpWithEmail(auth, firestore, values.email, values.password, values.username, values.userType, values.location);
      if (user) {
        toast({
            title: 'Account Created!',
            description: 'A verification link has been sent to your email.',
        });
        sessionStorage.setItem('userRole', values.userType); // Store role for immediate use
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } else if (error) {
        handleAuthError(error);
      }
    }

    setIsLoading(false);
  };
  
  const toggleAuthAction = () => {
    form.reset();
    setAuthAction(authAction === 'signin' ? 'signup' : 'signin');
  };

  const title = authAction === 'signin' ? 'WELCOME BACK' : 'CREATE AN ACCOUNT';
  const description = authAction === 'signin' ? 'Enter your credentials to access your account.' : 'Create an account to get started.';
  const buttonText = authAction === 'signin' ? 'SIGN IN' : 'SIGN UP';
  const toggleText = authAction === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in';


  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
          <div className="flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">{siteConfig.name}</span>
          </div>
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {authAction === 'signup' && (
                <>
                 {/* User Type Selection */}
                <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">USER TYPE</FormLabel>
                        <FormControl>
                            <div className="grid grid-cols-2 gap-4">
                                <Card
                                    className={cn("cursor-pointer transition-all hover:shadow-md",
                                        field.value === 'participant' && "ring-2 ring-primary shadow-lg"
                                    )}
                                    onClick={() => field.onChange('participant')}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                                        <User className={cn("h-8 w-8", field.value === 'participant' ? "text-primary" : "text-muted-foreground")} />
                                        <div className="font-semibold">Participant</div>
                                    </CardContent>
                                </Card>
                                <Card
                                    className={cn("cursor-pointer transition-all hover:shadow-md",
                                        field.value === 'organizer' && "ring-2 ring-primary shadow-lg"
                                    )}
                                    onClick={() => field.onChange('organizer')}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                                        <Building className={cn("h-8 w-8", field.value === 'organizer' ? "text-primary" : "text-muted-foreground")} />
                                        <div className="font-semibold">Organizer</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                </>
               )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="••••••••" 
                          autoComplete="current-password"
                          autoCapitalize="off"
                          autoCorrect="off"
                          spellCheck="false"
                          className="password-input"
                          {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                {authAction === 'signup' && (
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">LOCATION</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your location" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="New York, NY">New York, NY</SelectItem>
                                <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                                <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                                <SelectItem value="Houston, TX">Houston, TX</SelectItem>
                                <SelectItem value="other">Other (please specify)</SelectItem>
                                </SelectContent>
                            </Select>
                            {field.value === 'other' && (
                                <FormControl>
                                    <Input placeholder="Enter your location manually" className="mt-2" />
                                </FormControl>
                            )}
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button variant="link" onClick={toggleAuthAction}>
              {authAction === 'signin' ? <UserPlus className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
              {toggleText}
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-primary/5 p-8">
        <div className='w-full max-w-md mx-auto'>
            <h2 className="text-3xl font-bold tracking-tight">
                Connecting People Through Meaningful Events
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
                Our intelligent platform helps you discover events and activities that perfectly match your interests and schedule.
            </p>
        </div>
      </div>
    </div>
  );
}
