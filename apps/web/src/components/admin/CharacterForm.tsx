"use client";
import { CharacterStatus, type CharacterTheme } from "@/lib/types";
import { characterStatusLabel, THEME_PRESETS } from "@/lib/constants";
import { useCharacterForm } from "./useCharacterForm";
import { FileUpload } from "./FileUpload";

export type CharacterFormData = {
  name: string;
  system: string;
  campaign: string;
  status: CharacterStatus;
  bio: string;
  personality: string;
  thumbnailUrl: string;
  isPublic: boolean;
  theme: CharacterTheme;
  tags: string[];
};

type CharacterFormProps = {
  defaultValues?: Partial<CharacterFormData>;
  onSubmit: (data: CharacterFormData) => void;
  isPending: boolean;
  error?: string | null;
  submitLabel: string;
};

const inputClass =
  "bg-gray-800 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 w-full";
const labelClass = "text-sm text-white/70";

export function CharacterForm({
  defaultValues,
  onSubmit,
  isPending,
  error,
  submitLabel,
}: CharacterFormProps) {
  const {
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
  } = useCharacterForm(defaultValues);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(getFormData());
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="system" className={labelClass}>
            System *
          </label>
          <input
            id="system"
            type="text"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="campaign" className={labelClass}>
            Campaign
          </label>
          <input
            id="campaign"
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as CharacterStatus)}
            className={inputClass}
          >
            {Object.values(CharacterStatus).map((s) => (
              <option key={s} value={s}>
                {characterStatusLabel[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className={labelClass}>
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="personality" className={labelClass}>
          Personality
        </label>
        <textarea
          id="personality"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <FileUpload
          accept="image/jpeg,image/png,image/webp,image/gif"
          onUpload={(url) => setThumbnailUrl(url)}
          label="Thumbnail"
          displayValue={defaultValues?.thumbnailUrl?.split("/").pop()}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 accent-white"
        />
        <label htmlFor="isPublic" className={labelClass}>
          Public
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Theme</span>
        <div className="flex flex-wrap gap-3">
          {THEME_PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPresetIndex(i)}
              className={`flex items-center gap-2 rounded border px-3 py-2 text-sm transition-colors ${
                presetIndex === i
                  ? "border-white text-white"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: preset.theme.accentColor }}
              />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Tags</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag…"
            className={`${inputClass} flex-1`}
            aria-label="Tag input"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded border border-white/20 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-sm text-white/80"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="leading-none text-white/40 transition-colors hover:text-white"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-white px-4 py-2 font-semibold text-gray-950 transition-colors hover:bg-white/90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
