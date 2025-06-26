import React from "react";

interface CardsSectionProps<T extends object> {
  title: string;
  items: T[];
  CardComponent: React.ComponentType<T>;
  showMoreHref: string;
  showMoreText: string;
}

function CardsSection<T extends object>({ title, items, CardComponent, showMoreHref, showMoreText }: CardsSectionProps<T>) {
  return (
    <section className="mb-4 ">
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col min-h-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-charcoal">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 flex-1 items-stretch">
          {items.slice(0, 2).map((item: T, idx: number) => (
            <div key={(item as { _id?: string })._id ?? idx} className="h-full">
              <CardComponent {...item} />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          
          <a
            href={showMoreHref}
            className="px-6 py-3 rounded-full border border-green-700 text-green-700 font-bold bg-white hover:bg-green-50 transition"
          >
            {showMoreText}
          </a>
        </div>
      </div>
    </section>
  );
}

export default CardsSection; 