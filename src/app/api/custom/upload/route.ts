import { NextRequest, NextResponse } from 'next/server';
import { validateUpload } from '@/lib/security/upload-validation';
import { uploadToPrivateBucket } from '@/lib/storage/upload';
import { rateLimiters } from '@/lib/security/rate-limit';

// Must match the limit inside `validateUpload`. Kept here so we can reject
// oversized requests before reading the body into memory.
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const MULTIPART_OVERHEAD = 100 * 1024; // 100 KB headroom for boundaries

export async function POST(request: NextRequest) {
  try {
    // ---- 1. Rate limit ----
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'anonymous';
    const limitResult = await rateLimiters.upload.limit(`design:${ip}`);
    if (!limitResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many uploads. Please try again later.',
          },
        },
        { status: 429 }
      );
    }

    // ---- 2. Reject oversized requests BEFORE reading the body ----
    // This is the critical protection against Lambda OOM. Without it, a
    // large file is fully buffered into memory before validation can run.
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_UPLOAD_BYTES + MULTIPART_OVERHEAD) {
      return NextResponse.json(
        {
          error: {
            code: 'FILE_TOO_LARGE',
            message: `File exceeds ${MAX_UPLOAD_BYTES / 1024 / 1024} MB limit`,
          },
        },
        { status: 413 }
      );
    }

    // ---- 3. Parse form data ----
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No file provided',
          },
        },
        { status: 400 }
      );
    }

    // ---- 4. Deep validation (magic bytes, dimensions, SVG safety) ----
    const validation = await validateUpload(file);
    if (!validation.valid) {
      console.warn('[custom/upload] rejected:', validation.error);
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error ?? 'Invalid file',
          },
        },
        { status: 400 }
      );
    }

    // ---- 5. Upload to private bucket ----
    // The storage helper generates a UUID filename internally, so we don't
    // pass the client's filename through. Response also omits it.
    const { url, pathname } = await uploadToPrivateBucket(
      file,
      'customer-designs'
    );

    console.log(
      `[custom/upload] stored ${pathname} (${file.size} bytes, ${file.type || 'unknown'})`
    );

    return NextResponse.json({
      data: {
        url,
        pathname,
        fileSize: file.size,
        mimeType: file.type,
        dimensions: validation.dimensions,
      },
    });
  } catch (error) {
    console.error('[custom/upload] failed:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Upload failed',
        },
      },
      { status: 500 }
    );
  }
}