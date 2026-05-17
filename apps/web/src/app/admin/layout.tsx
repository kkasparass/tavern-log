import { PageLayout } from "@/components/layout/PageLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col py-8 text-white">
      <PageLayout>{children}</PageLayout>
    </main>
  );
}
