import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { toProductDTO } from "@/lib/serialize";
import { ProductDTO } from "@/lib/types";
import Hero from "@/components/home/Hero";
import TrustMarquee from "@/components/home/TrustMarquee";
import CategoryTiles from "@/components/home/CategoryTiles";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import ProductCard from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

async function getHomeProducts() {
  try {
    await connectDB();
    const [featured, newArrivals, bestSellers] = await Promise.all([
      Product.find({}).sort({ rating: -1 }).limit(4).lean(),
      Product.find({}).sort({ createdAt: -1 }).limit(4).lean(),
      Product.find({}).sort({ popularity: -1 }).limit(4).lean(),
    ]);
    return {
      featured: featured.map(toProductDTO) as ProductDTO[],
      newArrivals: newArrivals.map(toProductDTO) as ProductDTO[],
      bestSellers: bestSellers.map(toProductDTO) as ProductDTO[],
    };
  } catch {
    return { featured: [], newArrivals: [], bestSellers: [] };
  }
}

function ProductRow({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: ProductDTO[];
}) {
  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="eyebrow mb-3.5">
            <span className="stripe" />
            {eyebrow}
          </div>
          <h2 className="font-display text-[clamp(32px,5vw,52px)]">{title}</h2>
        </div>
        <Link
          href="/shop"
          className="rounded border-[1.5px] border-[var(--ink)] px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
        >
          View All
        </Link>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--ink-soft)]">
          No products yet — run <code className="font-mono-ui">npm run seed</code> to populate your catalog.
        </p>
      )}
    </div>
  );
}

export default async function HomePage() {
  const { featured, newArrivals, bestSellers } = await getHomeProducts();

  return (
    <>
      <Hero />
      <TrustMarquee />

      <section className="py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <ProductRow eyebrow="Featured" title="Featured Products" products={featured} />
        </div>
      </section>

      <section className="bg-[var(--bg-alt)] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <ProductRow eyebrow="Just Dropped" title="New Arrivals" products={newArrivals} />
        </div>
      </section>

      <section className="py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <ProductRow eyebrow="Athlete Favorites" title="Best Sellers" products={bestSellers} />
        </div>
      </section>

      <section className="bg-[var(--bg-alt)] py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="mb-10">
            <div className="eyebrow mb-3.5">
              <span className="stripe" />
              Shop By Need
            </div>
            <h2 className="font-display text-[clamp(32px,5vw,52px)]">Sports Categories</h2>
          </div>
          <CategoryTiles />
        </div>
      </section>

      <section className="py-16 md:py-[88px]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="mb-10">
            <div className="eyebrow mb-3.5">
              <span className="stripe" />
              Real Feedback
            </div>
            <h2 className="font-display text-[clamp(32px,5vw,52px)]">Customer Reviews</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
