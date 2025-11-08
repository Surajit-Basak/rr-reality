
'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, getDocs, query, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { demoTestimonials, demoProperties, demoBlogPosts } from '@/lib/demo-data';
import { Loader2 } from 'lucide-react';

type SeedType = 'testimonials' | 'properties' | 'blog';

export function AppSettings() {
  const [isSeeding, setIsSeeding] = useState(true);
  const [status, setStatus] = useState('Checking database...');
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    const seedAllData = async () => {
      if (!firestore) {
        toast({ variant: 'destructive', title: 'Firestore not available' });
        setIsSeeding(false);
        return;
      }
      
      let seededSomething = false;

      try {
        // Seed Properties
        const propertiesRef = collection(firestore, 'properties');
        const propertiesSnap = await getDocs(query(propertiesRef));
        if (propertiesSnap.empty) {
          setStatus('Seeding Properties...');
          const batch = writeBatch(firestore);
          demoProperties.forEach(item => {
            const docRef = doc(propertiesRef); // Correct V9 syntax
            batch.set(docRef, item);
          });
          await batch.commit();
          toast({ title: 'Properties Seeded', description: 'Demo properties have been added.' });
          seededSomething = true;
        }

        // Seed Blog Posts
        const blogRef = collection(firestore, 'blog_posts');
        const blogSnap = await getDocs(query(blogRef));
        if (blogSnap.empty) {
          setStatus('Seeding Blog Posts...');
          const batch = writeBatch(firestore);
          demoBlogPosts.forEach(item => {
            const docRef = doc(blogRef); // Correct V9 syntax
            batch.set(docRef, item);
          });
          await batch.commit();
          toast({ title: 'Blog Posts Seeded', description: 'Demo blog posts have been added.' });
          seededSomething = true;
        }

        // Seed Testimonials
        const testimonialsRef = collection(firestore, 'testimonials');
        const testimonialsSnap = await getDocs(query(testimonialsRef));
        if (testimonialsSnap.empty) {
          setStatus('Seeding Testimonials...');
          const batch = writeBatch(firestore);
          demoTestimonials.forEach(item => {
            const docRef = doc(testimonialsRef); // Correct V9 syntax
            batch.set(docRef, item);
          });
          await batch.commit();
          toast({ title: 'Testimonials Seeded', description: 'Demo testimonials have been added.' });
          seededSomething = true;
        }

        if (seededSomething) {
          setStatus('Demo data has been successfully added.');
        } else {
          setStatus('Database already contains data. No seeding was performed.');
        }

      } catch (error: any) {
        console.error('Error seeding database:', error);
        setStatus('Seeding failed. See console for details.');
        toast({
          variant: 'destructive',
          title: 'Seeding Failed',
          description: error.message || 'An error occurred while seeding the database.',
        });
      } finally {
        setIsSeeding(false);
      }
    };
    
    seedAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore]);


  return (
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/40">
        <div>
          <h3 className="font-medium">Database Seeding</h3>
          <p className="text-sm text-muted-foreground">
            Automatically populating your database with demo content.
          </p>
        </div>
        <div className="flex items-center gap-2">
            {isSeeding && <Loader2 className="h-5 w-5 animate-spin" />}
            <span>{isSeeding ? 'Seeding...' : 'Complete'}</span>
        </div>
      </div>
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">Status</h4>
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    </CardContent>
  );
}
