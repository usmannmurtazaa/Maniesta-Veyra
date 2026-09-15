import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { uploadToPublicBucket } from "@/lib/storage/upload";
import { rateLimiters } from "@/lib/security/rate-limit";

// Preview images are canvas exports from the customizer — PNG only.
// Limit size tightly since a preview thumbnail should never be large.
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_PREVIEW_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(request: NextRequest) {
  try {
    // ---- Rate limit ----
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "anonymous";
    const limitResult = await rateLimiters.upload.limit(`preview:${ip}`);
    if (!limitResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Too many uploads. Please try again later.",
          },
        },
        { status: 429 },
      );
    }

    // ---- Reject oversized requests early ----
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_PREVIEW_SIZE + 100_000) {
      // 100 KB headroom for multipart boundaries
      return NextResponse.json(
        {
          error: {
            code: "FILE_TOO_LARGE",
            message: "Preview image exceeds 2 MB limit",
          },
        },
        { status: 413 },
      );
    }

    // ---- Parse form data ----
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "No preview image provided",
          },
        },
        { status: 400 },
      );
    }

    // ---- Size check (also enforced by Netlify/Next) ----
    if (file.size > MAX_PREVIEW_SIZE) {
      return NextResponse.json(
        {
          error: {
            code: "FILE_TOO_LARGE",
            message: "Preview image exceeds 2 MB limit",
          },
        },
        { status: 413 },
      );
    }

    // ---- Magic-byte check (do not trust the client's Content-Type) ----
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Preview must be a PNG, JPEG, or WebP image",
          },
        },
        { status: 400 },
      );
    }

    // ---- Reconstruct the File with a safe name ----
    // Never pass a user-controlled filename to storage. Generate one.
    const safeName = `preview-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${detected.ext}`;
    const safeFile = new File([arrayBuffer], safeName, { type: detected.mime });

    const { url } = await uploadToPublicBucket(safeFile, "custom-previews");
    return NextResponse.json({ data: { url } });
  } catch (error) {
    console.error("[custom/preview] upload failed:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Preview upload failed" } },
      { status: 500 },
    );
  }
}
