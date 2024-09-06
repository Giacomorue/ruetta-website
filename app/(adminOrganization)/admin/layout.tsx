import AdminLoader from "@/components/admin/loading-admin";
import React from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminLoader />
      {children}
    </>
  );
}

export default AdminLayout;
