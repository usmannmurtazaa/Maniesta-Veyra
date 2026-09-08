import { NextRequest, NextResponse } from 'next/server';
import { uploadToPublicBucket } from '@/lib/storage/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'No preview image provided' } },
        { status: 400 }
      );
    }

    const { url } = await uploadToPublicBucket(file, 'custom-previews');
    return NextResponse.json({ data: { url } });
  } catch (error) {
    console.error('Preview upload error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Preview upload failed' } },
      { status: 500 }
    );
  }
}