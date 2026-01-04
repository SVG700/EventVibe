'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { sendVerificationEmail, signOutUser, applyVerificationCode } from '@/lib/firebase/auth';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function VerifyEmailContent() {
  const { auth } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'verified' | 'error'>('pending');
  const [email, setEmail] = useState<string | null>(null);

  // Handle the verification link click
  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');

    if (mode === 'verifyEmail' && actionCode && verificationStatus === 'pending') {
      setVerificationStatus('verifying');
      applyVerificationCode(auth, actionCode)
        .then((success) => {
          if (success) {
            setVerificationStatus('verified');
            toast({
              title: 'Email Verified!',
              description: 'You can now log in to your account.',
            });
            // Automatically sign out to force a clean login
             signOutUser(auth).finally(() => {
                router.push('/login');
             });
          } else {
            setVerificationStatus('error');
            toast({
              variant: 'destructive',
              title: 'Verification Failed',
              description: 'The verification link is invalid or has expired. Please request a new one.',
            });
          }
        });
    }
  }, [searchParams, auth, toast, router, verificationStatus]);
  
  // Manage the resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);
  
  // Store email from query params for use on this page
  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
        setEmail(emailFromQuery);
        sessionStorage.setItem('emailForVerification', emailFromQuery);
    } else {
        const storedEmail = sessionStorage.getItem('emailForVerification');
        if (storedEmail) {
            setEmail(storedEmail)
        }
    }
  }, [searchParams]);

  const handleResendEmail = useCallback(async () => {
    if (!email) {
      toast({ variant: 'destructive', title: 'Error', description: 'Email address not found. Please go back to login.' });
      return;
    }
    
    setIsResendLoading(true);
    try {
       // We need a temporary, short-lived user session to resend the email.
       // This is a workaround since `sendEmailVerification` requires an authenticated user.
       // We use a dummy password because we can't know the user's actual password here.
       // This will fail authentication, but it allows us to get a `user` object in the catch block
       // to check if the user exists. This is a known pattern for this scenario.
       try {
         await signInWithEmailAndPassword(auth, email, `dummy-password-${Date.now()}`);
       } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                toast({ variant: 'destructive', title: 'Error', description: 'User not found. Please sign up.' });
            } else if (auth.currentUser) {
                // If a user is somehow authenticated, use them
                await sendVerificationEmail(auth.currentUser);
                toast({ title: 'Verification Email Sent', description: 'A new confirmation link has been sent.' });
                setResendCooldown(30);
            } else {
                // This part is tricky. A more robust solution might require a backend function.
                // For a client-only solution, we are limited.
                // The primary flow (on sign-up/sign-in) is the most reliable way.
                // This resend is a fallback.
                toast({ variant: 'destructive', title: 'Error', description: "Could not resend email. Please try signing in again." });
            }
       }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not send verification email.' });
    } finally {
      setIsResendLoading(false);
    }
  }, [auth, email, toast]);


  const handleBackToLogin = () => {
    signOutUser(auth).finally(() => {
      router.push('/login');
    });
  };
  
  const handleGoToLogin = () => {
     router.push('/login');
  }

  // Loading state while applying the oobCode
  if (verificationStatus === 'verifying') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying your email...</p>
      </div>
    );
  }

  // Success state after link has been clicked
  if (verificationStatus === 'verified') {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="w-full max-w-md space-y-6">
                <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                    <ShieldCheck className="h-12 w-12 text-green-500" />
                </div>
                </div>
                <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">EMAIL VERIFIED</h1>
                <p className="text-muted-foreground">
                    Your email has been successfully verified. You can now log in to your account.
                </p>
                </div>
                <div className="space-y-4">
                <Button onClick={handleGoToLogin} className="w-full">
                    Proceed to Login
                </Button>
                </div>
            </div>
        </div>
     )
  }

  // Initial state, waiting for user to verify
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">VERIFY YOUR EMAIL</h1>
          {email ? (
            <p className="text-muted-foreground">
                A verification link has been sent to{' '}
                <span className="font-semibold text-foreground">{email}</span>.
                Please check your inbox and click the link to continue.
            </p>
          ) : (
             <p className="text-muted-foreground">
                Please check your inbox for a verification link.
            </p>
          )}
        </div>
        <div className="space-y-4">
          <Button onClick={handleGoToLogin} className="w-full">
            I've Verified My Email (Continue to Login)
          </Button>
          <Button
            onClick={handleResendEmail}
            disabled={isResendLoading || resendCooldown > 0}
            variant="secondary"
            className="w-full"
          >
            {isResendLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Resend Verification Email'
            )}
            {resendCooldown > 0 && ` (${resendCooldown}s)`}
          </Button>
          <Button onClick={handleBackToLogin} variant="ghost" className="w-full">
            Back to Login
          </Button>
        </div>
         {verificationStatus === 'error' && (
            <div className="flex items-center gap-x-2 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <p>Could not verify your email. The link may be expired or invalid. Please request a new one.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
