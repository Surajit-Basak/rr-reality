
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, getDocs, query } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { demoTestimonials, demoProperties, demoBlogPosts } from '@/lib/demo-data';

type SeedType = 'testimonials' | 'properties' | 'blog';

export function AppSettings() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedDatabase = async (type: SeedType) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Firestore not available',
      });
      return;
    }

    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      let collectionRef;
      let dataToSeed;
      let collectionName = '';

      switch(type) {
        case 'testimonials':
          collectionRef = collection(firestore, 'testimonials');
          dataToSeed = demoTestimonials;
          collectionName = 'Testimonials';
          break;
        case 'properties':
          collectionRef = collection(firestore, 'properties');
          dataToSeed = demoProperties;
          collectionName = 'Properties';
          break;
        case 'blog':
          collectionRef = collection(firestore, 'blog_posts');
          dataToSeed = demoBlogPosts;
          collectionName = 'Blog Posts';
          break;
        default:
          throw new Error('Invalid seed type');
      }

      // Optional: Check if collection is empty before seeding
      const q = query(collectionRef);
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        toast({
          variant: 'destructive',
          title: 'Seeding Stopped',
          description: `${collectionName} collection is not empty. Please clear it before seeding.`,
        });
        setIsSeeding(false);
        return;
      }

      dataToSeed.forEach(item => {
        const docRef = collectionRef.doc(); // Auto-generates an ID
        batch.set(docRef, item);
      });

      await batch.commit();
      
      toast({
        title: 'Database Seeded!',
        description: `Demo ${collectionName.toLowerCase()} have been added to your database.`,
      });
    } catch (error: any) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'An error occurred while seeding the database.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Seed Properties</h3>
          <p className="text-sm text-muted-foreground">
            Add demo properties to your database to populate the frontend.
          </p>
        </div>
        <Button onClick={() => handleSeedDatabase('properties')} disabled={isSeeding}>
          {isSeeding ? 'Seeding...' : 'Seed Properties'}
        </Button>
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Seed Blog Posts</h3>
          <p className="text-sm text-muted-foreground">
            Add demo blog posts to your database.
          </p>
        </div>
        <Button onClick={() => handleSeedDatabase('blog')} disabled={isSeeding}>
          {isSeeding ? 'Seeding...' : 'Seed Blog Posts'}
        </Button>
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Seed Testimonials</h3>
          <p className="text-sm text-muted-foreground">
            Add demo testimonials to populate the homepage.
          </p>
        </div>
        <Button onClick={() => handleSeedDatabase('testimonials')} disabled={isSeeding}>
          {isSeeding ? 'Seeding...' : 'Seed Testimonials'}
        </Button>
      </div>
    </CardContent>
  );
}
