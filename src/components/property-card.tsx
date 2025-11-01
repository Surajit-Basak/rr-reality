import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square } from "lucide-react";

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
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative">
          {image && (
            <Image
              src={image.imageUrl}
              alt={property.title}
              width={600}
              height={400}
              className="object-cover w-full h-48"
              data-ai-hint={image.imageHint}
            />
          )}
          <Badge 
            className="absolute top-2 left-2"
            variant={property.status === 'For Sale' ? 'destructive' : 'secondary'}
          >
            {property.status}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg leading-snug tracking-tight text-primary truncate">
              {property.title}
            </h3>
             <div className="text-lg font-bold text-accent">
                {formatPrice(property.price)}
                {property.status === 'For Rent' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1 truncate">{property.location}</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4" />
              <span>{property.size} sqft</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
