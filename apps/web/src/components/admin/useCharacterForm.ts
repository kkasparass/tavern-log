import { useState } from "react";
import { CharacterStatus, type CharacterTheme } from "@/lib/types";
import { THEME_PRESETS } from "@/lib/constants";
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
  const [thumbnailUrl, setThumbnailUrl] = useState(defaultValues?.thumbnailUrl ?? "");
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

  function getFormData(): CharacterFormData {
    return {
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
    };
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
    thumbnailUrl,
    setThumbnailUrl,
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
    getFormData,
  };
}
