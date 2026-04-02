import Image from "next/image";
import Link from "next/link";
import type { CharacterPreview } from "@/lib/types";

export function CharacterCard({ slug, name, system, thumbnailUrl, tags }: CharacterPreview) {
  return (
    <Link
      href={`/characters/${slug}`}
      className="group block overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
    >
      <div className="relative aspect-square bg-white/10">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-white/20">
            ?
          </div>
        )}
      </div>
      <div className="p-3">
        <h2 className="truncate font-semibold text-white">{name}</h2>
        <p className="mb-2 text-sm text-white/60">{system}</p>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
