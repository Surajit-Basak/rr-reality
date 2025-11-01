import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square } from "lucide-react";
import { Button } from "./ui/button";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const image = PlaceHolderImages.find(p => p.id === property.images[0]);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 group border-none shadow-lg rounded-lg">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative">
          {image && (
            <Image
              src={image.imageUrl}
              alt={property.title}
              width={600}
              height={400}
              className="object-cover w-full h-56 group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={image.imageHint}
            />
          )}
          <Badge 
            className="absolute top-3 left-3"
            variant={property.status === 'For Sale' ? 'default' : 'secondary'}
          >
            {property.status}
          </Badge>
        </div>
        <CardContent className="p-4 bg-background">
           <h3 className="font-semibold text-lg leading-snug tracking-tight text-primary truncate mb-1">
              {property.title}
            </h3>
          <p className="text-sm text-muted-foreground mt-1 truncate">{property.location}</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-primary" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-primary" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-primary" />
              <span>{property.size} sqft</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
             <div className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
                {property.status === 'For Rent' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
            </div>
            <Button asChild>
                <span className="cursor-pointer">View Details</span>
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
