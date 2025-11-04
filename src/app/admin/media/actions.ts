'use server';

import { storage } from '@/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImagePlaceholder } from '@/lib/placeholder-images';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function uploadImage(formData: FormData): Promise<{ newImage?: ImagePlaceholder, error?: string }> {
  const file = formData.get('file') as File;
  const id = formData.get('id') as string;
  const altText = formData.get('altText') as string;

  if (!file || !id || !altText) {
    return { error: 'Missing file, id, or alt text.' };
  }

  try {
    // 1. Upload to Firebase Storage
    const storageRef = ref(storage, `property-images/${id}`);
    const fileBuffer = await file.arrayBuffer();
    const uploadResult = await uploadBytes(storageRef, fileBuffer, { contentType: file.type });
    
    // 2. Get the public URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // 3. Create the new image placeholder object
    const newImage: ImagePlaceholder = {
      id: id,
      description: altText,
      imageUrl: downloadURL,
      imageHint: "custom upload"
    };
    
    // 4. Update the placeholder-images.json file
    const jsonPath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');
    const jsonFileContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(jsonFileContent);
    
    // Add the new image to the beginning of the array
    data.placeholderImages.unshift(newImage);

    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));

    return { newImage };

  } catch (error: any) {
    console.error("Server-side upload error:", error);
    return { error: error.message || 'An unknown error occurred during upload.' };
  }
}
