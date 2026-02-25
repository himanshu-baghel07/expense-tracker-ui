import bgImage from "@public/images/bg_image.jpg";

export type ImageType = "bgImage";

export type NextImage = {
  src: string;
  height: number | string;
  width: number | string;
};

export const images: Record<ImageType, NextImage> = {
  bgImage,
};
