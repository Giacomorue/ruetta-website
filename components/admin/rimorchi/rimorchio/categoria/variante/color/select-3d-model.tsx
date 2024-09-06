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
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCheck, FaTrash, FaUpload } from "react-icons/fa6";
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

function Select3DModel({
  value,
  onSelectModel,
}: {
  value: string;
  onSelectModel: (link: string) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const adminLoader = useAdminLoader();
  const [modelUrl, setModelUrl] = useState<string | null>(value);
  const [prevModelUrl, setPrevModelUrl] = useState<string>(value);

  useEffect(() => {
    if (isDialogOpen == true) {
      setPrevModelUrl(value);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    setModelUrl(value);
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "model/gltf-binary": [".glb"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0]);
      }
    },
  });

  const uploadFile = async (file: File) => {
    adminLoader.startLoading();
    try {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: `${Date.now()}-${file.name}`,
          Body: file,
          ContentType: file.type,
        },
      });

      const data = await upload.done();
      if (data.Key) {
        const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${data.Key}`;
        console.log(`File uploaded to: ${url}`);
        setModelUrl(url);
        onSelectModel(url);
        toast({
          variant: "default",
          title: "Modello caricato con successo",
          description: "Il modello 3D è stato caricato e selezionato.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Errore",
        description:
          "Si è verificato un errore durante il caricamento del modello.",
      });
    } finally {
      adminLoader.stopLoading();
    }
  };

  const GoBack = () => {
    setModelUrl(prevModelUrl);
    onSelectModel(prevModelUrl);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          {value ? <p>Cambia modello 3D</p> : <p>Scegli modello 3D</p>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[95%] sm:w-3/4 md:w-2/4 max-w-[700px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Scegli il modello 3D</AlertDialogTitle>
          <AlertDialogDescription>
            <div {...getRootProps()} className="w-full mt-3">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer transition duration-300 ease-in-out hover:border-primary">
                <FaUpload className="text-gray-400 text-3xl" />
                {isDragActive ? (
                  <p className="text-primary text-center">Rilascia qui...</p>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Trascina qui o clicca per caricare un modello 3D (.glb)
                  </p>
                )}
              </div>
            </div>
            {modelUrl && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-center text-sm text-muted-foreground">
                  Modello selezionato:
                </p>
                <div className="text-sm break-all">{modelUrl}</div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={GoBack}>Cancella</AlertDialogCancel>
          <AlertDialogAction>Conferma</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Select3DModel;
