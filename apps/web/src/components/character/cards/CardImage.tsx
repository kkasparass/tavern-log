import Image from "next/image";

type CardImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function CardImage({ src, alt, className, sizes = "100vw" }: CardImageProps) {
  // Local blob: URLs (admin preview of a pending thumbnail upload) cannot go
  // through next/image's optimisation pipeline — render a plain img instead
  if (src.startsWith("blob:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }
  return <Image src={src} alt={alt} width={0} height={0} sizes={sizes} className={className} />;
}
