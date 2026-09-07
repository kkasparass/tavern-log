"use client";
import { CharacterCard } from "@/components/character/CharacterCard";
import { Select } from "@/components/ui/Select";
import { useTransition } from "@/components/transitions/TransitionProvider";
import { CARD_TEMPLATES, getCardTemplate } from "@/lib/themes/cardTemplates";
import { CardTemplateId } from "@/lib/themes/types";
import type { ResolvedCard, ThemeConfig } from "@/lib/themes/types";
import type { CharacterPreview } from "@/lib/types";

type CardTemplateSectionProps = {
  value: ResolvedCard;
  onChange: (card: ResolvedCard) => void;
  theme: ThemeConfig;
  preview: CharacterPreview;
};

const templateOptions = Object.values(CardTemplateId).map((id) => ({
  value: id,
  label: CARD_TEMPLATES[id].label,
}));

const labelClass = "text-sm text-white/70";

export function CardTemplateSection({
  value,
  onChange,
  theme,
  preview: previewCharacter,
}: CardTemplateSectionProps) {
  const { preview } = useTransition();
  const { SettingsControls } = getCardTemplate(value.template);

  function selectTemplate(raw: string) {
    const template = Object.values(CardTemplateId).find((id) => id === raw);
    if (!template || template === value.template) return;
    onChange({ template, settings: CARD_TEMPLATES[template].defaultSettings });
  }

  function handlePreviewClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Like the theme Preview button: only play when a transition exists,
    // otherwise the overlay has nothing to complete the covering phase with
    if (theme.transition) preview(theme);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="card-template" className={labelClass}>
          Card template
        </label>
        <Select
          id="card-template"
          value={value.template}
          onChange={selectTemplate}
          options={templateOptions}
        />
      </div>

      <SettingsControls
        value={value.settings}
        onChange={(settings) => onChange({ template: value.template, settings })}
      />

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Preview</span>
        <div data-testid="card-template-preview" onClickCapture={handlePreviewClick}>
          <CharacterCard
            {...previewCharacter}
            theme={{ ...previewCharacter.theme, card: value }}
          />
        </div>
      </div>
    </div>
  );
}
