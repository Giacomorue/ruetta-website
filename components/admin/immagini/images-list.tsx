"use client";

import React, { useEffect } from "react";
import { Image as ImageType } from "prisma/prisma-client";
import Image from "next/image";
import DeleteImageBtn from "./delete-image-btn";

function ImagesList({ images, socketId, onRevalidate }: { images: ImageType[], socketId: string, onRevalidate: () => void }) {

  
  useEffect(() => {
    console.log("ImagesList: ", images);
  }, [images]);

  return (
    <div className="w-full flex flex-row items-center gap-5 flex-wrap justify-center">
      {images?.map((images, index) => (
        <div
          key={index}
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 relative z-0 group"
        >
          <Image src={images.link} alt="Img" fill className="object-contain" sizes="(min-width: 640px) 160px, (min-width: 768px) 192px, (min-width: 1024px) 208px, 128px" />
          <DeleteImageBtn imageId={images.id} socketId={socketId} onRevalidate={onRevalidate} />
        </div>
      ))}
    </div>
  );
}

export default ImagesList;
