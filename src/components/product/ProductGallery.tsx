import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-light shadow-sm">
      <Image
        src={images[0]}
        alt={productName}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
