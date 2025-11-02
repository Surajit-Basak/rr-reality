
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

// ONE-TIME SCRIPT: Configuration for the master admin
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

  // ONE-TIME SCRIPT to create master admin on first load
  useEffect(() => {
    const createMasterAdmin = async () => {
      if (!firestore) return;

      // Use a separate, temporary auth instance for this setup task
      // to avoid interfering with the main app's auth state.
      const tempAuth = getAuth();
      const userDocRef = doc(firestore, "users", "master_admin_setup_flag");

      try {
        const setupFlag = await getDoc(userDocRef);
        if (setupFlag.exists()) {
          // The script has already run successfully.
          return;
        }

        // Attempt to create the user.
        const userCredential = await createUserWithEmailAndPassword(tempAuth, MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASS);
        const masterUser = userCredential.user;

        // Create the user profile in Firestore.
        const profileDocRef = doc(firestore, 'users', masterUser.uid);
        await setDoc(profileDocRef, {
          uid: masterUser.uid,
          email: masterUser.email,
          displayName: "Master Admin",
          role: "master-admin",
          createdAt: serverTimestamp(),
        });
        
        console.log("Master admin user created in Firestore.");
        toast({ title: "Setup Complete", description: "Master admin account has been created." });

        // Set the flag to prevent this script from running again.
        await setDoc(userDocRef, { completed: true });

      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log("Master admin email already exists. Assuming setup is complete.");
          // Set the flag to prevent this script from running again.
           await setDoc(userDocRef, { completed: true });
        } else {
          console.error("Error during master admin setup:", error);
        }
      } finally {
        // Ensure the temporary user is signed out, leaving the main auth state clean.
        if (tempAuth.currentUser) {
          await signOut(tempAuth);
        }
      }
    };

    createMasterAdmin();
  }, [firestore, toast]);


  useEffect(() => {
      if (!isUserLoading && user) {
          router.push('/admin');
      }
  }, [isUserLoading, user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth) {
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
      // AuthGuard will handle redirect on successful login
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Invalid credentials. Please check your email and password and try again.",
      });
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

