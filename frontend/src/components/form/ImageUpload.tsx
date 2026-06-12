import { useRef } from "react";

const MAX_DIMENSION = 400;
const JPEG_QUALITY = 0.8;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB raw limit before resize

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = img;
      const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not available")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Could not load image")); };
    img.src = objectUrl;
  });
}

type ImageUploadProps = {
  value: string | null | undefined;
  onChange: (dataUrl: string | null) => void;
  initials: string;
  error?: string;
};

export function ImageUpload({ value, onChange, initials, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPEG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      alert("File is too large. Please choose an image smaller than 5 MB.");
      return;
    }
    try {
      const dataUrl = await resizeToDataUrl(file);
      onChange(dataUrl);
    } catch {
      alert("Could not process the image. Please try a different file.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
      <div className="relative shrink-0">
        {value ? (
          <img
            src={value}
            alt="Profile photo"
            className="size-24 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
        ) : (
          <span className="grid size-24 place-items-center rounded-full bg-brand-500 text-2xl font-semibold text-white ring-2 ring-gray-200 dark:ring-gray-700">
            {initials || "?"}
          </span>
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-error-500 text-white shadow hover:bg-error-600"
            aria-label="Remove photo"
          >
            <svg viewBox="0 0 12 12" className="size-3 fill-current" aria-hidden="true">
              <path d="M10 2L6 6M6 6L2 10M6 6L2 2M6 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {value ? "Change photo" : "Upload photo"}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          JPEG, PNG, or WebP · Max 5 MB · Auto-resized to 400 px
        </p>
        {error && <p className="text-xs text-error-500">{error}</p>}
      </div>
    </div>
  );
}
