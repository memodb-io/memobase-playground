import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  aspectRatio?: string; // 默认 16:9
  objectFit?: "cover" | "contain";
  delay?: number;
}

export const ImageCarousel = ({
  images,
  aspectRatio = "aspect-[16/9]",
  objectFit = "cover",
  delay = 2000,
}: ImageCarouselProps) => {
  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: delay,
        }),
      ]}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className={`w-full h-[100dvh] ${aspectRatio} relative`}>
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                fill
                unoptimized
                className={`object-${objectFit}  object-left-top`}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
