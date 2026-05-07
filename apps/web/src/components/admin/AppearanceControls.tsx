"use client";
import { useTransition } from "@/components/transitions/TransitionProvider";
import {
  DecorationSetId,
  TransitionId,
  decorationLabel,
  transitionLabel,
} from "@/lib/themes/types";
import type { ThemeConfig } from "@/lib/themes/types";
import { Select } from "@/components/ui/Select";

type Props = {
  value: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
};

const labelClass = "text-sm text-white/70";

const transitionOptions = Object.values(TransitionId).map((id) => ({
  value: id,
  label: transitionLabel(id),
}));

const decorationOptions = Object.values(DecorationSetId).map((id) => ({
  value: id,
  label: decorationLabel(id),
}));

export function AppearanceControls({ value, onChange }: Props) {
  const { preview } = useTransition();

  function setField<K extends keyof ThemeConfig>(field: K, val: ThemeConfig[K]) {
    onChange({ ...value, [field]: val, preset: "custom" });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="bgPattern" className={labelClass}>
            Background Pattern
          </label>
          <Select
            id="bgPattern"
            value={value.bgPattern === "none" ? "" : value.bgPattern}
            onChange={(val) => setField("bgPattern", val || "none")}
            options={[]}
            placeholder="None"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="transition" className={labelClass}>
            Transition
          </label>
          <Select
            id="transition"
            value={value.transition ?? ""}
            onChange={(val) => setField("transition", (val || null) as ThemeConfig["transition"])}
            options={transitionOptions}
            placeholder="None"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="decorations" className={labelClass}>
            Decorations
          </label>
          <Select
            id="decorations"
            value={value.decorations ?? ""}
            onChange={(val) => setField("decorations", (val || null) as ThemeConfig["decorations"])}
            options={decorationOptions}
            placeholder="None"
          />
        </div>
      </div>

      <div>
        <button
          type="button"
          disabled={value.transition === null}
          onClick={() => value.transition && preview(value.transition)}
          className="rounded border border-white/20 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Preview transition
        </button>
      </div>
    </div>
  );
}
