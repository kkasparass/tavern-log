"use client";
import { Suspense } from "react";
import { getDecoration } from "@/lib/themes/decorations";
import type { DecorationSetId, DecorationSlotName } from "@/lib/themes/types";

type Props = {
  slot: DecorationSlotName;
  decorationSet: DecorationSetId | null;
};

export function DecorationSlot({ slot, decorationSet }: Props) {
  if (!decorationSet) return null;

  const Component = getDecoration(decorationSet, slot);
  if (!Component) return null;

  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}
