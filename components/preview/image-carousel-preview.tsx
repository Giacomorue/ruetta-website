"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

const ImageCarouselPreview: React.FC<ImageCarouselProps> = ({ images, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, skipSnaps: false },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        playOnInit: true,
        stopOnFocusIn: false,
        stopOnLastSnap: false,
        stopOnMouseEnter: false,
      }),
    ]
  );

  return (
    <div className={"embla h-full w-full " + className} ref={emblaRef}>
      <div className="embla__container h-full w-full">
        {images.map((image, index) => (
          <div className="embla__slide w-full h-full relative" key={index}>
            <Image
              className="object-cover rounded-[10px]"
              src={image}
              alt={`Image ${index}`}
              fill
              sizes="100vw"
            />
            <div className="h-full w-full top-0 left-0 absolute bg-black/5 z-10" />
            {/* <div className="text-white text-sm bottom-3 right-3 z-20 absolute">{index+1} di {images.length}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarouselPreview;
