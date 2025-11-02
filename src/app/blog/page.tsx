
'use client';

import Link from "next/link";
import Image from "next/image";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { BlogPost } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function BlogListPage() {
  const firestore = useFirestore();

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blog_posts'), orderBy('publicationDate', 'desc'));
  }, [firestore]);

  const { data: blogPosts, isLoading } = useCollection<BlogPost>(blogPostsQuery);
  
  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Real Estate Insights</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your source for market trends, home buying tips, and selling strategies.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))
          ) : blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => {
              const image = PlaceHolderImages.find(p => p.id === post.imageUrl);
              return (
                <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <Link href={`/blog/${post.id}`} className="block relative h-48 w-full">
                      {image && <Image src={image.imageUrl} alt={post.title} fill className="object-cover" data-ai-hint={image.imageHint} />}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-2">
                       {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="mr-2">{tag}</Badge>
                      ))}
                    </div>
                    <h2 className="text-xl font-semibold text-primary mb-3 flex-grow">
                      <Link href={`/blog/${post.id}`} className="hover:text-secondary transition-colors">{post.title}</Link>
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                        {post.content}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground pt-4 border-t border-gray-100 mt-auto">
                      <span>By {post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.publicationDate ? new Date(post.publicationDate.toDate()).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-20">No blog posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
