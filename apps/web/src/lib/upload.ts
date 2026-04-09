export async function uploadFile(file: File): Promise<string> {
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

  return objectUrl;
}
