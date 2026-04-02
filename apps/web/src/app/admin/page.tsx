import Link from "next/link";
import { CharacterList } from "@/components/admin/CharacterList";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Characters</h1>
        <Link
          href="/admin/characters/new"
          className="rounded bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-white/90"
        >
          New character
        </Link>
      </div>
      <CharacterList />
    </div>
  );
}
