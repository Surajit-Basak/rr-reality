
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

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
    // If the user is already logged in, redirect them to the admin page.
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
        description: "Authentication service not available. Please try again later.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // If sign-in is successful AND it's the master admin, ensure the profile exists.
      // This is a robust "upsert" that guarantees the role is correctly set in Firestore.
      if (email === MASTER_ADMIN_EMAIL) {
        const userDocRef = doc(firestore, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: "Master Admin",
            role: "master-admin",
            createdAt: serverTimestamp(),
        }, { merge: true }); // Using merge to create or update.
      }
      
      router.push('/admin');

    } catch (error: any) {
      // If it's the master admin and the user doesn't exist, create it.
      if (email === MASTER_ADMIN_EMAIL && error.code === 'auth/user-not-found') {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          const masterUser = newUserCredential.user;
          
          const userDocRef = doc(firestore, 'users', masterUser.uid);
          await setDoc(userDocRef, {
            uid: masterUser.uid,
            email: masterUser.email,
            displayName: "Master Admin",
            role: "master-admin",
            createdAt: serverTimestamp(),
          });

          toast({
            title: "Admin Account Created",
            description: "Welcome! Your master admin account has been set up.",
          });

          router.push('/admin');

        } catch (creationError: any) {
          toast({
            variant: "destructive",
            title: "Admin Setup Failed",
            description: `Could not create the master admin account: ${creationError.message}`,
          });
        }
      } else {
        let description = "An unknown error occurred. Please try again.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          description = "The email or password you entered is incorrect.";
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

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
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
