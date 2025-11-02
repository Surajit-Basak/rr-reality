
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
  createdAt: any; // Using `any` for Firestore serverTimestamp
};

export type Amenity = {
  id: string;
  label: string;
  icon: React.ElementType;
}

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  avatarId: string;
  text: string;
};

export type BlogPost = {
    id: string;
    title: string;
    content: string;
    author: string;
    publicationDate: {
      toDate: () => Date;
    }; // Using `any` for Firestore serverTimestamp
    tags: string[];
    imageUrl: string;
};
