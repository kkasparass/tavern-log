import { useState } from "react";
import { CharacterStatus, type CharacterTheme } from "@/lib/types";
import { THEME_PRESETS } from "@/lib/constants";
import { uploadFile } from "@/lib/upload";
import type { CharacterFormData } from "./CharacterForm";

function findPresetIndex(theme: CharacterTheme): number {
  const idx = THEME_PRESETS.findIndex((p) => p.theme.accentColor === theme.accentColor);
  return idx >= 0 ? idx : 0;
}

export function useCharacterForm(defaultValues?: Partial<CharacterFormData>) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [system, setSystem] = useState(defaultValues?.system ?? "");
  const [campaign, setCampaign] = useState(defaultValues?.campaign ?? "");
  const [status, setStatus] = useState<CharacterStatus>(
    defaultValues?.status ?? CharacterStatus.ACTIVE
  );
  const [bio, setBio] = useState(defaultValues?.bio ?? "");
  const [personality, setPersonality] = useState(defaultValues?.personality ?? "");
  const existingThumbnailUrl = defaultValues?.thumbnailUrl ?? "";
  const [pendingThumbnailFile, setPendingThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(defaultValues?.isPublic ?? true);
  const [presetIndex, setPresetIndex] = useState(() =>
    defaultValues?.theme ? findPresetIndex(defaultValues.theme) : 0
  );
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  async function submitForm(onSubmit: (data: CharacterFormData) => void): Promise<void> {
    let thumbnailUrl = existingThumbnailUrl;
    setIsUploading(true);
    setUploadError(null);
    try {
      if (pendingThumbnailFile) {
        thumbnailUrl = await uploadFile(pendingThumbnailFile);
      }
      onSubmit({
      name,
      system,
      campaign,
      status,
      bio,
      personality,
        thumbnailUrl,
        isPublic,
        theme: THEME_PRESETS[presetIndex].theme,
        tags,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return {
    name,
    setName,
    system,
    setSystem,
    campaign,
    setCampaign,
    status,
    setStatus,
    bio,
    setBio,
    personality,
    setPersonality,
    pendingThumbnailFile,
    setPendingThumbnailFile,
    isUploading,
    uploadError,
    isPublic,
    setIsPublic,
    presetIndex,
    setPresetIndex,
    tags,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    handleTagKeyDown,
    submitForm,
  };
}
