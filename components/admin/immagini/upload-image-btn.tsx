"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";
import { InsertImageInDb } from "@/actions/images";
import { toast } from "@/components/ui/use-toast";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

function UploadImageBtn({onRevalidate, socketId} : {socketId: string, onRevalidate: () => void }){
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const adminLoader = useAdminLoader();
  const [links, setLinks] = useState<Array<string>>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      uploadFiles(acceptedFiles);
    },
  });

  const uploadFiles = async (files: File[]) => {
    adminLoader.startLoading();

    const uploadPromises = files.map((file, index) => {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: `${Date.now()}-${file.name}`,
          Body: file,
          ContentType: file.type,
        },
      });

      return upload.done().then((data) => {
        if (data.Key) {
          const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${data.Key}`;
          setLinks((prevLinks) => [...prevLinks, url]);
        }
      });
    });

    try {
      await Promise.all(uploadPromises);
      adminLoader.stopLoading();
    } catch (error) {
      console.error(error);
      adminLoader.stopLoading();
    }
  };

  const removeFromArray = (link: string) => {
    setLinks((prevLinks) => prevLinks.filter((l) => l !== link));
  };

  const addToDB = async () => {
    adminLoader.startLoading();
    await InsertImageInDb(links, socketId)
      .then((res) => {
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
            title: "Immagini caricate con successo",
            description: res.success,
          });
          setLinks([]);
          setIsDialogOpen(false);
          onRevalidate();
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Errore",
        });
      });
    adminLoader.stopLoading();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} className="gap-x-2">
          <LuImagePlus className="w-6 h-6" />
          <span>Carica Immagini</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Carica Immagini</DialogTitle>
          <DialogDescription>
            <div {...getRootProps()} className="w-full mt-3">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer transition duration-300 ease-in-out hover:border-primary">
                <FaUpload className="text-gray-400 text-3xl" />
                {isDragActive ? (
                  <p className="text-primary text-center">Rilascia qui...</p>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Trascina qui delle immagini oppure clicca qui
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center flex-wrap justify-center gap-3 max-h-[310px] overflow-y-auto my-3">
              {links?.map((link, index) => (
                <div
                  key={link}
                  className="h-36 w-36 relative group rounded-xl overflow-hidden"
                >
                  <Suspense fallback={<p>Loading...</p>}>
                    <Image
                      className="object-contain"
                      fill
                      src={link}
                      alt={`Immagine ${index + 1}`}
                    />
                  </Suspense>
                  <Button
                    className="w-full h-full absolute top-0 left-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-100"
                    onClick={() => removeFromArray(link)}
                  >
                    <FaTrash className="w-10 h-10 text-white" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="w-full flex flex-row items-center justify-center">
              <Button onClick={addToDB} disabled={links.length <= 0}>
                Carica immagini
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UploadImageBtn;
