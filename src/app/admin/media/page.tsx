
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePenLine, UploadCloud } from 'lucide-react';
import { EditMediaDialog } from './edit-dialog';

export default function MediaPage() {
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (image: ImagePlaceholder) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>View and manage your placeholder images.</CardDescription>
            </div>
            <Button disabled>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload New Media
            </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {PlaceHolderImages.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={image.imageHint}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(image)}>
                    <FilePenLine className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white truncate">{image.id}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedImage && (
        <EditMediaDialog
          image={selectedImage}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
        />
      )}
    </>
  );
}
