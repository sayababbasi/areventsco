import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToSupabaseStorage, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "gallery";
    const altText = (formData.get("altText") as string) || "";
    const title = (formData.get("title") as string) || "";
    const category = (formData.get("category") as string) || "General";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided for upload." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF, SVG, PDF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds 5MB limit.`,
        },
        { status: 400 }
      );
    }

    // Convert file to binary Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate clean, SEO-friendly file path
    const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const uniquePath = `${folder}/${baseName}-${Date.now()}.${extension}`;

    // Upload to Supabase Storage
    const uploadResult = await uploadToSupabaseStorage({
      buffer,
      path: uniquePath,
      contentType: file.type,
    });

    // Save as MediaAsset record in DB
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        title: title || file.name,
        altText: altText || `${baseName.replace(/-/g, " ")} setup in Islamabad`,
        url: uploadResult.url,
        category: category,
        mimeType: file.type,
        fileSize: file.size,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        mediaAsset,
        url: uploadResult.url,
        path: uploadResult.path,
      },
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
