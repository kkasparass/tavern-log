"use client";
import { useEffect, useRef, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File | null) => void;
  label?: string;
  displayValue?: string;
  previewUrl?: string;
}

export function FileUpload({ accept, onFileSelect, label = "Upload file", displayValue, previewUrl }: FileUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const shownFileName = selectedFileName ?? displayValue ?? null;
  const shownPreviewUrl = localPreviewUrl ?? previewUrl ?? null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFileName(null);
      setLocalPreviewUrl(null);
      onFileSelect(null);
      return;
    }
    setSelectedFileName(file.name);
    setLocalPreviewUrl(URL.createObjectURL(file));
    onFileSelect(file);
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-white/70">{label}</label>
      <div className="flex w-full items-center gap-0 rounded border border-white/10 bg-gray-800 text-sm text-white">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-l border-r border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
        >
          Choose file
        </button>
        <span className="truncate px-3 py-2 text-sm text-white/50">
          {shownFileName ?? "No file chosen"}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {accept.includes("image") && shownPreviewUrl && (
        <>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="mt-2 cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shownPreviewUrl} alt="" className="h-12 w-12 rounded object-cover" />
          </button>
          {lightboxOpen && (
            <Lightbox src={shownPreviewUrl} onClose={() => setLightboxOpen(false)} />
          )}
        </>
      )}
    </div>
  );
}
