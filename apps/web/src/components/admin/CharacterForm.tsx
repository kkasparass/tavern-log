"use client";
import { useCharacterForm } from "./useCharacterForm";
import { TagInput } from "./TagInput";
import { FileUpload } from "./FileUpload";
import { ThemeSection } from "./ThemeSection";

export type CharacterFormData = {
  name: string;
  tagline: string;
  pronouns: string;
  designedBy: string;
  bio: string;
  personality: string;
  thumbnailUrl: string;
  isPublic: boolean;
  theme: Record<string, unknown>;
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
    tagline,
    setTagline,
    pronouns,
    setPronouns,
    designedBy,
    setDesignedBy,
    bio,
    setBio,
    personality,
    setPersonality,
    setPendingThumbnailFile,
    isUploading,
    uploadError,
    isPublic,
    setIsPublic,
    theme,
    setTheme,
    tags,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    submitForm,
  } = useCharacterForm(defaultValues);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitForm(onSubmit);
  }

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="flex w-full flex-col gap-6"
    >
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
          <label htmlFor="pronouns" className={labelClass}>
            Pronouns
          </label>
          <input
            id="pronouns"
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tagline" className={labelClass}>
          Tagline
        </label>
        <input
          id="tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          maxLength={140}
          placeholder="A quick intro line shown on the character card"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="designedBy" className={labelClass}>
          Designed by
        </label>
        <input
          id="designedBy"
          type="text"
          value={designedBy}
          onChange={(e) => setDesignedBy(e.target.value)}
          className={inputClass}
        />
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
          onFileSelect={setPendingThumbnailFile}
          label="Thumbnail"
          displayValue={defaultValues?.thumbnailUrl?.split("/").pop()}
          previewUrl={defaultValues?.thumbnailUrl}
        />
        {uploadError && <p className="mt-1 text-sm text-red-400">{uploadError}</p>}
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

      <ThemeSection value={theme} onChange={setTheme} />

      <TagInput
        value={tagInput}
        onValueChange={setTagInput}
        tags={tags}
        onAdd={addTag}
        onRemove={removeTag}
        inputClassName={inputClass}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending || isUploading}
        className="rounded bg-white px-4 py-2 font-semibold text-gray-950 transition-colors hover:bg-white/90 disabled:opacity-50"
      >
        {isPending || isUploading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
