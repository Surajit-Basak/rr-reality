

'use client';

import { notFound } from "next/navigation";
import Image from "next/image";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, query, where, limit } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, Square, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PropertyCard } from "@/components/property-card";
import { InquiryForm } from "../inquiry-form";
import type { Property } from "@/lib/types";

type Props = {
  params: { slug: string };
};

export default function PropertyDetailPage({ params }: Props) {
  const firestore = useFirestore();
  
  const propertyQuery = useMemoFirebase(() => {
    if (!firestore || !params.slug) return null;
    return query(collection(firestore, 'properties'), where('slug', '==', params.slug), limit(1));
  }, [firestore, params.slug]);

  const { data: properties, isLoading } = useCollection<Property>(propertyQuery);
  const property = properties?.[0];

  // Dynamically set page title and description
  if (property) {
      document.title = property.seoTitle || property.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
          metaDescription.setAttribute('content', property.seoDescription || property.description.substring(0, 160));
      }
  }

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Add proper skeleton
  }

  if (!property) {
    notFound();
  }

  const agentImage = PlaceHolderImages.find(p => p.id === property.agent.avatar);
  const propertyImages = property.images.map(imgObj => {
    const placeholder = PlaceHolderImages.find(p => p.id === imgObj.id);
    return placeholder ? { ...placeholder, alt: imgObj.alt } : null;
  }).filter(Boolean);
  
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  // Note: Related properties logic would need to be updated to fetch from Firestore.
  // This is a placeholder for now.
  const relatedProperties: Property[] = [];
    
  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{property.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Image Gallery & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Carousel className="w-full rounded-lg overflow-hidden shadow-lg">
              <CarouselContent>
                {propertyImages.map((image, index) => image && (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative">
                      <Image src={image.imageUrl} alt={image.alt} fill className="object-cover" data-ai-hint={image.imageHint} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="row-start-3 lg:row-start-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Property Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <Badge variant={property.status === 'For Sale' ? 'destructive' : 'secondary'}>{property.status}</Badge>
                    <div className="text-3xl font-bold text-accent mt-2">
                        {formatPrice(property.price)}
                        {property.status === 'For Rent' && <span className="text-lg font-normal text-muted-foreground">/month</span>}
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <BedDouble className="h-6 w-6 mx-auto text-primary" />
                        <p className="mt-1 text-sm font-semibold">{property.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Bedrooms</p>
                    </div>
                    <div>
                        <Bath className="h-6 w-6 mx-auto text-primary" />
                        <p className="mt-1 text-sm font-semibold">{property.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Bathrooms</p>
                    </div>
                    <div>
                        <Square className="h-6 w-6 mx-auto text-primary" />
                        <p className="mt-1 text-sm font-semibold">{property.size.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">sqft</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description, Amenities, Agent Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle className="text-primary">Description</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground leading-relaxed">{property.description}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-primary">Amenities</CardTitle></CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-muted-foreground">
                  {property.amenities.map(amenity => (
                    <li key={amenity} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {agentImage && <Avatar className="h-16 w-16">
                    <AvatarImage src={agentImage.imageUrl} alt={property.agent.name} data-ai-hint={agentImage.imageHint} />
                    <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>}
                  <div>
                    <CardTitle className="text-primary">{property.agent.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Listing Agent</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <InquiryForm propertyId={property.id} agentName={property.agent.name} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8">
            <Card>
                <CardHeader><CardTitle className="text-primary">Location</CardTitle></CardHeader>
                <CardContent>
                    {mapImage && <Image src={mapImage.imageUrl} alt="Map location" width={1200} height={400} className="w-full h-96 object-cover rounded-md" data-ai-hint={mapImage.imageHint}/>}
                </CardContent>
            </Card>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">Similar Properties</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProperties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
        </div>}

      </div>
    </div>
  );
}

    