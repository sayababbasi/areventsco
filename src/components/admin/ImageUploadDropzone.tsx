"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "gallery" | "packages" | "themes" | "services" | "addons" | "venues" | "branding";
  altText?: string;
  label?: string;
  className?: string;
}

export default function ImageUploadDropzone({
  value,
  onChange,
  folder = "gallery",
  altText = "AR Events Co setup",
  label = "Upload Image to Supabase Storage",
  className = "",
}: ImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, AVIF, and SVG images are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("altText", altText);
      formData.append("title", file.name);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data?.url) {
        onChange(json.data.url);
      } else {
        setError(json.error || "Failed to upload image to Supabase Storage.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-brand-navy-900 uppercase tracking-wider">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group w-full h-48 rounded-xl overflow-hidden border border-brand-navy-200 bg-brand-navy-900/5 flex items-center justify-center">
          <Image
            src={value}
            alt={altText}
            fill
            className="object-cover"
            unoptimized={value.startsWith("data:") || value.includes("supabase.co")}
          />
          <div className="absolute inset-0 bg-brand-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-gold text-xs px-3 py-1.5 flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Image</span>
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-rose-500/80 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Supabase Stored</span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-44 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
            isDragOver
              ? "border-brand-gold-500 bg-brand-gold-500/10 scale-[1.01]"
              : "border-brand-navy-200 hover:border-brand-gold-500/60 bg-white hover:bg-brand-warm-50/50"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-brand-gold-500 animate-spin" />
              <span className="text-xs font-semibold text-brand-navy-800">
                Uploading to Supabase Storage...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-gold-500/10 text-brand-gold-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-navy-950">
                  Click to upload
                </span>{" "}
                <span className="text-xs text-brand-navy-600">or drag and drop</span>
              </div>
              <p className="text-[11px] text-brand-navy-600">
                PNG, JPG, WebP, AVIF up to 5MB (Saved to Supabase Bucket)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
}
