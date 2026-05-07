"use client";
import { useTransition } from "@/components/transitions/TransitionProvider";
import type { ThemeConfig } from "@/lib/themes/types";

type Props = {
  value: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
};

const selectClass =
  "bg-gray-800 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 w-full";
const labelClass = "text-sm text-white/70";

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
          <select
            id="bgPattern"
            value={value.bgPattern}
            onChange={(e) => setField("bgPattern", e.target.value)}
            className={selectClass}
          >
            <option value="none">None</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="transition" className={labelClass}>
            Transition
          </label>
          <select
            id="transition"
            value={value.transition ?? ""}
            onChange={(e) =>
              setField("transition", (e.target.value || null) as ThemeConfig["transition"])
            }
            className={selectClass}
          >
            <option value="">None</option>
            <option value="floral-bloom">Floral Bloom</option>
            <option value="bells-flower">Bells Flower</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="decorations" className={labelClass}>
            Decorations
          </label>
          <select
            id="decorations"
            value={value.decorations ?? ""}
            onChange={(e) =>
              setField("decorations", (e.target.value || null) as ThemeConfig["decorations"])
            }
            className={selectClass}
          >
            <option value="">None</option>
            <option value="forest">Forest</option>
          </select>
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
