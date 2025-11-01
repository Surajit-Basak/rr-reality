import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Search } from "lucide-react";

export default function Home() {
  const featuredProperties = properties.filter(p => p.featured).slice(0, 6);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter !font-headline">
            Find Your Dream Home
          </h1>
          <p className="max-w-2xl mt-4 text-lg md:text-xl text-neutral-200">
            Discover a place you'll love to live. We have a wide range of properties for you to choose from.
          </p>
          <div className="mt-8 w-full max-w-4xl p-4 bg-background/20 backdrop-blur-md rounded-lg">
            <form className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium" htmlFor="location">Location</label>
                <Input id="location" placeholder="e.g., 'New York', 'Downtown'" className="bg-white/90 text-foreground" />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium" htmlFor="type">Property Type</label>
                <Select>
                  <SelectTrigger id="type" className="bg-white/90 text-foreground">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium" htmlFor="status">Status</label>
                <Select>
                  <SelectTrigger id="status" className="bg-white/90 text-foreground">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/properties">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-primary">Featured Properties</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">
            Explore our handpicked selection of premier properties.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
              <Link href="/properties">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-bg-secondary text-secondary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold">Let's Find Your Next Property</h2>
          <p className="mt-2 max-w-2xl mx-auto">
            Our advanced search tools make it easy to find the perfect property. Start your journey with us today.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/properties">
                Start Searching
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
