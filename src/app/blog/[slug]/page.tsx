

'use client';

import { notFound } from "next/navigation";
import Image from "next/image";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import type { BlogPost } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

// This function is commented out as it requires a different setup for dynamic server-side generation
// with client-side data fetching hooks. We'll manage metadata within the client component.
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   // In a full server component, you would fetch data here
//   // For now, we are using a client-side approach
//   return {
//     title: 'Blog Post',
//   };
// }

export default function BlogPostPage({ params }: Props) {
  const firestore = useFirestore();

  const blogPostQuery = useMemoFirebase(() => {
    if (!firestore || !params.slug) return null;
    return query(collection(firestore, 'blog_posts'), where('slug', '==', params.slug), limit(1));
  }, [firestore, params.slug]);

  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostQuery);

  const post = posts?.[0];

  // Dynamically set page title and description
  if (post) {
      document.title = post.seoTitle || post.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
          metaDescription.setAttribute('content', post.seoDescription || post.content.substring(0, 160));
      }
  }


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
        <Skeleton className="h-[50vh] w-full rounded-lg mb-8" />
        <div className="space-y-4 prose prose-lg max-w-none mx-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const imagePlaceholder = post.imageUrl ? PlaceHolderImages.find(p => p.id === post.imageUrl.id) : undefined;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.publicationDate ? post.publicationDate.toDate().toISOString() : undefined}>
                        {post.publicationDate ? new Date(post.publicationDate.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </time>
                </div>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </header>

          {imagePlaceholder && post.imageUrl && (
            <div className="relative h-[50vh] w-full rounded-lg overflow-hidden mb-12 shadow-lg">
              <Image src={imagePlaceholder.imageUrl} alt={post.imageUrl.alt} fill className="object-cover" data-ai-hint={imagePlaceholder.imageHint} />
            </div>
          )}
          
          {/* Using a simple div and whitespace style to render paragraphs from the content */}
          <div 
            className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
            style={{ whiteSpace: 'pre-line' }}
          >
            {post.content}
          </div>
          
           <div className="mt-12 text-center">
              <Button asChild>
                <Link href="/blog">Back to Blog</Link>
              </Button>
            </div>

        </article>
      </div>
    </div>
  );
}

    