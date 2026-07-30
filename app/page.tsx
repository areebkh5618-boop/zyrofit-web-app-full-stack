import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { toProductDTO } from "@/lib/serialize";
import { ProductDTO } from "@/lib/types";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import TrustMarquee from "@/components/home/TrustMarquee";
import CategoryTiles from "@/components/home/CategoryTiles";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import ProductCard from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

async function getFeaturedProducts(): Promise<ProductDTO[]> {
  try {
    await connectDB();
    const docs = await Product.find({}).sort({ popularity: -1 }).limit(8).lean();
    return docs.map(toProductDTO);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <TrustMarquee />
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-[clamp(28px,4vw,40px)]">Shop By Category</h2>
        </div>
        <CategoryTiles />
      </div>

      {featured.length > 0 && (
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-[clamp(28px,4vw,40px)]">Fan Favorites</h2>
            <Link href="/shop" className="font-mono-ui text-xs uppercase tracking-wider text-zyro-blue">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <h2 className="mb-8 font-display text-[clamp(28px,4vw,40px)]">What Athletes Say</h2>
        <Testimonials />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-10">
        <Newsletter />
      </div>
    </>
  );
}
