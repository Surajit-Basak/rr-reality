
'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, ChevronRight, ChevronLeft, MapPin, Star, Phone, ShieldCheck, Cog, DollarSign, Home as HomeIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, serverTimestamp, orderBy } from 'firebase/firestore';
import type { Property, Testimonial, BlogPost } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { toast } = useToast();
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const aboutImage = PlaceHolderImages.find(p => p.id === 'agent-team');
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [searchState, setSearchState] = useState({ keyword: '', price: 'any', bedrooms: 'any' });

  const firestore = useFirestore();
  
  const featuredPropertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const propertiesCollection = collection(firestore, 'properties');
    return query(propertiesCollection, where("featured", "==", true));
  }, [firestore]);
  const { data: featuredProperties, isLoading: featuredLoading } = useCollection<Property>(featuredPropertiesQuery);

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "blog_posts"), orderBy('publicationDate', 'desc'), limit(4));
  }, [firestore]);
  const { data: blogPosts, isLoading: blogLoading } = useCollection<BlogPost>(blogPostsQuery);

  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "testimonials"));
  }, [firestore]);
  const { data: testimonials, isLoading: testimonialsLoading } = useCollection<Testimonial>(testimonialsQuery);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSearchChange = (name: string, value: string) => {
    setSearchState(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchState.keyword) params.append('keyword', searchState.keyword);
    if (searchState.price !== 'any') params.append('price', searchState.price);
    if (searchState.bedrooms !== 'any') params.append('bedrooms', searchState.bedrooms);
    
    router.push(`/properties?${params.toString()}`);
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firestore && formState.name && formState.email && formState.message) {
      const inquiriesCollection = collection(firestore, 'inquiries');
      addDocumentNonBlocking(inquiriesCollection, {
        ...formState,
        propertyId: "general_inquiry", // To distinguish from property-specific inquiries
        inquiryDate: serverTimestamp()
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for your message! We will contact you soon.",
      });
      setFormState({ name: '', email: '', phone: '', message: '' });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "Please fill in all required fields.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative h-screen flex items-center justify-center">
        {heroImage && <Image src={heroImage?.imageUrl} alt="Elegant modern single family home" fill className="object-cover" />}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Helping You Buy & Sell<br />
            Single Family Homes<br />
            <span className="text-secondary">with Confidence</span>
          </h1>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Your trusted partner in finding the perfect home or selling your property at the best value in today's market.
          </p>
          <div className="bg-white shadow-xl rounded-xl p-6 mb-8 text-gray-700 max-w-5xl mx-auto border border-gray-100">
            <form className="grid md:grid-cols-4 gap-4 items-end" onSubmit={handleSearchSubmit}>
              <div className="space-y-2 text-left">
                <Label className="text-sm font-semibold text-gray-700 mb-2">Location</Label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="City, ZIP code, or neighborhood" 
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-sm bg-gray-50 hover:bg-white transition-colors" 
                    value={searchState.keyword}
                    onChange={(e) => handleSearchChange('keyword', e.target.value)}
                  />
                   <i className="ri-map-pin-line text-lg text-secondary absolute left-4 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </div>
              <div className="space-y-2 text-left">
                  <Label className="text-sm font-semibold text-gray-700 mb-2">Price Range</Label>
                  <Select value={searchState.price} onValueChange={(value) => handleSearchChange('price', value)}>
                    <SelectTrigger className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-sm bg-gray-50 hover:bg-white transition-colors text-left h-auto">
                      <i className="ri-money-dollar-circle-line text-lg text-secondary absolute left-4 top-1/2 transform -translate-y-1/2"></i>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Price</SelectItem>
                      <SelectItem value="0-300000">Under $300K</SelectItem>
                      <SelectItem value="0-500000">$300K - $500K</SelectItem>
                      <SelectItem value="0-750000">$500K - $750K</SelectItem>
                      <SelectItem value="750000-99999999">$750K+</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-sm font-semibold text-gray-700 mb-2">Bedrooms</Label>
                 <Select value={searchState.bedrooms} onValueChange={(value) => handleSearchChange('bedrooms', value)}>
                    <SelectTrigger className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-sm bg-gray-50 hover:bg-white transition-colors text-left h-auto">
                       <i className="ri-hotel-bed-line text-lg text-secondary absolute left-4 top-1/2 transform -translate-y-1/2"></i>
                      <SelectValue placeholder="Any Beds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Beds</SelectItem>
                      <SelectItem value="1">1+ Bedroom</SelectItem>
                      <SelectItem value="2">2+ Bedrooms</SelectItem>
                      <SelectItem value="3">3+ Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                      <SelectItem value="5">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <Button type="submit" className="w-full bg-secondary text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all hover:shadow-lg text-sm font-semibold transform hover:scale-105 duration-200 flex items-center justify-center h-auto">
                <i className="ri-search-line text-lg mr-2"></i>
                Search Properties
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium single-family homes available in prime locations.
            </p>
          </div>
          <div className="relative px-12">
            <Carousel
              opts={{ align: "start", loop: true, slidesToScroll: 1 }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                      <div className="p-4"><div className="w-full h-96 bg-muted rounded-lg animate-pulse"></div></div>
                    </CarouselItem>
                  ))
                ) : (
                  featuredProperties?.map((property) => (
                    <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                      <PropertyCard property={property} />
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-2rem] top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow" />
              <CarouselNext className="absolute right-[-2rem] top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow" />
            </Carousel>
          </div>
          <div className="text-center mt-12">
            <Button asChild className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Choose R&R Realty</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide exceptional service and expertise to make your real estate journey smooth and successful.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Trusted Experts</h3>
              <p className="text-gray-600">
                Over 15 years of experience helping families find their perfect homes with integrity and professionalism.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cog className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Seamless Process</h3>
              <p className="text-gray-600">
                We handle all the details from start to finish, making your buying or selling experience stress-free.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Local Knowledge</h3>
              <p className="text-gray-600">
                Deep understanding of Minnesota neighborhoods, schools, and market trends to guide your decisions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Top Value Deals</h3>
              <p className="text-gray-600">
                Negotiating the best prices and terms to maximize your investment and savings in every transaction.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hear from families who trusted us with their home buying and selling journey.
            </p>
          </div>
          <div className="relative px-12">
            <Carousel opts={{ align: "start", loop: true, slidesToScroll: 1 }} className="w-full">
              <CarouselContent className="-ml-4">
                {testimonialsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                      <div className="p-4 h-full"><div className="w-full h-80 bg-white rounded-lg animate-pulse"></div></div>
                    </CarouselItem>
                  ))
                ) : (
                  testimonials?.map((testimonial, index) => {
                    const avatar = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
                    const initials = testimonial.name.split(' ').map(n => n[0]).join('');
                    return (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                        <div className="p-4 h-full">
                          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                            <div className="flex items-center mb-4 text-yellow-400">
                              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-gray-600 mb-6 italic flex-grow">"{testimonial.text}"</p>
                            <div className="flex items-center">
                              <Avatar className="w-12 h-12 mr-4 bg-secondary/20">
                                {avatar && <AvatarImage src={avatar.imageUrl} alt={testimonial.name} />}
                                <AvatarFallback className="text-secondary font-semibold bg-transparent">{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-primary">{testimonial.name}</div>
                                <div className="text-gray-600 text-sm">{testimonial.location}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    )
                  })
                )}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-2rem] top-1/2 -translate-y-1/2 hidden lg:flex" />
              <CarouselNext className="absolute right-[-2rem] top-1/2 -translate-y-1/2 hidden lg:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="h-96 relative rounded-lg overflow-hidden shadow-lg">
               {aboutImage && <Image src={aboutImage.imageUrl} alt="R&R Realty Team" fill className="object-cover" data-ai-hint={aboutImage.imageHint} />}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">About R&R Realty</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Founded in 2008, R&R Realty has been serving the Twin Cities area with dedication and expertise. We specialize exclusively in single-family homes, allowing us to provide focused, knowledgeable service that our clients deserve.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our team of experienced agents understands that buying or selling a home is one of life's biggest decisions. That's why we're committed to providing personalized service, honest communication, and expert guidance throughout your real estate journey.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">500+</div>
                  <div className="text-gray-600">Homes Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
              <Button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Join hundreds of satisfied families who have trusted R&R Realty with their most important investment. Let's make your real estate dreams a reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-secondary text-white px-8 py-4 text-lg rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
              Start Home Search
            </Button>
            <Button variant="outline" className="bg-white text-primary px-8 py-4 text-lg rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap h-auto">
              Get Free Home Valuation
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Latest Real Estate Insights</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay informed with our expert tips, market updates, and home buying guides.
            </p>
          </div>
          <div className="relative px-12">
            <Carousel opts={{ align: "start", loop: true, slidesToScroll: 1 }} className="w-full">
              <CarouselContent className="-ml-4">
                {blogLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                      <div className="p-4"><div className="w-full h-96 bg-white rounded-lg animate-pulse"></div></div>
                    </CarouselItem>
                  ))
                ) : (
                  blogPosts?.map((post: BlogPost) => {
                    const image = post.imageUrl ? PlaceHolderImages.find(p => p.id === post.imageUrl.id) : null;
                    return (
                      <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                        <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                            {image && post.imageUrl && (
                                <Link href={`/blog/${post.slug}`} className="block h-48 bg-cover bg-center relative">
                                <Image src={image.imageUrl} alt={post.imageUrl.alt} fill className="object-cover" data-ai-hint={image.imageHint} />
                                </Link>
                            )}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                <i className="ri-calendar-line mr-2"></i>
                                <span>{post.publicationDate ? new Date(post.publicationDate.toDate()).toLocaleDateString() : 'N/A'}</span>
                                <span className="mx-2">•</span>
                                <span>5 min read</span>
                                </div>
                                <h3 className="text-xl font-semibold text-primary mb-3 hover:text-secondary transition-colors flex-grow">
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                {post.content.substring(0, 100)}...
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-1">
                                {post.tags.slice(0,2).map(tag => (
                                    <span key={tag} className="text-secondary font-medium text-sm">{tag}</span>
                                ))}
                                </div>
                                <Link href={`/blog/${post.slug}`} className="text-primary hover:text-secondary transition-colors text-sm font-medium">
                                    Read More <i className="ri-arrow-right-line inline-block"></i>
                                </Link>
                                </div>
                            </div>
                        </article>
                      </CarouselItem>
                    )
                  })
                )}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-2rem] top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow" />
              <CarouselNext className="absolute right-[-2rem] top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow" />
            </Carousel>
          </div>
           <div className="text-center mt-12">
            <Button asChild className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
              <Link href="/blog">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Get in Touch</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ready to start your real estate journey? Contact us today for a free consultation.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <Label className="block text-gray-700 font-medium mb-2">Full Name</Label>
                  <Input 
                    type="text" 
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                    placeholder="Enter your full name" />
                </div>
                <div>
                  <Label className="block text-gray-700 font-medium mb-2">Email Address</Label>
                  <Input 
                    type="email" 
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                    placeholder="Enter your email address" />
                </div>
                <div>
                  <Label className="block text-gray-700 font-medium mb-2">Phone Number</Label>
                  <Input 
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                    placeholder="Enter your phone number" />
                </div>
                <div>
                  <Label className="block text-gray-700 font-medium mb-2">Message</Label>
                  <Textarea 
                    rows={5}
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none" 
                    placeholder="Tell us about your real estate needs" />
                </div>
                <Button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto">
                  Send Message
                </Button>
              </form>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden relative shadow-lg">
              {mapImage && <Image src={mapImage.imageUrl} alt="Map of Minneapolis" fill className="object-cover" data-ai-hint={mapImage.imageHint} />}
            </div>
          </div>
        </div>
      </section>

       <div className="fixed bottom-6 right-6 z-50">
        <a href="https://wa.me/16125550123?text=Hi%2C%20I%27m%20interested%20in%20your%20real%20estate%20services" target="_blank" className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <i className="ri-whatsapp-fill text-2xl"></i>
        </a>
      </div>
    </div>
  );
}
