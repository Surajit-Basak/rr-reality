
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImagePlaceholder } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EditMediaDialogProps {
  image: ImagePlaceholder | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditMediaDialog({ image, isOpen, setIsOpen }: EditMediaDialogProps) {
  const [altText, setAltText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // When the dialog opens with a new image, populate the alt text from the image's description.
    // In a real application, this would be the stored alt text.
    if (image) {
      setAltText(image.description);
    }
  }, [image]);

  if (!image) return null;

  const handleSave = () => {
    // In a real application, you would save the 'altText' to your database here.
    // For this demo, we'll just show a toast notification.
    toast({
      title: "Action Not Implemented",
      description: "Saving changes to the alt text is not connected to a backend.",
      variant: "default",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Media</DialogTitle>
          <DialogDescription>
            Update the alt text for this image. Changes are not saved in this demo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src={image.imageUrl} alt={image.description} fill className="object-contain" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altText">Alt Text</Label>
            <Textarea
              id="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              rows={3}
            />
             <p className="text-sm text-muted-foreground">
              Describe the image for screen readers and SEO.
            </p>
          </div>
           <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={image.imageUrl} readOnly />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
