

'use client';

import { Suspense } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { PropertiesClientPage } from "./properties-client-page";
import { collection, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

function PropertiesPageContent() {
  const firestore = useFirestore();
  const propertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'properties'));
  }, [firestore]);

  const { data: allProperties, isLoading } = useCollection(propertiesQuery);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <Skeleton className="h-[700px] w-full" />
                </div>
                <div className="lg:col-span-3">
                    <div className="mb-6">
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-96 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return <PropertiesClientPage allProperties={allProperties || []} />;
}


export default function PropertiesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PropertiesPageContent />
        </Suspense>
    )
}
