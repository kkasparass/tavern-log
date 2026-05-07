import { CharacterStatus } from "./types";

export const characterStatusLabel: Record<CharacterStatus, string> = {
  [CharacterStatus.ACTIVE]: "Active",
  [CharacterStatus.RETIRED]: "Retired",
  [CharacterStatus.DECEASED]: "Deceased",
};

export { THEME_PRESETS } from "./themes/presets";
