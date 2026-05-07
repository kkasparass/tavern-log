import type { ComponentType } from "react";
import type { DecorationSetId, DecorationSlotName } from "./types";
import { PageEdgeLeft } from "@/components/character/decorations/forest/PageEdgeLeft";
import { PageEdgeRight } from "@/components/character/decorations/forest/PageEdgeRight";
import { HeaderTop } from "@/components/character/decorations/forest/HeaderTop";
import { TabsTop } from "@/components/character/decorations/forest/TabsTop";

type DecorationRegistry = Record<DecorationSetId, Partial<Record<DecorationSlotName, ComponentType>>>;

const registry: DecorationRegistry = {
  forest: {
    "page-edge-left": PageEdgeLeft,
    "page-edge-right": PageEdgeRight,
    "header-top": HeaderTop,
    "tabs-top": TabsTop,
  },
  none: {},
};

export function getDecoration(
  set: DecorationSetId,
  slot: DecorationSlotName
): ComponentType | null {
  return registry[set]?.[slot] ?? null;
}
