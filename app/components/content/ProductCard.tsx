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
    <Link href={`/products/${slug}`} className="block h-full group cursor-pointer">
      <div className="bg-softgray rounded-2xl shadow-md overflow-hidden flex flex-col h-full min-h-[420px] max-w-[370px] w-full group-hover:shadow-lg transition">
        <div className="relative h-60 w-full">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover object-center"
          />
          <span className="absolute top-3 left-3  bg-mint text-green-900 text-xs font-bold px-3 py-1 rounded">{category}</span>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="text-md text-coral font-bold mb-2">${price}</div>
          <div className="font-bold text-lg text-charcoal mb-1">{title}</div>
          {description && <div className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</div>}
          <div className="mt-auto">
            <span className="text-coral font-semibold hover:underline">View Product</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 