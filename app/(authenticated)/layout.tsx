// app/(authenticated)/layout.tsx
import { requireAuth } from "@/utils/auth-helpers";
import BottomNav from "@/components/layout/BottomNav";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <>
      <div className="pb-16">{children}</div>
      <BottomNav />
    </>
  );
}
