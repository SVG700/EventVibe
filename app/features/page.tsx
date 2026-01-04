import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PartyPopper, Users, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function FeaturesPage() {
  const features = [
    {
      id: 'feature-interest-matching',
      title: 'AI-Powered Interest Matching',
      description:
        'Our sophisticated AI algorithm analyzes your interests, past activities, and social connections to recommend events and venues you’re guaranteed to enjoy. Say goodbye to endless searching and hello to curated experiences.',
      icon: <PartyPopper className="mb-4 h-12 w-12 text-primary" />,
      imageHint: 'connections network',
    },
    {
      id: 'feature-conflict-resolution',
      title: 'Intelligent Conflict Resolution',
      description:
        'Coordinating with friends has never been easier. Event Vibe cross-references everyone’s calendars to find the perfect time for your get-together, automatically resolving scheduling conflicts and suggesting the best slots.',
      icon: <Users className="mb-4 h-12 w-12 text-primary" />,
      imageHint: 'calendar schedule',
    },
    {
      id: 'feature-location-optimization',
      title: 'Smart Location Optimization',
      description:
        'Finding a convenient meeting spot is a breeze. Our system optimizes for travel time and transportation options, suggesting venues that are centrally located and easy for all group members to get to. From cozy cafes to bustling event halls, we find the perfect spot.',
      icon: <MapPin className="mb-4 h-12 w-12 text-primary" />,
      imageHint: 'map location',
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
              Our Features
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Discover how Event Vibe revolutionizes social planning with
              its powerful and intuitive features.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-20">
            {features.map((feature, index) => {
              const image = PlaceHolderImages.find((img) => img.id === feature.id);
              return (
                <div
                  key={feature.id}
                  className={`grid grid-cols-1 items-center gap-12 md:grid-cols-2 ${
                    index % 2 === 1 ? 'md:grid-flow-row-dense' : ''
                  }`}
                >
                  <div
                    className={`space-y-4 ${
                      index % 2 === 1 ? 'md:col-start-2' : ''
                    }`}
                  >
                    {feature.icon}
                    <h2 className="text-3xl font-bold font-headline">{feature.title}</h2>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={feature.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={feature.imageHint}
                        className="transform transition-transform duration-500 hover:scale-110"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
