
'use client';

import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, doc, orderBy } from "firebase/firestore";
import type { Property, Inquiry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function InquiriesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const inquiriesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'inquiries'), orderBy('inquiryDate', 'desc')) : null
  , [firestore]);

  const { data: inquiries, isLoading } = useCollection<Inquiry>(inquiriesQuery);

  const handleDelete = (inquiry: Inquiry) => {
    if (!firestore) return;
    const inquiryDocRef = doc(firestore, 'inquiries', inquiry.id);
    deleteDocumentNonBlocking(inquiryDocRef);
    toast({
      title: "Inquiry Deleted",
      description: `The inquiry from ${inquiry.name} has been deleted.`,
      variant: 'destructive'
    });
  };
  
  // A simple way to get property titles. In a real app this might be more complex.
  const propertiesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'properties')) : null, [firestore]);
  const { data: properties } = useCollection<Property>(propertiesQuery);
  const propertyTitles = useMemo(() => {
    if (!properties) return {};
    return properties.reduce((acc, p) => ({ ...acc, [p.id]: p.title }), {});
  }, [properties]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Inquiries</CardTitle>
        <CardDescription>Review and manage user inquiries for properties.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="py-4"><div className="h-6 bg-muted rounded animate-pulse"></div></TableCell>
                </TableRow>
              ))
            ) : inquiries && inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">
                    {propertyTitles[inquiry.propertyId] || 'General Inquiry'}
                  </TableCell>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                     <div>{inquiry.email}</div>
                     <div className="text-xs text-muted-foreground">{inquiry.phone}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {inquiry.inquiryDate ? new Date(inquiry.inquiryDate.toDate()).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button size="sm" variant="destructive">
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the inquiry from "{inquiry.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(inquiry)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Yes, delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No inquiries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Minimal type for Inquiry for this page
export type Inquiry = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    propertyId: string;
    inquiryDate: {
        toDate: () => Date;
    };
}
