"use client";

import { DeleteImageFromDb } from "@/actions/images";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { useRouter } from "next/navigation";
import React from "react";
import { FaTrash } from "react-icons/fa6";

export default function DeleteImageBtn({ imageId }: { imageId: string }) {
  const router = useRouter();
  const adminLoader = useAdminLoader();

  const onDelteImage = async () => {
    adminLoader.startLoading();
    console.log("Deleting image with id:", imageId);
    await DeleteImageFromDb(imageId).then((res) => {
      if (!res) return;
      if (res.error) {
        console.error(res.error);
        toast({
          variant: "destructive",
          title: "Errore",
          description: res.error,
        });
      } else if (res.success) {
        toast({
          variant: "default",
          title: "Immagine Eliminata",
          description: res.success,
        });
        // router.refresh();
      }
    });

    adminLoader.stopLoading();
  };

  return (
    <Button
      onClick={onDelteImage}
      className="w-full h-full absolute top-0 left-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-100"
    >
      <FaTrash className="w-10 h-10 text-white" />
    </Button>
  );
}
