'use server'

import { put } from '@vercel/blob';

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;

        if (!file || file.size === 0) {
            return { success: false, error: 'No file provided' };
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: 'File type not allowed. Use JPEG, PNG, WebP, or GIF.' };
        }

        // Validate file size (max 4MB)
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (file.size > maxSize) {
            return { success: false, error: 'File too large. Maximum 4MB.' };
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `goat-${timestamp}.${extension}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
        });

        console.log('Image uploaded successfully:', blob.url);
        return { success: true, url: blob.url };
    } catch (error) {
        console.error('Error uploading image:', error);
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        return { success: false, error: errorMessage };
    }
}
