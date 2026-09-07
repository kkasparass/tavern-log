import { CardImage } from "./CardImage";
import { getCardSubtext } from "./subtext";
import type { CardComponentProps } from "./types";
import type { CardTemplateId } from "@/lib/themes/types";

export function CompactCard({
  name,
  tagline,
  thumbnailUrl,
  tags,
  settings,
}: CardComponentProps<CardTemplateId.Compact>) {
  const subtext = getCardSubtext(tagline, tags);

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white/5 p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white/10">
        {thumbnailUrl ? (
          <CardImage
            src={thumbnailUrl}
            alt={name}
            sizes="64px"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-white/20">
            ?
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-bold text-white">{name}</h2>
        {subtext && <p className="mt-0.5 truncate text-sm text-white/70">{subtext}</p>}
        {settings.showTags && tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white/80"
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
