"use client";
import { NavTabs } from "@/components/ui/NavTabs";

const getTabs = (id: string) => [
  { label: "Overview", href: `/admin/characters/${id}/edit` },
  { label: "Stories", href: `/admin/characters/${id}/stories` },
  { label: "Voice Lines", href: `/admin/characters/${id}/voice-lines` },
  { label: "Gallery", href: `/admin/characters/${id}/gallery` },
  { label: "Timeline", href: `/admin/characters/${id}/timeline` },
];

export function AdminCharacterTabs({ id }: { id: string }) {
  return (
    <NavTabs
      tabs={getTabs(id)}
      className="mb-8 flex gap-1 overflow-x-auto border-b border-white/10"
      activeClassName="border-b-2 border-white text-white"
      inactiveClassName="text-white/50 hover:text-white/80"
    />
  );
}
