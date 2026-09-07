import type { CardTemplateId, SettingsOf } from "@/lib/themes/types";
import type { CharacterPreview } from "@/lib/types";

export type CardComponentProps<T extends CardTemplateId = CardTemplateId> = Omit<
  CharacterPreview,
  "theme"
> & {
  settings: SettingsOf<T>;
};

export type CardSettingsControlsProps<T extends CardTemplateId = CardTemplateId> = {
  value: SettingsOf<T>;
  onChange: (settings: SettingsOf<T>) => void;
};
