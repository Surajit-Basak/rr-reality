
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

const imageObjectSchema = z.object({
    id: z.string(),
    alt: z.string().min(1, "Alt text is required."),
});

const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    slug: z.string().min(3, { message: "Slug must be at least 3 characters." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase and contain only letters, numbers, and hyphens."}),
    description: z.string().min(20, { message: "Description must be at least 20 characters." }),
    type: z.enum(["House", "Apartment", "Condo", "Land", "Townhouse", "Multi-Family", "Other"]),
    status: z.enum(["For Sale", "For Rent"]),
    price: z.coerce.number().min(1, { message: "Price must be a positive number." }),
    bedrooms: z.coerce.number().int().min(0),
    bathrooms: z.coerce.number().int().min(1),
    size: z.coerce.number().int().min(100, { message: "Size must be at least 100 sqft." }),
    location: z.string().min(5, { message: "Location is required." }),
    amenities: z.array(z.string()).optional(),
    images: z.array(imageObjectSchema).min(1, { message: "Please select at least one image and provide alt text." }),
    featured: z.boolean().default(false),
    agent: z.object({
        name: z.string(),
        avatar: z.string(),
    }),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
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
    
    useEffect(() => {
        if (property) {
            form.reset(property);
        }
    }, [property, form]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue("title", e.target.value);
        const slug = e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        form.setValue("slug", slug);
    };

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
    
    const availableImages = PlaceHolderImages.filter(p => p.id.startsWith('property-'));
    const selectedImageIds = form.watch('images')?.map(img => img.id) || [];

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
                         <div className="grid md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Property Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Modern Family Home in Suburbia" {...field} onChange={handleTitleChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL Slug</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>Unique URL-friendly identifier for the property.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                                        <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
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
                            render={({ field }) => (
                                <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Property Images</FormLabel>
                                    <FormDescription>Select images and provide alt text. The first selected image will be the main image.</FormDescription>
                                </div>
                                <div className="space-y-4">
                                    {form.watch('images')?.map((imageObj, index) => {
                                        const image = availableImages.find(img => img.id === imageObj.id);
                                        return image ? (
                                            <div key={imageObj.id} className="flex items-center gap-4 p-2 border rounded-lg">
                                                <img src={image.imageUrl} alt={image.description} className="w-20 h-20 object-cover rounded-md" />
                                                <div className="flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`images.${index}.alt`}
                                                        render={({ field: altField }) => (
                                                            <FormItem>
                                                                <FormLabel>Alt Text</FormLabel>
                                                                <FormControl>
                                                                    <Input {...altField} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 mt-4">
                                    {availableImages.map((image) => (
                                    <div key={image.id} className="relative aspect-square">
                                        <Checkbox
                                            className="absolute top-2 right-2 z-10 h-5 w-5 bg-background"
                                            checked={selectedImageIds.includes(image.id)}
                                            onCheckedChange={(checked) => {
                                                const currentImages = field.value || [];
                                                if (checked) {
                                                    const newImage = { id: image.id, alt: `${form.getValues('title')} - ${image.description}` };
                                                    field.onChange([...currentImages, newImage]);
                                                } else {
                                                    field.onChange(currentImages.filter((img) => img.id !== image.id));
                                                }
                                            }}
                                        />
                                        <img src={image.imageUrl} alt={image.description} className="w-full h-full object-cover rounded-md" />
                                    </div>
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

                        <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="font-medium text-lg">SEO Settings</h3>
                             <FormField
                                control={form.control}
                                name="seoTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SEO Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Custom title for search engines" />
                                        </FormControl>
                                        <FormDescription>
                                            If empty, the property title will be used.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="seoDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SEO Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Custom description for search engines" />
                                        </FormControl>
                                        <FormDescription>
                                            A short summary of the property (around 155 characters).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

    