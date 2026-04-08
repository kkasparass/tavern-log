import { AdminCharacterTabs } from "@/components/admin/AdminCharacterTabs";

export default function CharacterAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div>
      <AdminCharacterTabs id={params.id} />
      {children}
    </div>
  );
}
