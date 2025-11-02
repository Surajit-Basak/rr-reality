
'use client';

import { useCollection, useFirestore } from "@/firebase";
import { PropertiesClientPage } from "./properties-client-page";
import { collection, query } from "firebase/firestore";

export default function PropertiesPage() {
  const firestore = useFirestore();
  const propertiesCollection = collection(firestore, 'properties');
  const propertiesQuery = query(propertiesCollection);
  const { data: allProperties, isLoading } = useCollection(propertiesQuery);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <PropertiesClientPage allProperties={allProperties || []} />;
}
