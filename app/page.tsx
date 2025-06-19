import Hero from "./components/Hero";
import TodayPickCard from "./components/TodayPickCard";
import ViviBot from "./components/ViviBot";
import { getTips } from "@/lib/sanityApi";
import { Tip } from "@/types";

export default async function HomePage() {
  const tips = await getTips();
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Hero />
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-charcoal">Today&apos;s Picks</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {tips.map((tip: Tip) => (
            <TodayPickCard
              key={tip._id}
              title={tip.text}
              description={"Try this today!"}
              category={"tip"}
              image={tip.icon}
            />
          ))}
        </div>
      </section>
      <ViviBot />
    </main>
  );
}
