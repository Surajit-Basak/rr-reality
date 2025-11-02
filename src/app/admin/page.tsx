
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, BarChart, ArrowUpRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Property } from "@/lib/types";

export default function AdminDashboard() {
  const firestore = useFirestore();

  const allPropertiesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'properties')) : null
  , [firestore]);
  const { data: allProperties, isLoading: propertiesLoading } = useCollection<Property>(allPropertiesQuery);

  const recentPropertiesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'properties'), orderBy('createdAt', 'desc'), limit(5)) : null
  , [firestore]);
  const { data: recentProperties, isLoading: recentPropertiesLoading } = useCollection<Property>(recentPropertiesQuery);
  
  const inquiriesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'inquiries')) : null
  , [firestore]);
  const { data: inquiries, isLoading: inquiriesLoading } = useCollection(inquiriesQuery);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <div className="text-2xl font-bold animate-pulse">...</div>
            ) : (
              <div className="text-2xl font-bold">{allProperties?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Managed in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <div className="text-2xl font-bold animate-pulse">...</div>
            ) : (
              <div className="text-2xl font-bold">{inquiries?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total inquiries received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Visits</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,403</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Properties</CardTitle>
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Button size="sm" className="w-full" asChild>
                    <Link href="/admin/properties/new">Add New Property</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Add a new property listing</p>
            </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPropertiesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="text-center p-4">
                        <div className="h-6 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : recentProperties && recentProperties.length > 0 ? (
                  recentProperties.map(property => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={property.status === "For Sale" ? "destructive" : "secondary"}>{property.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{property.type}</TableCell>
                      <TableCell>{formatPrice(property.price)}</TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/properties/${property.slug}`}>
                            View
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No recent properties found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    