"use client";

import imageCompression from "browser-image-compression";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_ORIGINAL_SIZE_MB = 12;

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Dozvoljene su JPG, PNG, WebP i iPhone HEIC/HEIF slike.");
  }

  const sizeInMb = file.size / 1024 / 1024;

  if (sizeInMb > MAX_ORIGINAL_SIZE_MB) {
    throw new Error("Slika je prevelika. Maksimalna veličina je 12 MB.");
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function renameToWebp(file: File, prefix: string) {
  const cleanName =
    file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image";

  return `${prefix}-${Date.now()}-${cleanName}.webp`;
}

export async function compressProductImage(file: File): Promise<File> {
  validateImageFile(file);

  const compressedBlob = await imageCompression(file, {
    maxSizeMB: 0.35,
    maxWidthOrHeight: 1600,
    initialQuality: 0.82,
    useWebWorker: false,
    fileType: "image/webp",
  });

  return new File([compressedBlob], renameToWebp(file, "product"), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export async function compressHeroImage(file: File): Promise<File> {
  validateImageFile(file);

  const compressedBlob = await imageCompression(file, {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 2200,
    initialQuality: 0.86,
    useWebWorker: false,
    fileType: "image/webp",
  });

  return new File([compressedBlob], renameToWebp(file, "hero"), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}
