
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea }from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { allAmenities } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Switch } from "@/components/ui/switch";
import { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    description: z.string().min(20, { message: "Description must be at least 20 characters." }),
    type: z.enum(["House", "Apartment", "Condo", "Land"]),
    status: z.enum(["For Sale", "For Rent"]),
    price: z.coerce.number().min(1, { message: "Price must be a positive number." }),
    bedrooms: z.coerce.number().int().min(0),
    bathrooms: z.coerce.number().int().min(1),
    size: z.coerce.number().int().min(100, { message: "Size must be at least 100 sqft." }),
    location: z.string().min(5, { message: "Location is required." }),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).min(1, { message: "Please select at least one image." }),
    featured: z.boolean().default(false),
    agent: z.object({
        name: z.string(),
        avatar: z.string(),
    }),
});

export default function EditPropertyPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();

    const propertyRef = useMemoFirebase(() => {
        if (!firestore || !params.id) return null;
        return doc(firestore, 'properties', params.id);
    }, [firestore, params.id]);

    const { data: property, isLoading } = useDoc<Property>(propertyRef);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: property || {},
    });

    // When the property data loads, reset the form with the new data
    useEffect(() => {
        if (property) {
            form.reset(property);
        }
    }, [property, form]);


    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!firestore || !params.id) {
            toast({
                variant: "destructive",
                title: "Database Error",
                description: "Could not connect to the database.",
            });
            return;
        }

        try {
            const propertyDoc = doc(firestore, 'properties', params.id);
            await updateDocumentNonBlocking(propertyDoc, {
                ...values,
                updatedAt: serverTimestamp(),
            });

            toast({
                title: "Property Updated",
                description: `The property "${values.title}" has been successfully updated.`,
            });
            router.push('/admin/properties');
        } catch (error) {
            console.error("Error updating property: ", error);
            toast({
                variant: "destructive",
                title: "Submission Error",
                description: "An error occurred while updating the property.",
            });
        }
    }
    
    // For simplicity, we're using all placeholder images for selection.
    const availableImages = PlaceHolderImages.filter(p => p.id.startsWith('property-'));

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (!property) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Property Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The property you are trying to edit does not exist.</p>
                    <Button onClick={() => router.push('/admin/properties')} className="mt-4">Back to Properties</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Property</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Modern Family Home in Suburbia" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the property in detail..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="House">House</SelectItem>
                                        <SelectItem value="Apartment">Apartment</SelectItem>
                                        <SelectItem value="Condo">Condo</SelectItem>
                                        <SelectItem value="Land">Land</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="For Sale">For Sale</SelectItem>
                                        <SelectItem value="For Rent">For Rent</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 450000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size (sqft)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 2200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="bedrooms"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bedrooms</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bathrooms"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bathrooms</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                <FormItem className="lg:col-span-2">
                                    <FormLabel>Location / Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 123 Main St, Minneapolis, MN" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="amenities"
                            render={() => (
                                <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Amenities</FormLabel>
                                    <FormDescription>Select the amenities available at the property.</FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {allAmenities.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="amenities"
                                        render={({ field }) => {
                                        return (
                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value || []), item.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== item.id
                                                            )
                                                            )
                                                    }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                            </FormItem>
                                        )
                                        }}
                                    />
                                    ))}
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="images"
                            render={() => (
                                <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Property Images</FormLabel>
                                    <FormDescription>Select images for the property gallery. The first selected image will be the main image.</FormDescription>
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
                                    {availableImages.map((image) => (
                                    <FormField
                                        key={image.id}
                                        control={form.control}
                                        name="images"
                                        render={({ field }) => {
                                        return (
                                            <FormItem key={image.id} className="relative aspect-square">
                                                <FormControl>
                                                    <Checkbox
                                                        className="absolute top-2 right-2 z-10 h-5 w-5 bg-background"
                                                        checked={field.value?.includes(image.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                            ? field.onChange([...(field.value || []), image.id])
                                                            : field.onChange(
                                                                field.value?.filter((value) => value !== image.id)
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                                <img src={image.imageUrl} alt={image.description} className="w-full h-full object-cover rounded-md" />
                                            </FormItem>
                                        )
                                        }}
                                    />
                                    ))}
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Featured Property</FormLabel>
                                    <FormDescription>
                                    Mark this property to show it in the "Featured Properties" section on the homepage.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
