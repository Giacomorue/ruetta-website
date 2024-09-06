"use client";

import React from "react";
import { Image as ImageType } from "prisma/prisma-client";
import Image from "next/image";
import DeleteImageBtn from "./delete-image-btn";

function ImagesList({ images }: { images: ImageType[] }) {
  return (
    <div className="w-full flex flex-row items-center gap-5 flex-wrap justify-center">
      {images?.map((images, index) => (
        <div
          key={index}
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 relative z-0 group"
        >
          <Image src={images.link} alt="Img" fill className="object-contain" />
          <DeleteImageBtn imageId={images.id} />
        </div>
      ))}
    </div>
  );
}

export default ImagesList;
