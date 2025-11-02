

'use client';

import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { collection, query, doc, serverTimestamp } from "firebase/firestore";
import type { PropertySubmission } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
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
import { useRouter } from "next/navigation";

export default function SubmissionsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const submissionsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'property_submissions')) : null
  , [firestore]);

  const { data: submissions, isLoading } = useCollection<PropertySubmission>(submissionsQuery);
  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  const handleApprove = async (submission: PropertySubmission) => {
    if (!firestore) return;
    
    // 1. Create a new property document from the submission data
    const propertiesCollection = collection(firestore, 'properties');
    const newPropertyData = {
        title: submission.title,
        description: submission.description,
        type: submission.type,
        status: "For Sale" as const,
        price: submission.price,
        bedrooms: submission.bedrooms,
        bathrooms: submission.bathrooms,
        size: submission.size,
        location: submission.location,
        amenities: submission.amenities,
        images: [], // Admin needs to add images manually for now
        featured: false,
        agent: { // Assign a default agent
            name: "Jane Doe",
            avatar: "agent-1",
        },
        createdAt: serverTimestamp(),
    };

    try {
        await addDocumentNonBlocking(propertiesCollection, newPropertyData);

        // 2. Delete the submission document
        const submissionDocRef = doc(firestore, 'property_submissions', submission.id);
        await deleteDocumentNonBlocking(submissionDocRef);

        toast({
            title: "Submission Approved",
            description: `Property "${submission.title}" has been listed.`,
        });
        router.refresh();
    } catch (error) {
        console.error("Error approving submission: ", error);
        toast({
            variant: "destructive",
            title: "Approval Failed",
            description: "An error occurred while approving the submission.",
        });
    }
  };

  const handleDisapprove = (submission: PropertySubmission) => {
    if (!firestore) return;
    const submissionDocRef = doc(firestore, 'property_submissions', submission.id);
    deleteDocumentNonBlocking(submissionDocRef);
    toast({
      title: "Submission Rejected",
      description: `The submission for "${submission.title}" has been rejected and removed.`,
      variant: 'destructive'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Submissions</CardTitle>
        <CardDescription>Review and approve new property submissions from users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Submitter</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="py-4"><div className="h-6 bg-muted rounded animate-pulse"></div></TableCell>
                </TableRow>
              ))
            ) : submissions && submissions.length > 0 ? (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{sub.submitterName}</div>
                    <div className="text-xs text-muted-foreground">{sub.submitterEmail}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{sub.location}</TableCell>
                  <TableCell>{formatPrice(sub.price)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <Button onClick={() => handleApprove(sub)} size="sm" className="mr-2 bg-green-600 hover:bg-green-700">
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <AlertDialogTrigger asChild>
                         <Button size="sm" variant="destructive">
                            <X className="mr-1 h-4 w-4" /> Disapprove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the submission for "{sub.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDisapprove(sub)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Yes, disapprove
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
                  No pending submissions.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
