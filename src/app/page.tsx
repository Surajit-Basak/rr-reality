import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, Building, User, Mail, Home as HomeIcon } from "lucide-react";

export default function HomePage() {
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const agentImage = PlaceHolderImages.find(p => p.id === 'agent-1');

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[80vh] bg-cover bg-center" style={{ backgroundImage: `url(${heroImage?.imageUrl})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find Your Dream Home
          </h1>
          <p className="max-w-2xl mt-4 text-lg md:text-xl text-neutral-200">
            We help you find the best properties in the most desirable locations.
          </p>
          <div className="mt-8 w-full max-w-4xl p-4 bg-background/20 backdrop-blur-sm rounded-lg">
            <form className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white" htmlFor="location-hero">Location</label>
                <Input id="location-hero" placeholder="Enter a city or zip code" className="bg-white/90 text-foreground" />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white" htmlFor="type-hero">Property Type</label>
                <Select>
                  <SelectTrigger id="type-hero" className="bg-white/90 text-foreground">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white" htmlFor="status-hero">Status</label>
                <Select>
                  <SelectTrigger id="status-hero" className="bg-white/90 text-foreground">
                    <SelectValue placeholder="For Sale or Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" asChild>
                <Link href="/properties">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Link>
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary">Featured Properties</h2>
            <p className="mt-2 text-muted-foreground">
              Browse our curated list of top properties in the market right now.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/properties">
                View All Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-primary">
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold text-primary">Your Partner in Real Estate</h2>
              <p className="text-muted-foreground leading-relaxed">
                At R&R Realty, we believe that finding the perfect home should be an exciting and seamless experience. Our dedicated team of experts is committed to understanding your unique needs and guiding you every step of the way. With our deep market knowledge and unwavering commitment to client satisfaction, we turn your real estate dreams into reality.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-primary">
                    <HomeIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Expert Agents</h3>
                    <p className="text-sm text-muted-foreground">Knowledgeable and professional agents at your service.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-primary">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Wide Range of Properties</h3>
                    <p className="text-sm text-muted-foreground">From luxury villas to cozy apartments.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden order-first md:order-last">
              {agentImage && (
                <Image src={agentImage.imageUrl} alt="Friendly real estate agent" width={600} height={700} className="w-full h-auto object-cover" data-ai-hint={agentImage.imageHint} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-primary">Let's Get Started</h2>
              <p className="mt-2 text-muted-foreground">
                Ready to take the next step in your real estate journey? Contact us today for a personalized consultation. Our team is eager to assist you with all your buying, selling, or renting needs.
              </p>
            </div>
            <div className="mt-12 max-w-lg mx-auto">
              <form className="space-y-4 bg-background p-8 rounded-lg shadow-lg">
                <Input placeholder="Full Name" />
                <Input type="email" placeholder="Email Address" />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
                <p className="text-xs text-center text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
        </div>
      </section>
    </div>
  );
}