

export type UserRole = 'master-admin' | 'admin' | 'user';

export type UserProfile = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: any;
}

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

export type PropertySubmission = {
  id: string;
  submitterName: string;
  submitterEmail: string;
  title: string;
  description: string;
  type: 'House' | 'Apartment' | 'Condo' | 'Land';
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  location: string;
  amenities: string[];
  submittedAt: any;
}

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
