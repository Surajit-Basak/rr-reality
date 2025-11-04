'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { uploadImage } from './actions';


interface UploadMediaDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onImageAdd: (image: ImagePlaceholder) => void;
}

export function UploadMediaDialog({ isOpen, setIsOpen, onImageAdd }: UploadMediaDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [id, setId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select a file smaller than 2MB.',
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      // Auto-generate an ID from the file name
      setId(selectedFile.name.toLowerCase().replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleSave = async () => {
    if (!file || !id.trim() || !altText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a file and fill out all fields.',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', id);
      formData.append('altText', altText);
      
      const result = await uploadImage(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      onImageAdd(result.newImage!);

      toast({
        title: "Image Uploaded!",
        description: "The new image has been saved and added to the library.",
      });

      // Reset state and close dialog
      setIsOpen(false);
      setFile(null);
      setPreview(null);
      setAltText('');
      setId('');

    } catch (error: any) {
        console.error("Upload error:", error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: error.message || "There was an error uploading your image. Please try again."
        });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Media</DialogTitle>
          <DialogDescription>
            Select an image file and provide details. This will be saved to Firebase Storage.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="image-upload">Image File</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    {preview ? (
                        <div className="relative w-full h-full">
                            <Image src={preview} alt="Image preview" fill className="object-contain rounded-lg" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-center text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 2MB)</p>
                        </div>
                    )}
                    <Input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} disabled={isUploading} />
                </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="id">Media ID</Label>
            <Input
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g., my-new-image"
              disabled={isUploading}
            />
             <p className="text-sm text-muted-foreground">
              A unique, URL-friendly identifier for this image.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="altText">Alt Text</Label>
            <Textarea
              id="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              rows={3}
              placeholder="A descriptive caption for the image"
              disabled={isUploading}
            />
             <p className="text-sm text-muted-foreground">
              Describe the image for screen readers and SEO.
            </p>
          </div>

        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} disabled={isUploading}>Cancel</Button>
          <Button type="button" onClick={handleSave} disabled={isUploading}>
            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : 'Add to Library'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
