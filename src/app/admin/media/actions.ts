
'use server';

import { getStorage } from 'firebase-admin/storage';
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';
import { ImagePlaceholder } from '@/lib/placeholder-images';
import * as fs from 'fs/promises';
import * as path from 'path';

function initializeFirebaseAdmin() {
  if (!getApps().length) {
    // In a real Google Cloud environment (like App Hosting), the SDK can auto-detect credentials.
    // For local development or other environments, you'd use a service account.
    try {
        initializeApp({
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
    }
  }
  return getApp();
}

export async function uploadImage(formData: FormData): Promise<{ newImage?: ImagePlaceholder, error?: string }> {
  const file = formData.get('file') as File;
  const id = formData.get('id') as string;
  const altText = formData.get('altText') as string;

  if (!file || !id || !altText) {
    return { error: 'Missing file, id, or alt text.' };
  }

  try {
    const adminApp = initializeFirebaseAdmin();
    const bucket = getStorage(adminApp).bucket();
    const filePath = `property-images/${id}`;
    const fileBuffer = await file.arrayBuffer();

    // 1. Upload to Firebase Storage
    await bucket.file(filePath).save(Buffer.from(fileBuffer), {
        metadata: {
            contentType: file.type,
        },
    });
    
    // Make the file public to get a predictable URL
    await bucket.file(filePath).makePublic();
    
    // 2. Get the public URL (this format is standard for public files)
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
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
    
    data.placeholderImages.unshift(newImage);

    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));

    return { newImage };

  } catch (error: any) {
    console.error("Server-side upload error:", error);
    return { error: error.message || 'An unknown error occurred during upload.' };
  }
}
