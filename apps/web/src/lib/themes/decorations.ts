import type { ComponentType } from "react";
import { DecorationSlotName } from "./types";
import type { DecorationSetId } from "./types";
import { PageEdgeLeft } from "@/components/character/decorations/forest/PageEdgeLeft";
import { PageEdgeRight } from "@/components/character/decorations/forest/PageEdgeRight";
import { HeaderTop } from "@/components/character/decorations/forest/HeaderTop";
import { TabsTop } from "@/components/character/decorations/forest/TabsTop";

type DecorationRegistry = Record<
  DecorationSetId,
  Partial<Record<DecorationSlotName, ComponentType>>
>;

const registry: DecorationRegistry = {
  forest: {
    [DecorationSlotName.PageEdgeLeft]: PageEdgeLeft,
    [DecorationSlotName.PageEdgeRight]: PageEdgeRight,
    [DecorationSlotName.HeaderTop]: HeaderTop,
    [DecorationSlotName.TabsTop]: TabsTop,
  },
};

export function getDecoration(
  set: DecorationSetId,
  slot: DecorationSlotName
): ComponentType | null {
  return registry[set]?.[slot] ?? null;
}
