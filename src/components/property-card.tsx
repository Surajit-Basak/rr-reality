import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Bath, Square, MapPin } from "lucide-react";
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
      <Link href={`/properties/${property.id}`} className="block h-full flex flex-col">
        <div className="h-64 bg-cover bg-center relative">
         {image && <Image src={image.imageUrl} alt={property.title} fill className="object-cover" data-ai-hint={image.imageHint} />}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-2xl font-bold text-primary mb-2">{formatPrice(property.price)}</div>
          <div className="text-gray-600 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1 inline-block" />
            {property.location}
          </div>
          <div className="flex items-center text-gray-600 mb-4 space-x-4">
            <span className="flex items-center">
              <BedDouble className="w-4 h-4 mr-1" />
              {property.bedrooms} Beds
            </span>
            <span className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms} Baths
            </span>
            <span className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              {property.size.toLocaleString()} sq ft
            </span>
          </div>
          <Button asChild className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap h-auto mt-auto">
            <span className="cursor-pointer">View Details</span>
          </Button>
        </div>
      </Link>
    </div>
  );
}
