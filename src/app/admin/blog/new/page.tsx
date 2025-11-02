
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    content: z.string().min(50, { message: "Content must be at least 50 characters." }),
    author: z.string().min(2, { message: "Author name is required." }),
    tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)),
    imageUrl: z.string().min(1, { message: "Please select an image." }),
});

export default function NewBlogPostPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            author: "Admin", // Default author
            imageUrl: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!firestore) {
            toast({
                variant: "destructive",
                title: "Database Error",
                description: "Could not connect to the database.",
            });
            return;
        }

        try {
            const blogPostsCollection = collection(firestore, 'blog_posts');
            await addDocumentNonBlocking(blogPostsCollection, {
                ...values,
                publicationDate: serverTimestamp(),
            });

            toast({
                title: "Blog Post Created",
                description: `The post "${values.title}" has been successfully created.`,
            });
            router.push('/admin/blog');
        } catch (error) {
            console.error("Error creating blog post: ", error);
            toast({
                variant: "destructive",
                title: "Submission Error",
                description: "An error occurred while creating the blog post.",
            });
        }
    }
    
    const availableImages = PlaceHolderImages.filter(p => p.id.startsWith('blog-'));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 5 Tips for First-Time Home Buyers" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write your blog post content here..." {...field} rows={15} />
                                    </FormControl>
                                    <FormDescription>
                                        You can use Markdown for formatting.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., market, buying, tips" {...field} />
                                    </FormControl>
                                     <FormDescription>
                                        Enter comma-separated tags.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Featured Image</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-3 md:grid-cols-5 gap-4"
                                    >
                                        {availableImages.map(image => (
                                             <FormItem key={image.id} className="relative aspect-square">
                                                <FormControl>
                                                    <RadioGroupItem value={image.id} id={image.id} className="peer sr-only" />
                                                </FormControl>
                                                <FormLabel htmlFor={image.id} className="block w-full h-full rounded-md overflow-hidden cursor-pointer ring-offset-background peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-ring">
                                                    <img src={image.imageUrl} alt={image.description} className="w-full h-full object-cover" />
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Publishing..." : "Publish Post"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
