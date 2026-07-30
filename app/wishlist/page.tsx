import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { toProductDTO } from "@/lib/serialize";
import { ProductDTO } from "@/lib/types";
import WishlistClient from "@/components/shop/WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved ZyroFit products.",
};

export const dynamic = "force-dynamic";

async function getProducts(): Promise<ProductDTO[]> {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return products.map(toProductDTO);
  } catch {
    return [];
  }
}

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="mb-10">
          <div className="eyebrow mb-3.5">
            <span className="stripe" />
            Saved Items
          </div>
          <h1 className="font-display text-[clamp(38px,7vw,68px)]">My Wishlist</h1>
          <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
            Keep your favourite ZyroFit products here and add them to your cart whenever you are ready.
          </p>
        </div>
        <WishlistClient products={products} />
      </div>
    </section>
  );
}
