"use client";

import { useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCroppedWebpFile } from "@/lib/crop-image";

type CropImageModalProps = {
  file: File;
  aspect: number;
  title?: string;
  onCancel: () => void;
  onComplete: (file: File) => void;
};

export function CropImageModal({
  file,
  aspect,
  title = "Uredi sliku",
  onCancel,
  onComplete,
}: CropImageModalProps) {
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleConfirm() {
    if (!croppedAreaPixels) {
      setErrorMessage("Prvo namjesti sliku.");
      return;
    }

    setIsCropping(true);
    setErrorMessage("");

    try {
      const outputWidth = aspect > 1 ? 2000 : 1100;

      const croppedFile = await getCroppedWebpFile(file, croppedAreaPixels, {
        aspect,
        quality: aspect > 1 ? 0.88 : 0.86,
        prefix: aspect > 1 ? "hero" : "product",
        outputWidth,
      });

      URL.revokeObjectURL(imageUrl);
      onComplete(croppedFile);
    } catch (error) {
      console.error(error);
      setErrorMessage("Slika nije obrađena. Pokušaj drugu sliku.");
      setIsCropping(false);
    }
  }

  function handleCancel() {
    URL.revokeObjectURL(imageUrl);
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
            <p className="text-sm text-neutral-500">
              Pomjeri sliku i podesi zoom prije uploada.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[60vh] min-h-[360px] bg-neutral-950">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            showGrid
          />
        </div>

        <div className="space-y-4 border-t p-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-800">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleCancel}
              disabled={isCropping}
            >
              Preskoči
            </Button>

            <Button
              type="button"
              className="rounded-full"
              onClick={handleConfirm}
              disabled={isCropping}
            >
              {isCropping ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Obrađujem...
                </>
              ) : (
                "Sačuvaj crop"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
