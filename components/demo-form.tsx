'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  PartyPopper,
  MapPin,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Users,
  Globe,
  Heart,
  User,
  Building,
  Utensils,
  Music,
  PlusCircle,
} from 'lucide-react';
import {
  interactiveEventRecommendation,
  type InteractiveEventRecommendationOutput,
} from '@/ai/flows/interactive-event-recommendation';
import { RegistrationButton } from './registration-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RadioGroup } from './ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';


const interestOptions = [
    { id: 'live music', label: 'Live Music', icon: Music },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'art', label: 'Art & Culture', icon: Building },
    { id: 'tech', label: 'Tech', icon: Heart },
    { id: 'sports', label: 'Sports', icon: Globe },
    { id: 'outdoors', label: 'Outdoors', icon: PartyPopper },
]

const groupSizeOptions = [
    { id: 'solo', label: 'Solo', range: '1', icon: User },
    { id: 'small', label: 'Small', range: '2-5', icon: Users },
    { id: 'medium', label: 'Medium', range: '6-10', icon: Users },
    { id: 'large', label: 'Large', range: '10+', icon: Users },
];

const formSchema = z.object({
  interests: z.array(z.string()).min(1, 'Please select or add at least one interest.'),
  location: z.string().min(1, 'Please enter a location.'),
  groupSize: z.string().min(1, 'Please select a group size.'),
  date: z.string().min(1, 'Please enter a date.'),
});

export function DemoForm() {
  const [recommendations, setRecommendations] =
    useState<InteractiveEventRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customInterest, setCustomInterest] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: ['live music', 'food'],
      location: 'San Francisco, CA',
      groupSize: 'small',
      date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
    },
  });

  const handleInterestToggle = (interest: string) => {
    const currentInterests = form.getValues('interests');
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    form.setValue('interests', newInterests, { shouldValidate: true });
  };
  
  const handleAddCustomInterest = () => {
    if (customInterest.trim()) {
      const currentInterests = form.getValues('interests');
      if (!currentInterests.includes(customInterest.trim())) {
        form.setValue('interests', [...currentInterests, customInterest.trim()], { shouldValidate: true });
      }
      setCustomInterest('');
    }
  };

  const handleCustomInterestKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomInterest();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIsSuccess(false);
    setRecommendations(null);
    setError(null);
    try {
      const result = await interactiveEventRecommendation({
        interests: values.interests.join(', '),
        location: values.location,
        date: values.date,
      });

      setTimeout(() => {
        setIsSuccess(true);
        setRecommendations(result);
        setIsLoading(false);
      }, 1200);
    } catch (e) {
      setError('Sorry, something went wrong. Please try again.');
      console.error(e);
      setIsLoading(false);
    }
  }


  return (
    <div className="w-full max-w-4xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col space-y-8">
                {/* Interests Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">INTERESTS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                            <FormItem>
                               <FormControl>
                                 <div>
                                  <ToggleGroup
                                      type="multiple"
                                      variant="outline"
                                      value={field.value}
                                      onValueChange={(value) => form.setValue('interests', value, { shouldValidate: true })}
                                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                  >
                                      {interestOptions.map((item) => (
                                          <ToggleGroupItem key={item.id} value={item.id} className="h-12 text-base" onClick={() => handleInterestToggle(item.id)}>
                                              <item.icon className="h-4 w-4 mr-2" />
                                              {item.label}
                                          </ToggleGroupItem>
                                      ))}
                                  </ToggleGroup>
                                  <div className="mt-4 flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Add a custom interest..."
                                        value={customInterest}
                                        onChange={(e) => setCustomInterest(e.target.value)}
                                        onKeyDown={handleCustomInterestKeyDown}
                                        className="h-12 text-base"
                                    />
                                    <Button type="button" variant="secondary" onClick={handleAddCustomInterest} className="h-12">
                                        <PlusCircle className="h-4 w-4 mr-2" /> Add
                                    </Button>
                                  </div>
                                  {field.value.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {field.value.map((interest) => (
                                        <Badge key={interest} variant="secondary" className="text-base py-1 px-3">
                                          {interest}
                                          <button type="button" onClick={() => handleInterestToggle(interest)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                          </button>
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                               </FormControl>
                               <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                </Card>

                {/* Location Section */}
                <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">LOCATION</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="e.g., San Francisco, CA" {...field} className='h-12 text-base' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                </Card>

                {/* Date Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">DATE</CardTitle>
                    </CardHeader>
                    <CardContent>
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Input placeholder="MM/DD/YYYY" {...field} className='h-12 text-base' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>

                {/* Group Size Section */}
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">GROUP SIZE</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Controller
                            control={form.control}
                            name="groupSize"
                            render={({ field }) => (
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                >
                                {groupSizeOptions.map((option) => (
                                <FormItem key={option.id}>
                                    <FormControl>
                                        <Card
                                            className={cn("cursor-pointer transition-all hover:shadow-md",
                                                field.value === option.id && "ring-2 ring-primary shadow-lg"
                                            )}
                                            onClick={() => field.onChange(option.id)}
                                        >
                                            <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                                                <option.icon className={cn("h-8 w-8", field.value === option.id ? "text-primary" : "text-muted-foreground")} />
                                                <div className="font-semibold">{option.label}</div>
                                                <div className="text-sm text-muted-foreground">{option.range}</div>
                                            </CardContent>
                                        </Card>
                                    </FormControl>
                                </FormItem>
                                 ))}
                                </RadioGroup>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>


            <Button
                type="submit"
                className="w-full transition-all duration-300"
                size="lg"
                disabled={isLoading}
            >
                {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Common Ground...
                </>
                ) : (
                'Get Recommendation'
                )}
            </Button>
            </form>
        </Form>

      {error && (
        <div className="mt-8 text-center text-destructive">{error}</div>
      )}

      {isSuccess && recommendations && (
        <div className="mt-12 animate-in fade-in-50 duration-700">
          <Card className="shadow-lg rounded-lg border-none overflow-hidden">
            <CardHeader className="items-center text-center bg-white dark:bg-gray-900 p-6">
              <div className="relative">
                <div className="p-3 rounded-full bg-accent/10">
                  <CheckCircle className="h-10 w-10 text-accent animate-in zoom-in-50 duration-500" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-ping duration-1000" />
                <Sparkles className="absolute -bottom-1 -left-1 h-5 w-5 text-accent animate-ping delay-200" />
              </div>

              <CardTitle className="text-2xl font-headline mt-4">
                Recommendation Generated!
              </CardTitle>
              <CardDescription>
                We found the best common ground for your group.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 bg-muted/30">
              {recommendations.eventRecommendations.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.eventRecommendations.map((event) => (
                    <Card key={event.id} className="border-none shadow-md overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                              <PartyPopper className="h-6 w-6 text-primary" />
                              Suggested Activity
                            </h3>
                            <p className="text-xl font-bold text-primary mt-2">
                              {event.name}
                            </p>
                            <p className="text-md text-muted-foreground mt-2">
                              {event.description}
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                              <MapPin className="h-6 w-6 text-primary" />
                              Optimized Location
                            </h3>
                            <p className="text-xl font-bold text-primary mt-2">
                              {event.venue}
                            </p>
                             <p className="text-md text-muted-foreground mt-2 flex-grow">
                                This location is chosen to be a fair central
                                meeting point for everyone in the group.
                            </p>
                             <Button variant="outline" asChild className="mt-4">
                                <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`} target="_blank" rel="noopener noreferrer">
                                  View on Map
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                      </div>
                       <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-border">
                        <RegistrationButton
                          event={{
                            id: event.id,
                            name: event.name,
                            location: event.venue,
                            date: new Date().toISOString(),
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No recommendations found for these criteria.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
