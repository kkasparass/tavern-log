"use client";
import { useRef, useState } from "react";

interface FileUploadProps {
  accept: string;
  onUpload: (url: string) => void;
  label?: string;
  displayValue?: string;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

export function FileUpload({ accept, onUpload, label = "Upload file", displayValue }: FileUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const shownFileName = selectedFileName ?? displayValue ?? null;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setStatus("uploading");
    setErrorMessage(null);

    try {
      const presignRes = await fetch("/api/admin/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (!presignRes.ok) {
        const data = await presignRes.json();
        throw new Error(data.error ?? "Failed to get upload URL");
      }

      const { uploadUrl, objectUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error("Upload to storage failed");
      }

      onUpload(objectUrl);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-white/70">{label}</label>
      <div className="flex w-full items-center gap-0 rounded border border-white/10 bg-gray-800 text-sm text-white">
        <button
          type="button"
          disabled={status === "uploading"}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-l border-r border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
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
        disabled={status === "uploading"}
        onChange={handleChange}
        className="hidden"
      />
      {status === "uploading" && <p className="mt-1 text-sm text-white/50">Uploading…</p>}
      {status === "done" && <p className="mt-1 text-sm text-green-400/70">Uploaded ✓</p>}
      {status === "error" && <p className="mt-1 text-sm text-red-400">{errorMessage}</p>}
    </div>
  );
}
