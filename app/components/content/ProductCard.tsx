import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  slug: string;
  title: string;
  image?: string;
  category: string;
  price: number;
  description?: string;
}

const ProductCard = ({ slug, title, image, category, price, description }: ProductCardProps) => {
  const img = image || "/placeholder.jpg";
  return (
    <div className="bg-softgray rounded-2xl shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative">
        <Image
          src={img}
          alt={title}
          width={400}
          height={320}
          className="w-full h-80 object-cover"
        />
        <span className="absolute top-3 left-3  bg-mint text-charcoal text-xs font-bold px-3 py-1 rounded">{category}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-md text-coral font-bold mb-2">${price}</div>
        <div className="font-bold text-lg text-charcoal mb-1">{title}</div>
        {description && <div className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</div>}
        <div className="mt-auto">
          <Link href={`/products/${slug}`} className="text-coral font-semibold hover:underline">
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 