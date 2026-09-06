"use client";
import Image from "next/image";
import type { CharacterPreview } from "@/lib/types";
import { resolveTheme } from "@/lib/themes/presets";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { useTransition } from "@/components/transitions/TransitionProvider";

export function CharacterCard({
  slug,
  name,
  tagline,
  thumbnailUrl,
  tags,
  theme,
}: CharacterPreview) {
  const { hoverPreview, clearHoverPreview } = useTransition();
  const resolvedTheme = resolveTheme(theme);
  const subtext = tagline ?? tags.slice(0, 3).join(" · ");

  return (
    <TransitionLink
      href={`/characters/${slug}`}
      theme={resolvedTheme}
      className="group block overflow-hidden rounded-lg"
      onMouseEnter={() => hoverPreview(resolvedTheme)}
      onMouseLeave={clearHoverPreview}
    >
      <div className="relative">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={name}
            width={0}
            height={0}
            sizes="100vw"
            className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex aspect-[2/3] items-center justify-center bg-white/10 text-4xl text-white/20">
            ?
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
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
    </TransitionLink>
  );
}
