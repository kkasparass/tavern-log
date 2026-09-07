import { CardImage } from "./CardImage";
import { getCardSubtext } from "./subtext";
import type { CardComponentProps } from "./types";
import { CardImageAlignment } from "@/lib/themes/types";
import type { CardTemplateId } from "@/lib/themes/types";

export function BannerCard({
  name,
  tagline,
  thumbnailUrl,
  tags,
  settings,
}: CardComponentProps<CardTemplateId.Banner>) {
  const subtext = getCardSubtext(tagline, tags);

  return (
    <div
      className={`flex overflow-hidden rounded-lg bg-black/40 ${
        settings.imageAlignment === CardImageAlignment.Right ? "flex-row-reverse" : ""
      }`}
    >
      <div className="relative w-2/5 shrink-0 overflow-hidden">
        {thumbnailUrl ? (
          <CardImage
            src={thumbnailUrl}
            alt={name}
            sizes="40vw"
            className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center bg-white/10 text-4xl text-white/20">
            ?
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-end p-6">
        <h2 className="text-2xl font-bold text-white">{name}</h2>
        {subtext && <p className="mt-1 text-sm text-white/70">{subtext}</p>}
        {tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1">
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
