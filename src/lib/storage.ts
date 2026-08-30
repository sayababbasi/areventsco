import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const DEFAULT_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "arevents-media";

// Singleton Supabase Admin Storage Client
export const supabaseStorage =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "application/pdf",
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface StorageUploadResult {
  url: string;
  path: string;
  bucket: string;
  size: number;
  mimeType: string;
}

/**
 * Upload a binary buffer to Supabase Storage with fallback
 */
export async function uploadToSupabaseStorage({
  buffer,
  path,
  contentType,
  bucketName = DEFAULT_BUCKET,
}: {
  buffer: Buffer;
  path: string;
  contentType: string;
  bucketName?: string;
}): Promise<StorageUploadResult> {
  // 1. Validation
  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    throw new Error(
      `Unsupported file type: ${contentType}. Allowed types: JPEG, PNG, WebP, AVIF, SVG, PDF.`
    );
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size (${(buffer.length / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed limit of 5MB.`
    );
  }

  // 2. Sanitize Path
  const cleanPath = path.replace(/^\/+/, "").replace(/[^a-zA-Z0-9_\-\.\/]/g, "_");

  // 3. If Supabase Client is configured, upload directly to Supabase Storage
  if (supabaseStorage) {
    let { data, error } = await supabaseStorage.storage
      .from(bucketName)
      .upload(cleanPath, buffer, {
        contentType,
        upsert: true,
      });

    // If bucket does not exist, auto-create public bucket and retry
    if (error && (error.message.includes("Bucket not found") || error.message.includes("not found"))) {
      try {
        await supabaseStorage.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: MAX_FILE_SIZE_BYTES,
        });

        const retry = await supabaseStorage.storage
          .from(bucketName)
          .upload(cleanPath, buffer, {
            contentType,
            upsert: true,
          });

        data = retry.data;
        error = retry.error;
      } catch (bucketErr) {
        console.error("Auto bucket creation failed:", bucketErr);
      }
    }

    if (error) {
      throw new Error(`Supabase Storage upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseStorage.storage
      .from(bucketName)
      .getPublicUrl(cleanPath);

    return {
      url: publicUrlData.publicUrl,
      path: cleanPath,
      bucket: bucketName,
      size: buffer.length,
      mimeType: contentType,
    };
  }

  // Fallback for local mock/development environments without live Supabase keys
  return {
    url: `/images/gallery/${cleanPath.split("/").pop() || "upload.webp"}`,
    path: cleanPath,
    bucket: "local-fallback",
    size: buffer.length,
    mimeType: contentType,
  };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromSupabaseStorage(
  path: string,
  bucketName = DEFAULT_BUCKET
): Promise<boolean> {
  if (!supabaseStorage) return true;

  const cleanPath = path.replace(/^\/+/, "");
  const { error } = await supabaseStorage.storage.from(bucketName).remove([cleanPath]);

  if (error) {
    console.error("Failed to delete from Supabase storage:", error.message);
    return false;
  }

  return true;
}
