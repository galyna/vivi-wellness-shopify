import React from "react";


interface CardsSectionProps<T extends object> {
  title: string;
  items: (T & { _id: string })[];
  CardComponent: React.ComponentType<T>;
  showMoreHref: string;
  showMoreText: string;
}

function CardsSection<T extends object>({ title, items, CardComponent, showMoreHref, showMoreText }: CardsSectionProps<T>) {
  return (
    <section className="mb-4 relative">
       
      <div className=" px-8 lg:px-16 py-12 lg:py-16 flex flex-col min-h-[600px] gap-12 lg:gap-16">
        <h2 className="text-2xl lg:text-3xl font-bold  text-charcoal tracking-wide capitalize letter-spacing text-center font-serif ">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16 flex-1 items-stretch">
          {items.slice(0, 3).map((item, idx) => (
            <div key={item._id ?? idx} className={`h-full ${idx === 2 ? 'block md:hidden xl:block' : 'block'}`}>
              <CardComponent {...item} />
            </div>
          ))}
        </div>
        <div className="flex justify-center ">
          <a
            href={showMoreHref}
            className="px-6 py-3 rounded-full bg-charcoal text-white font-bold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 group"
          >
            {showMoreText}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default CardsSection; 