"use client";
import { CharacterStatus, type CharacterTheme } from "@/lib/types";
import { characterStatusLabel, THEME_PRESETS } from "@/lib/constants";
import { useCharacterForm } from "./useCharacterForm";

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
  } = useCharacterForm(defaultValues);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(getFormData());
  }

  const inputClass =
    "bg-gray-800 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 w-full";
  const labelClass = "text-sm text-white/70";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
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
        <label htmlFor="thumbnailUrl" className={labelClass}>
          Thumbnail URL
        </label>
        <input
          id="thumbnailUrl"
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-4 h-4 accent-white"
        />
        <label htmlFor="isPublic" className={labelClass}>
          Public
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Theme</span>
        <div className="flex gap-3 flex-wrap">
          {THEME_PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPresetIndex(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
                presetIndex === i
                  ? "border-white text-white"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
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
            className="px-4 py-2 rounded border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-sm text-white/80"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="text-white/40 hover:text-white transition-colors leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-white text-gray-950 font-semibold rounded px-4 py-2 hover:bg-white/90 disabled:opacity-50 transition-colors self-start"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
