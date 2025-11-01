export type Property = {
  id: string;
  title: string;
  description: string;
  status: 'For Sale' | 'For Rent';
  type: 'House' | 'Apartment' | 'Condo' | 'Land';
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number; // in sqft
  amenities: string[];
  images: string[]; // image ids from placeholder-images.json
  agent: {
    name: string;
    avatar: string; // image id
  };
  featured: boolean;
};

export type Amenity = {
  id: string;
  label: string;
  icon: React.ElementType;
}
