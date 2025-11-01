import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Search, Star, Handshake, Network, Award, Heart, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const aboutImage = PlaceHolderImages.find(p => p.id === 'agent-team');
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  const testimonials = [
    {
      name: "The Williams Family",
      location: "Maple Creek, NY",
      avatar: "agent-1",
      text: "Working with R&R Realty was a dream. They were so attentive to our needs and found us the perfect family home. The process was smooth and stress-free. We couldn't be happier!",
      rating: 5,
    },
    {
      name: "Michael B., Investor",
      location: "Central City, SF",
      avatar: "agent-2",
      text: "As a real estate investor, I need an agent who is sharp, knowledgeable, and efficient. R&R Realty exceeded all my expectations. They're my go-to for all my property needs.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      location: "Greenleaf, Chicago",
      avatar: "agent-3",
      text: "I was a first-time homebuyer and completely lost. The team at R&R Realty guided me through every step, explaining everything clearly. I found a wonderful condo thanks to them!",
      rating: 5,
    }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[70vh] md:h-[80vh]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
        <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter !font-headline">
            Helping You Buy &amp; Sell Single Family Homes <span className="text-accent">With Confidence</span>
          </h1>
          <p className="max-w-2xl mt-4 text-lg md:text-xl text-neutral-200">
            You have found the perfect partner to help you with buying or selling your next property. We make the process seamless.
          </p>
          <div className="mt-8 w-full max-w-4xl p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl">
            <form className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700" htmlFor="status-hero">Action</label>
                <Select>
                  <SelectTrigger id="status-hero" className="bg-white text-foreground">
                    <SelectValue placeholder="Buy, Sell or Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">Buy</SelectItem>
                    <SelectItem value="For Rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700" htmlFor="bedrooms-hero">Bedrooms</label>
                <Select>
                  <SelectTrigger id="bedrooms-hero" className="bg-white text-foreground">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700" htmlFor="bathrooms-hero">Bathrooms</label>
                <Select>
                  <SelectTrigger id="bathrooms-hero" className="bg-white text-foreground">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/properties">
                  <Search className="mr-2 h-4 w-4" />
                  Find Properties
                </Link>
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-primary">Featured Properties</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">
            Discover our handpicked selection of the finest single-family homes available in prime locations.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/properties">
                View All Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-primary">Why Choose R&amp;R Realty</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            We provide exceptional service and expert advice, making your real estate journey smooth and successful.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 text-accent">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-primary">Trusted Experts</h3>
              <p className="mt-2 text-muted-foreground">Count on our team to provide you with expert guidance and a seamless process from start to finish.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 text-accent">
                <Handshake className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-primary">Seamless Process</h3>
              <p className="mt-2 text-muted-foreground">We handle the details so you can enjoy a hassle-free experience buying or selling your home.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 text-accent">
                <Network className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-primary">Local Knowledge</h3>
              <p className="mt-2 text-muted-foreground">Our deep understanding of the market ensures you get the best advice and opportunities.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 text-accent">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-primary">Top Value Deals</h3>
              <p className="mt-2 text-muted-foreground">We are committed to securing the best value for our clients, whether buying or selling.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-primary">What Our Clients Say</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            We hear from families just like yours about their great home buying and selling experiences.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="p-6 border rounded-lg bg-muted/30">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <div className="flex items-center mt-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={PlaceHolderImages.find(p => p.id === testimonial.avatar)?.imageUrl} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden">
              {aboutImage && (
                <Image src={aboutImage.imageUrl} alt="About R&amp;R Realty Team" width={600} height={400} className="w-full h-auto object-cover" data-ai-hint={aboutImage.imageHint}/>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary">About R&amp;R Realty</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Founded in 2008, R&amp;R Realty has been the go-to real estate service for residents of the greater metropolitan area. We pride ourselves on our family-like environment as we work to find a home that is the perfect fit for you and your loved ones.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We work hard to make your experience as seamless and enjoyable as possible. This means you will get to sit back and relax while our expert guidance finds a home for your family.
              </p>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="text-4xl font-bold text-primary">500+</p>
                  <p className="text-muted-foreground">Homes Sold</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">15+</p>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to Find Your Dream Home?</h2>
          <p className="mt-2 max-w-3xl mx-auto text-primary-foreground/80">
            With hundreds of new properties listed each week, and one of the most important life decisions, let us make your real estate dreams a reality.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/properties">Start Searching</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10">
              <Link href="/contact">Request a free consultation</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-primary">Get in Touch</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-lg mx-auto">
            Ready to start your real estate journey? Contact us today for a free consultation.
          </p>
          <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <form className="space-y-4">
              <Input placeholder="Full Name" />
              <Input type="email" placeholder="Email Address" />
              <Input placeholder="Phone Number" />
              <Textarea placeholder="Tell us about your needs..." className="min-h-[120px]" />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
            <div className="rounded-lg overflow-hidden h-full min-h-[300px]">
              {mapImage && (
                <Image src={mapImage.imageUrl} alt="Map" fill className="object-cover" data-ai-hint={mapImage.imageHint} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
