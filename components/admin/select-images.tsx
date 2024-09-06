"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { Suspense, useEffect, useState } from "react";
import { Image as ImageType } from "prisma/prisma-client";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FaCheck, FaTrash, FaUpload } from "react-icons/fa6";
import { InsertImageInDb } from "@/actions/images";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useAdminLoader } from "@/hooks/useAdminLoader";
import { Upload } from "@aws-sdk/lib-storage";
import { toast } from "@/components/ui/use-toast";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

function SelectImages({
  images,
  value,
  onSelectLink,
  onDeselectLink,
  onResetLinks,
}: {
  images: ImageType[] | null;
  value: string[];
  onSelectLink: (link: string) => void;
  onDeselectLink: (link: string) => void;
  onResetLinks: (link: string[]) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startValue, setStartValue] = useState([""]);
  const adminLoader = useAdminLoader();
  const [allImages, setAllImages] = useState<ImageType[]>(images || []);

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
    const links: string[] = [];
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
          links.push(url);
        }
      });
    });

    try {
      await Promise.all(uploadPromises);
      if (links.length > 0) {
        const res = await InsertImageInDb(links);
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
          setAllImages((prev) => [...res.images, ...prev]);
        }
      } else {
        console.error("Nessuna immagine da inserire.");
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Nessuna immagine da inserire.",
        });
      }
      adminLoader.stopLoading();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Errore",
        description:
          "Si è verificato un errore durante il caricamento delle immagini.",
      });
      adminLoader.stopLoading();
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      setStartValue(value);
    }
  }, [isDialogOpen]);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          {value.length === 0 ? <p>Scegli immagini</p> : <p>Cambia immagini</p>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Scegli il logo</AlertDialogTitle>
          <AlertDialogDescription className="">
            <div {...getRootProps()} className="w-full mt-3">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer transition duration-300 ease-in-out hover:border-primary">
                <FaUpload className="text-gray-400 text-3xl" />
                {isDragActive ? (
                  <p className="text-primary text-center">Rilascia qui...</p>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Trascina qui o clicca per caricare altre immagini
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center flex-wrap justify-center gap-3 max-h-[310px] overflow-y-auto my-3">
              {allImages?.map((image, index) => (
                <div
                  key={image.id}
                  className="h-36 w-36 relative group rounded-xl overflow-hidden"
                >
                  <Suspense fallback={<p>Loading...</p>}>
                    <Image
                      className="object-contain"
                      fill
                      src={image.link}
                      alt={`Immagine ${index + 1}`}
                    />
                  </Suspense>
                  <Button
                    className={`w-full h-full absolute top-0 left-0 z-10 ${
                      !value.includes(image.link)
                        ? "opacity-0 group-hover:opacity-100"
                        : "opacity-100"
                    } transition-all duration-100`}
                    onClick={() => {
                      if (value.includes(image.link)) {
                        onDeselectLink(image.link);
                      } else {
                        onSelectLink(image.link);
                      }
                    }}
                  >
                    {!value.includes(image.link) && (
                      <FaCheck className="w-10 h-10 text-white" />
                    )}
                    {value.includes(image.link) && (
                      <FaTrash className="w-10 h-10 text-white" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onResetLinks(startValue)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SelectImages;
