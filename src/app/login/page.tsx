
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, useFirestore, useUser, setDocumentNonBlocking } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { doc, serverTimestamp } from 'firebase/firestore';

// Configuration for the master admin
const MASTER_ADMIN_EMAIL = "surajitbasak2023@gmail.com";
const MASTER_ADMIN_PASS = "123456";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
      if (!isUserLoading && user) {
          router.push('/admin');
      }
  }, [isUserLoading, user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth || !firestore) {
        toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: "Authentication service not available.",
        });
        setIsLoading(false);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // On success, the useEffect hook will handle the redirect.
    } catch (error: any) {
        if (email === MASTER_ADMIN_EMAIL && password === MASTER_ADMIN_PASS && error.code === 'auth/user-not-found') {
            // If it's the master admin and the user doesn't exist, create them.
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const masterUser = userCredential.user;
                const profileDocRef = doc(firestore, 'users', masterUser.uid);
                
                // Use the non-blocking function to ensure the document is created.
                setDocumentNonBlocking(profileDocRef, {
                    uid: masterUser.uid,
                    email: masterUser.email,
                    displayName: "Master Admin",
                    role: "master-admin",
                    createdAt: serverTimestamp(),
                }, {});

                // The onAuthStateChanged listener in useUser will now have the user
                // and the useEffect will redirect to /admin.
                toast({
                    title: "Admin Account Created",
                    description: "Welcome! Redirecting you to the dashboard.",
                });

            } catch (creationError: any) {
                toast({
                    variant: "destructive",
                    title: "Admin Setup Failed",
                    description: `Could not create the master admin account: ${creationError.message}`,
                });
            }
        } else {
            // Handle standard login errors
            let description = "An unknown error occurred. Please try again.";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
              description = "The email or password you entered is incorrect. Please try again.";
            } else if (error.code === 'auth/user-not-found') {
                description = "No user found with this email address."
            }
            toast({
              variant: "destructive",
              title: "Sign In Failed",
              description: description,
            });
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
