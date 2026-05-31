"use client";

export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

export async function getCroppedWebpFile(
  file: File,
  pixelCrop: PixelCrop,
  options: {
    aspect: number;
    quality?: number;
    prefix?: string;
    outputWidth?: number;
  }
): Promise<File> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await createImage(objectUrl);

    const outputWidth = options.outputWidth ?? 1400;
    const outputHeight = Math.round(outputWidth / options.aspect);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Browser ne podržava obradu slike.");
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error("Crop slike nije uspio."));
            return;
          }

          resolve(result);
        },
        "image/webp",
        options.quality ?? 0.92
      );
    });

    const cleanName =
      file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "image";

    return new File(
      [blob],
      `${options.prefix ?? "image"}-${Date.now()}-${cleanName}.webp`,
      {
        type: "image/webp",
        lastModified: Date.now(),
      }
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
