
'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AddUserDialog } from "./add-user-dialog";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export function UserManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(() =>
    firestore ? query(collection(firestore, 'users')) : null
  , [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const handleRoleChange = (userId: string, newRole: UserProfile['role']) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', userId);
    updateDocumentNonBlocking(userDocRef, { role: newRole });
    toast({
      title: "Role Updated",
      description: `User role has been successfully changed to ${newRole}.`,
    });
  };

  return (
    <CardContent>
      <div className="flex justify-end mb-4">
        <AddUserDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Display Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5} className="h-12 text-center">
                    <div className="h-6 bg-muted rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))
          ) : users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole as UserProfile['role'])}>
                      <SelectTrigger className="w-32">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="master-admin">Master Admin</SelectItem>
                      </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {user.role !== 'master-admin' && ( // Prevent master admin from being deleted
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" disabled>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete (Not Implemented)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
}
