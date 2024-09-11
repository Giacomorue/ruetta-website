import HeaderBar from "@/components/admin/header-bar";
import DeleteColorBtn from "@/components/admin/rimorchi/rimorchio/categoria/variante/color/delete-color-btn";
import EditColorForm from "@/components/admin/rimorchi/rimorchio/categoria/variante/color/edit-color-form";
import { Button } from "@/components/ui/button";
import { GetAllImages } from "@/data/images";
import { GetColorById } from "@/data/trailer";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

async function page({
  params: { trailerId, categoryId, variantId, colorId },
}: {
  params: {
    trailerId: string;
    categoryId: string;
    variantId: string;
    colorId: string;
  };
}) {

  
}

export default page;
