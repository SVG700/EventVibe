'use client';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Mail, Phone, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
      form.reset();
    }, 1000);
  }

  return (
    <div className="container mx-auto max-w-4xl py-20 md:py-32">
        <Card className="shadow-lg overflow-hidden">
         <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-muted/50">
                 <h2 className="text-2xl font-bold tracking-tight font-headline">Get in Touch</h2>
                 <p className="mt-2 text-muted-foreground">
                    Have questions, suggestions, or collaboration ideas? Reach out to us directly.
                 </p>
                 <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Madhan BV</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:madhanbv3940@gmail.com" className="hover:underline">madhanbv3940@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href="tel:+918088228909" className="hover:underline">+91 8088228909</a>
                    </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Samhith V Gupta</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:samhithvguptasrkvs@gmail.com" className="hover:underline">samhithvguptasrkvs@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href="tel:+919164906261" className="hover:underline">+91 9164906261</a>
                    </div>
                </div>
            </div>
            <div className='p-8'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Your message, query, or feedback..."
                                className="min-h-[120px]"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Send Message
                    </Button>
                    </form>
                </Form>
            </div>
         </div>
        </Card>
    </div>
  );
}