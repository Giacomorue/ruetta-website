"use client";

import { useAdminLoader } from "@/hooks/useAdminLoader";
import React from "react";
import { ImSpinner2 } from "react-icons/im";

function AdminLoader() {
  const adminLoader = useAdminLoader();

  if (!adminLoader.isLoading) return null;

  return (
    <div className="z-[100] flex flex-col items-center justify-center inset-0 bg-background/30 fixed top-0 left-0 h-[100vh] w-[100vw]">
      <ImSpinner2 className="animate-spin w-20 h-20 text-primary" />
    </div>
  );
}

export default AdminLoader;
