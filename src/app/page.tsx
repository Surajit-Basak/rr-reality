import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HomePage() {
  const featuredProperties = properties.filter(p => p.featured);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  
  const testimonials = [
    {
      name: "Samantha R.",
      avatarId: "agent-1",
      text: "R&R Realty helped us find our dream home in just a few weeks. The team was professional, knowledgeable, and incredibly supportive throughout the entire process. We couldn't be happier!"
    },
    {
      name: "Michael B.",
      avatarId: "agent-2",
      text: "Selling our property with R&R Realty was a breeze. They handled everything with such expertise, and we got a great price. Their marketing strategy was top-notch. Highly recommended!"
    },
    {
      name: "Emily and Tom W.",
      avatarId: "agent-3",
      text: "As first-time homebuyers, we were nervous, but the agents at R&R Realty guided us every step of the way. Their patience and expertise made the experience enjoyable and stress-free."
    },
    {
      name: "David L.",
      avatarId: "agent-2",
      text: "I've worked with many real estate agencies over the years, and R&R Realty stands out. Their market insights and negotiation skills are unparalleled. I'll definitely be back for my next investment."
    }
  ];

  const blogPosts = [
    {
      id: "blog-1",
      title: "5 Tips for First-Time Homebuyers",
      date: "May 28, 2024",
      author: "Jane Doe",
      imageId: "property-5-ext",
      imageHint: "house key"
    },
    {
      id: "blog-2",
      title: "How to Stage Your Home for a Quick Sale",
      date: "May 22, 2024",
      author: "John Smith",
      imageId: "property-2-int-1",
      imageHint: "staged living room"
    },
    {
      id: "blog-3",
      title: "Understanding the Current Housing Market Trends",
      date: "May 15, 2024",
      author: "Emily White",
      imageId: "property-7-ext",
      imageHint: "house chart"
    }
  ];

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
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary">Featured Properties</h2>
              <p className="mt-2 text-muted-foreground">
                Browse our curated list of top properties in the market right now.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/properties">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProperties.map((property) => (
                <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <PropertyCard property={property} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden lg:flex" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden lg:flex" />
          </Carousel>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-primary">What Our Clients Say</h2>
              <p className="mt-2 text-muted-foreground">
                Read testimonials from our happy customers.
              </p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full mt-12"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => {
                    const avatar = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
                    return (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-4">
                            <Card className="h-full">
                            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                                <Avatar className="w-20 h-20 mb-4 border-4 border-primary">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={testimonial.name} />}
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                                <h3 className="font-bold text-lg text-primary">{testimonial.name}</h3>
                            </CardContent>
                            </Card>
                        </div>
                        </CarouselItem>
                    );
                })}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden lg:flex" />
              <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden lg:flex" />
            </Carousel>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary">From Our Blog</h2>
              <p className="mt-2 text-muted-foreground">
                Tips and insights on the real estate market.
              </p>
            </div>
             <Button asChild variant="outline">
              <Link href="/blog">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {blogPosts.map((post) => {
                  const image = PlaceHolderImages.find(p => p.id === post.imageId);
                  return (
                    <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                        <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 group border-none shadow-lg rounded-lg">
                        <Link href="#" className="block">
                            <div className="relative">
                            {image && (
                                <Image
                                src={image.imageUrl}
                                alt={post.title}
                                width={600}
                                height={400}
                                className="object-cover w-full h-56 group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={post.imageHint}
                                />
                            )}
                            </div>
                            <CardContent className="p-4 bg-background">
                                <p className="text-sm text-muted-foreground">{post.date} by {post.author}</p>
                                <h3 className="font-semibold text-lg leading-snug tracking-tight text-primary truncate my-1">
                                    {post.title}
                                </h3>
                                <span className="text-sm text-primary font-semibold hover:underline">Read More <ChevronRight className="inline h-4 w-4" /></span>
                            </CardContent>
                        </Link>
                        </Card>
                    </div>
                    </CarouselItem>
                  )
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden lg:flex" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden lg:flex" />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
