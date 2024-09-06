"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchAdmin() {
  return (
    <div className="relative flex-grow">
      <FaSearch className="text-primary absolute top-1/2 left-0 -translate-y-1/2 ml-3" />
      <Input placeholder="Search somethings" className="h-12 px-9" />
    </div>
  );
}

export default SearchAdmin;
