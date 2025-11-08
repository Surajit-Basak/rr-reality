
import { Testimonial, Property, BlogPost } from './types';
import { serverTimestamp } from 'firebase/firestore';

export const demoTestimonials: Testimonial[] = [
    {
        name: "The Johnson Family",
        location: "Edina, MN",
        avatarId: "agent-1", // Using existing placeholder IDs
        text: "R&R Realty made selling our home a breeze! Their market knowledge and negotiation skills were top-notch. We got a fantastic price and couldn't be happier. Highly recommend their team!"
    },
    {
        name: "David Chen",
        location: "Minneapolis, MN",
        avatarId: "agent-2",
        text: "As a first-time homebuyer, I was nervous about the process. The agents at R&R were patient, informative, and guided me every step of the way. I found my dream home thanks to their expertise."
    },
    {
        name: "Maria Garcia",
        location: "St. Paul, MN",
        avatarId: "agent-3",
        text: "I've worked with several real estate agencies over the years, and R&R Realty is by far the best. Their professionalism, attention to detail, and commitment to their clients are unparalleled."
    }
];

export const demoProperties: Omit<Property, 'id'>[] = [
    {
        title: "Modern Family Home in Suburbia",
        slug: "modern-family-home-in-suburbia",
        description: "A stunning and spacious modern home located in a quiet, family-friendly suburb. Features an open-concept living area, a gourmet kitchen with high-end appliances, and a large backyard perfect for entertaining. With 4 bedrooms and 3 bathrooms, this home offers plenty of space for a growing family.",
        status: "For Sale",
        type: "House",
        location: "123 Maple Street, Edina, MN",
        price: 650000,
        bedrooms: 4,
        bathrooms: 3,
        size: 2800,
        amenities: ["Garage", "Garden", "Air Conditioning", "Kitchen"],
        images: [
            { id: "property-1-ext", alt: "Exterior view of a modern family home" },
            { id: "property-1-int-1", alt: "Spacious living room with modern furniture" },
            { id: "property-1-int-2", alt: "Gourmet kitchen with stainless steel appliances" }
        ],
        agent: { name: "Jane Doe", avatar: "agent-1" },
        featured: true,
        createdAt: serverTimestamp(),
    },
    {
        title: "Charming Downtown Condo",
        slug: "charming-downtown-condo",
        description: "Experience the best of city living in this charming 2-bedroom condo. Located in the heart of downtown, this unit boasts breathtaking city views, hardwood floors, and access to a rooftop pool and gym. Walking distance to shops, restaurants, and public transport.",
        status: "For Rent",
        type: "Condo",
        location: "456 Oak Avenue, Minneapolis, MN",
        price: 2800,
        bedrooms: 2,
        bathrooms: 2,
        size: 1200,
        amenities: ["Pool", "Gym", "Air Conditioning", "Wifi"],
        images: [
            { id: "property-8-ext", alt: "Exterior of a modern condo building" },
            { id: "property-2-int-1", alt: "Living area of a luxury apartment" },
            { id: "property-8-int-1", alt: "Modern kitchen in a condo" }
        ],
        agent: { name: "John Smith", avatar: "agent-2" },
        featured: true,
        createdAt: serverTimestamp(),
    },
    {
        title: "Sprawling Ranch with Acreage",
        slug: "sprawling-ranch-with-acreage",
        description: "A beautiful ranch-style home set on 5 acres of private land. This property offers a peaceful retreat with plenty of outdoor space, a large barn, and horse-friendly pastures. The home features 3 bedrooms, a rustic fireplace, and a large country kitchen.",
        status: "For Sale",
        type: "House",
        location: "789 Pine Road, Plymouth, MN",
        price: 725000,
        bedrooms: 3,
        bathrooms: 2,
        size: 2400,
        amenities: ["Garage", "Garden", "Pet Friendly"],
        images: [
            { id: "property-7-ext", alt: "Exterior of a ranch-style house" },
            { id: "property-7-int-1", alt: "Open-plan living area" }
        ],
        agent: { name: "Jane Doe", avatar: "agent-1" },
        featured: true,
        createdAt: serverTimestamp(),
    },
     {
        title: "Luxury High-Rise Apartment",
        slug: "luxury-high-rise-apartment",
        description: "Live in luxury in this stunning high-rise apartment. Floor-to-ceiling windows offer panoramic views of the city. The building includes a 24/7 doorman, a state-of-the-art fitness center, and a resident lounge. The unit itself is a masterpiece of modern design.",
        status: "For Rent",
        type: "Apartment",
        location: "101 Skyview Lane, Minneapolis, MN",
        price: 3500,
        bedrooms: 1,
        bathrooms: 1,
        size: 950,
        amenities: ["Pool", "Gym", "Air Conditioning", "Wifi", "Furnished"],
        images: [
            { id: "property-6-ext", alt: "Exterior of a high-rise apartment building" },
            { id: "property-6-int-1", alt: "Minimalist apartment interior" }
        ],
        agent: { name: "Samantha Bee", avatar: "agent-3" },
        featured: false,
        createdAt: serverTimestamp(),
    }
];

export const demoBlogPosts: Omit<BlogPost, 'id'>[] = [
    {
        title: "5 Essential Tips for First-Time Home Buyers in the Twin Cities",
        slug: "5-tips-for-first-time-home-buyers",
        content: "Navigating the real estate market for the first time can be daunting. From securing financing to making the right offer, there are many steps involved. In this post, we break down 5 essential tips to help you on your journey to homeownership in Minneapolis-St. Paul. We'll cover getting pre-approved, understanding the local market, working with a real estate agent, and more. With these tips, you'll be better prepared to make a confident and informed decision.",
        author: "Jane Doe",
        tags: ["buying", "tips", "finance"],
        imageUrl: { id: "blog-4", alt: "House keys on a wooden table" },
        publicationDate: serverTimestamp(),
    },
    {
        title: "How to Stage Your Home to Sell for Top Dollar",
        slug: "how-to-stage-your-home",
        content: "When selling your home, first impressions are everything. Professional staging can make the difference between a quick sale at a great price and a property that lingers on the market. This guide provides practical, DIY tips for staging your home effectively. Learn how to declutter, arrange furniture to maximize space, and use lighting to create a warm and inviting atmosphere that will captivate potential buyers from the moment they walk in.",
        author: "John Smith",
        tags: ["selling", "staging", "market"],
        imageUrl: { id: "blog-1", alt: "Person writing in a notebook on a desk" },
        publicationDate: serverTimestamp(),
    },
    {
        title: "Understanding the Current Twin Cities Housing Market: A 2024 Mid-Year Review",
        slug: "twin-cities-market-review-2024",
        content: "The real estate market is constantly changing. In this mid-year review, we analyze the latest trends in the Minneapolis-St. Paul housing market. We'll look at inventory levels, average sale prices, and interest rate impacts. Whether you're thinking of buying or selling, this analysis will provide valuable insights to help you understand the current landscape and make strategic decisions for your real estate goals.",
        author: "Samantha Bee",
        tags: ["market update", "trends", "finance"],
        imageUrl: { id: "blog-3", alt: "Smartphone showing financial charts" },
        publicationDate: serverTimestamp(),
    },
     {
        title: "The Top 3 Up-and-Coming Neighborhoods in the Twin Cities",
        slug: "top-neighborhoods-twin-cities",
        content: "Looking for the next hot spot in the Twin Cities? We've done the research for you. In this article, we explore three up-and-coming neighborhoods that offer a great mix of affordability, amenities, and community vibe. From trendy new restaurants to beautiful parks, find out which areas are gaining popularity and why they might be the perfect place for your next home.",
        author: "Admin",
        tags: ["neighborhoods", "lifestyle", "market"],
        imageUrl: { id: "blog-2", alt: "Person typing on a laptop" },
        publicationDate: serverTimestamp(),
    }
];
