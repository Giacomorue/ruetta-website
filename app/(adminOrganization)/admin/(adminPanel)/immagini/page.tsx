import HeaderBar from "@/components/admin/header-bar";
import DeleteImageBtn from "@/components/admin/immagini/delete-image-btn";
import ImagesList from "@/components/admin/immagini/images-list";
import ImagesPage from "@/components/admin/immagini/images-page";
import UploadImageBtn from "@/components/admin/immagini/upload-image-btn";
import { Button } from "@/components/ui/button";
import { GetAllImages } from "@/data/images";
import Image from "next/image";
import React from "react";
import { FaTrash } from "react-icons/fa6";

async function page() {

  return (
    <ImagesPage />
  );
}

export default page;
