import Image from "next/image";
import { getCardSubtext } from "./subtext";
import type { CardComponentProps } from "./types";
import type { CardTemplateId } from "@/lib/themes/types";

export function PolaroidCard({
  name,
  tagline,
  thumbnailUrl,
  tags,
  settings,
}: CardComponentProps<CardTemplateId.Polaroid>) {
  const subtext = getCardSubtext(tagline, tags);
  const rotation = Math.max(-6, Math.min(6, settings.rotation));

  return (
    <div
      className="m-3 rounded-sm p-3 shadow-lg"
      style={{ backgroundColor: settings.frameColor, transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={name}
            width={0}
            height={0}
            sizes="100vw"
            className="block h-auto w-full"
          />
        ) : (
          <div className="flex aspect-[2/3] items-center justify-center bg-black/10 text-4xl text-black/20">
            ?
          </div>
        )}
      </div>
      <div className="pb-1 pt-3 text-center">
        <h2 className="text-lg font-bold text-neutral-900">{name}</h2>
        {subtext && <p className="mt-0.5 text-xs text-neutral-600">{subtext}</p>}
        {tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap justify-center gap-1">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-black/10 px-2 py-0.5 text-xs text-neutral-700"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
