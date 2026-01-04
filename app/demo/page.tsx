import { DemoForm } from '@/components/demo-form';

export default function DemoPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
              Interactive Demo
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Experience the power of our platform firsthand. Enter your
              preferences below and let our AI find the perfect activity for your group.
            </p>
          </div>
          <div className="mt-12">
            <DemoForm />
          </div>
        </div>
      </section>
    </div>
  );
}
