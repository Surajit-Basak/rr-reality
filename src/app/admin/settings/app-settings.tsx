
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { demoTestimonials } from '@/lib/demo-data';

export function AppSettings() {
  const [isSeeding, setIsSeeding] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedDatabase = async () => {
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
      const testimonialsCollection = collection(firestore, 'testimonials');
      demoTestimonials.forEach(testimonial => {
        const docRef = testimonialsCollection.doc(); // Auto-generates an ID
        batch.set(docRef, testimonial);
      });

      await batch.commit();
      
      toast({
        title: 'Database Seeded!',
        description: 'Demo testimonials have been added to your database.',
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'An error occurred while seeding the database.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <CardContent>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Seed Database</h3>
          <p className="text-sm text-muted-foreground">
            Add demo testimonials to your database to populate the frontend.
          </p>
        </div>
        <Button onClick={handleSeedDatabase} disabled={isSeeding}>
          {isSeeding ? 'Seeding...' : 'Seed Data'}
        </Button>
      </div>
    </CardContent>
  );
}
