
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
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';

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
        // Standard sign-in attempt
        await signInWithEmailAndPassword(auth, email, password);
        // On success, the useEffect will handle the redirect.
    } catch (error: any) {
        // Special "upsert" logic for the master admin
        if (email === MASTER_ADMIN_EMAIL && error.code === 'auth/user-not-found') {
            console.log("Master admin not found, attempting to create...");
            try {
                // 1. Create the auth user
                const userCredential = await createUserWithEmailAndPassword(auth, MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASS);
                const masterUser = userCredential.user;

                // 2. Create the Firestore profile
                const profileDocRef = doc(firestore, 'users', masterUser.uid);
                await setDocumentNonBlocking(profileDocRef, {
                  uid: masterUser.uid,
                  email: masterUser.email,
                  displayName: "Master Admin",
                  role: "master-admin",
                  createdAt: serverTimestamp(),
                }, {});

                console.log("Master admin user created successfully.");
                // The onAuthStateChanged listener will now pick up the new user and redirect.
                // No need to call signInWithEmailAndPassword again.
            } catch (creationError: any) {
                 console.error("Critical error during master admin creation:", creationError);
                 toast({
                    variant: "destructive",
                    title: "Admin Setup Failed",
                    description: `Could not create the master admin account: ${creationError.message}`,
                });
            }
        } else {
            // Handle all other generic login errors
            console.error('Sign in error:', error);
            let description = "Invalid credentials. Please check your email and password and try again.";
            if (error.code === 'auth/user-not-found') {
              description = "No user found with this email address."
            } else if (error.code === 'auth/invalid-credential') {
              description = "The password you entered is incorrect. Please try again."
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
