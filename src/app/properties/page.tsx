
'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { PropertiesClientPage } from "./properties-client-page";
import { collection, query } from "firebase/firestore";

export default function PropertiesPage() {
  const firestore = useFirestore();
  const propertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'properties'));
  }, [firestore]);

  const { data: allProperties, isLoading } = useCollection(propertiesQuery);

  if (isLoading) {
    return <div className="container mx-auto px-4 md:px-6 py-8">Loading properties...</div>;
  }

  return <PropertiesClientPage allProperties={allProperties || []} />;
}
