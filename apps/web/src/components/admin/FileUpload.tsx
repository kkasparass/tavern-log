"use client";
import { useState } from "react";

interface FileUploadProps {
  accept: string;
  onUpload: (url: string) => void;
  label?: string;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

export function FileUpload({ accept, onUpload, label = "Upload file" }: FileUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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
      <input
        type="file"
        accept={accept}
        disabled={status === "uploading"}
        onChange={handleChange}
        className="w-full rounded border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-white/20 disabled:opacity-50"
      />
      {status === "uploading" && <p className="mt-1 text-sm text-white/50">Uploading…</p>}
      {status === "done" && <p className="mt-1 text-sm text-green-400/70">Uploaded ✓</p>}
      {status === "error" && <p className="mt-1 text-sm text-red-400">{errorMessage}</p>}
    </div>
  );
}
