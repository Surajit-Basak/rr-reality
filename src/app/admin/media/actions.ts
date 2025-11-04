'use server';

import { getStorage } from 'firebase-admin/storage';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { firebaseConfig } from '@/firebase/config';
import { ImagePlaceholder } from '@/lib/placeholder-images';
import * as fs from 'fs/promises';
import * as path from 'path';

// Initialize Firebase Admin SDK on the server
// This should only run once.
if (!getApps().length) {
  initializeApp({
    storageBucket: firebaseConfig.storageBucket,
  });
}

export async function uploadImage(formData: FormData): Promise<{ newImage?: ImagePlaceholder, error?: string }> {
  const file = formData.get('file') as File;
  const id = formData.get('id') as string;
  const altText = formData.get('altText') as string;

  if (!file || !id || !altText) {
    return { error: 'Missing file, id, or alt text.' };
  }

  try {
    const bucket = getStorage().bucket();
    const filePath = `property-images/${id}`;
    const fileBuffer = await file.arrayBuffer();

    // 1. Upload to Firebase Storage
    await bucket.file(filePath).save(Buffer.from(fileBuffer), {
        metadata: {
            contentType: file.type,
        },
    });
    
    // 2. Get the public URL
    const [downloadURL] = await bucket.file(filePath).getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // A far-future date
    });
    
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
    // Be careful not to leak sensitive server error details to the client.
    return { error: error.message || 'An unknown error occurred during upload.' };
  }
}
