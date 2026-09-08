import { NextRequest, NextResponse } from 'next/server';
import { validateUpload } from '@/lib/security/upload-validation';
import { uploadToPrivateBucket } from '@/lib/storage/upload';
import { rateLimiters } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const limiter = rateLimiters.upload;
    const result = await limiter.limit(request.headers.get('x-forwarded-for') || 'anonymous');
    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many uploads. Please try again later.' } },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'No file provided' } },
        { status: 400 }
      );
    }

    const validation = await validateUpload(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: validation.error } },
        { status: 400 }
      );
    }

    // Upload to private bucket
    const { url, pathname } = await uploadToPrivateBucket(file, 'customer-designs');
    return NextResponse.json({
      data: {
        url,
        pathname,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'image/png',
        dimensions: validation.dimensions,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Upload failed' } },
      { status: 500 }
    );
  }
}