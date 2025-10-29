import { requireAdmin } from "@/lib/utils/auth_utils";
import AdminClient from "./admin-client";

export default async function AdminPage() {
  // Server-side protection: Check admin role before rendering
  // This will automatically redirect non-admin users
  const user = await requireAdmin();

  return <AdminClient user={user} />;
}
