import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  image?: string;
  category: string;
  date?: string;
  description?: string;
  intro?: string;
}

const Skeleton = () => (
  <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-2xl overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" style={{backgroundSize: '200% 100%'}} />
  </div>
);

const ArticleCard = ({ slug, title, image, category, date, description, intro }: ArticleCardProps) => {
  return (
    <div className=" bg-softgray rounded-2xl shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={400}
            height={320}
            className="w-full h-80 object-cover"
          />
        ) : (
          <Skeleton />
        )}
        <span className="absolute top-3 left-3 bg-mint text-charcoal text-xs font-bold px-3 py-1 rounded">{category}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        {date && <div className="text-xs text-gray-400 mb-2">{date}</div>}
        <div className="font-bold text-lg text-charcoal mb-1">{title}</div>
        {intro && <div className="text-xs text-gray-500 mb-2 line-clamp-2">{intro}</div>}
        {description && <div className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</div>}
        <div className="mt-auto">
          <Link href={`/articles/${slug}`} className="text-coral font-semibold hover:underline">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
