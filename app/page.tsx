import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, MapPin, BarChart, Shield, GitCompareArrows } from 'lucide-react';
import Link from 'next/link';
import { DemoForm } from '@/components/demo-form';
import Image from 'next/image';

const FirebaseLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.23541 18.2267L12.0002 3.82349L18.765 18.2267L12.0002 22.1767L5.23541 18.2267Z" fill="#FFC107"/>
    <path d="M12.0002 3.82349L5.23541 18.2267L8.61779 16.435L12.0002 10.2058V3.82349Z" fill="#FFA000"/>
    <path d="M5.23594 18.2262L12.0002 12.0002L13.8829 15.7516L12.0002 22.1762L5.23594 18.2262Z" fill="#FF6F00"/>
    <path d="M18.7641 18.2267L12.0004 3.82349L15.3828 5.61516L18.7641 18.2267Z" fill="#FFCA28"/>
  </svg>
);

const GoogleMapsLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4"/>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="url(#paint0_linear_301_3)"/>
        <defs>
            <linearGradient id="paint0_linear_301_3" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EA4335"/>
                <stop offset="0.5" stopColor="#4285F4"/>
                <stop offset="1" stopColor="#34A853"/>
            </linearGradient>
        </defs>
    </svg>
);

const GoogleCloudLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43 1.72-3.64 2.75-6.09 2.75-4.5 0-8.13-3.63-8.13-8.13S7.5 3.32 12 3.32c2.45 0 4.66 1.03 6.09 2.75l-1.45 1.45C15.5 6.2 13.84 5.32 12 5.32c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.84 0 3.5-0.88 4.64-2.22l1.72 1.73z" fill="#4285F4"/>
      <path d="M12 7.27c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#34A853"/>
    </svg>
);


export default function Home() {

  const howItWorks = [
    {
      step: 1,
      title: 'Add Group Members',
      description: 'Start by creating a group and inviting the friends you want to plan with.',
    },
    {
      step: 2,
      title: 'Select Interests & Preferences',
      description: 'Everyone shares their interests, availability, and budget.',
    },
    {
      step: 3,
      title: 'Share Locations',
      description: 'Group members provide their starting locations for travel analysis.',
    },
    {
      step: 4,
      title: 'Get Optimized Recommendations',
      description: 'Our AI analyzes all data to suggest the best, most convenient activities for everyone.',
    },
  ];

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: 'Interest Matching Engine',
      description: 'Our algorithm finds activities that align with the most shared interests across the group.',
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: 'Location & Travel Optimization',
      description: 'We calculate optimal meeting points that minimize total travel time and effort for all members.',
    },
     {
      icon: <GitCompareArrows className="h-8 w-8 text-primary" />,
      title: 'Fairness-Based Decision Logic',
      description: 'Recommendations are balanced to ensure no single member is consistently inconvenienced.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Smart Event Recommendations',
      description: 'Discover new events and places based on collective group preferences and data.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Scenario Comparison',
      description: 'Easily compare different options with clear data on how each choice impacts the group.',
    },
  ];
  
  const tech = [
    {
        icon: <FirebaseLogo />,
        name: 'Firebase',
    },
    {
        icon: <GoogleMapsLogo />,
        name: 'Google Maps',
    },
    {
        icon: <GoogleCloudLogo />,
        name: 'Google Cloud',
    },
  ];

  return (
    <div className="flex flex-col bg-background">

      {/* Hero Section */}
      <section id="hero" className="w-full py-20 md:py-32 lg:py-40 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-5xl md:text-6xl font-headline">
            Find the Perfect Plan Everyone Agrees On
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-lg text-gray-600 dark:text-gray-300 md:text-xl">
            Our intelligent platform helps groups make data-driven decisions to find activities that maximize fun and minimize friction.
          </p>
          <div className="mt-8 flex flex-col gap-4 justify-center sm:flex-row">
            <Button asChild size="lg">
              <a href="#demo">Get Started</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how-it-works">How It Works</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section id="problem-solution" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">The Challenge</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Why is Group Planning So Hard?</h2>
              <p className="text-muted-foreground text-lg">
                Coordinating plans with multiple people involves a frustrating mix of conflicting interests, scheduling clashes, and endless back-and-forth messaging. It’s hard to find a fair option that makes everyone happy.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm font-medium">The Solution</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Intelligent, Data-Driven Decisions</h2>
              <p className="text-muted-foreground text-lg">
                Event Vibe removes the guesswork. By analyzing shared hobbies, locations, and travel convenience, our platform provides optimized recommendations that are both fair and enjoyable for the entire group.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              A Simple Path to the Perfect Plan
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              In just four easy steps, you can go from undecided to unforgettable.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 font-headline">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Powerful Features for Seamless Planning
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our platform is packed with tools to make group decisions effortless and fair.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-none bg-white dark:bg-gray-900">
                <CardHeader className="flex flex-col items-center text-center gap-4">
                  {feature.icon}
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="w-full py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Try It Yourself
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Enter some simple preferences to see how our recommendation engine works.
            </p>
          </div>
          <div className="mt-12">
            <DemoForm />
          </div>
        </div>
      </section>
      
      {/* Technology & Trust Section */}
      <section id="tech" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Built with Reliable, Scalable Technology
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              We leverage enterprise-grade services from Google to deliver a fast, secure, and reliable experience.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {tech.map((item) => (
                <Card key={item.name} className="bg-white dark:bg-gray-900 border-none shadow-none">
                    <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                        {item.icon}
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                    </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
