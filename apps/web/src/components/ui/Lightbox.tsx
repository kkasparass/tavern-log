"use client";
import { useEffect } from "react";

interface LightboxProps {
  src: string;
  onClose: () => void;
  altText?: string;
}

export function Lightbox({ src, onClose, altText = "" }: LightboxProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={altText}
        className="max-h-[90vh] max-w-[90vw] rounded object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
