
'use client';

import { useFirestore, useUser, useMemoFirebase, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { doc } from 'firebase/firestore';
import { UserProfile, UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type AuthGuardProps = {
  children: React.ReactNode;
  role?: UserRole | 'master-admin' | 'admin'; // Allow checking for general admin role
};

export function AuthGuard({ children, role }: AuthGuardProps) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  const isLoading = isUserLoading || (user && isProfileLoading);
  
  if (isLoading) {
    return (
        <div className="p-4 md:p-8 space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  // After loading, if there's no user, redirect (redundant but safe)
  if (!user) {
    return null; // Or a redirect component
  }

  // If a role is required, check it
  if (role) {
    const userRole = userProfile?.role;
    let hasPermission = false;

    if (role === 'admin') {
        hasPermission = userRole === 'admin' || userRole === 'master-admin';
    } else {
        hasPermission = userRole === role;
    }
    
    if (!userProfile || !hasPermission) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Card className="m-4">
            <CardHeader><CardTitle>Access Denied</CardTitle></CardHeader>
            <CardContent>
              <p>You do not have permission to view this page.</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }


  return <>{children}</>;
}
