

export type UserRole = 'master-admin' | 'admin' | 'user';

export type UserProfile = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: any;
}

export type ImageObject = {
  id: string;
  alt: string;
}

export type Property = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'For Sale' | 'For Rent';
  type: 'House' | 'Apartment' | 'Condo' | 'Land' | 'Townhouse' | 'Multi-Family' | 'Other';
  otherType?: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number; // in sqft
  amenities: string[];
  images: ImageObject[]; // Now an array of objects
  agent: {
    name: string;
    avatar: string; // image id
  };
  featured: boolean;
  createdAt: any; // Using `any` for Firestore serverTimestamp
  seoTitle?: string;
  seoDescription?: string;
};

export type PropertySubmission = {
  id: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  title: string;
  description: string;
  type: 'House' | 'Apartment' | 'Condo' | 'Land' | 'Townhouse' | 'Multi-Family' | 'Other';
  otherType?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  location: string;
  amenities: string[];
  featuredImage?: File;
  galleryImages?: FileList;
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
    slug: string;
    content: string;
    author: string;
    publicationDate: {
      toDate: () => Date;
    }; // Using `any` for Firestore serverTimestamp
    tags: string[];
    imageUrl: ImageObject; // Now an object
    seoTitle?: string;
    seoDescription?: string;
};

    