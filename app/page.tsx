import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { toProductDTO } from "@/lib/serialize";
import { ProductDTO } from "@/lib/types";
import WishlistClient from "@/components/shop/WishlistClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  let products: ProductDTO[] = [];
  try {
    await connectDB();
    const docs = await Product.find({}).lean();
    products = docs.map(toProductDTO);
  } catch {
    // empty
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10">
      <div className="mb-2 font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]">
        Saved
      </div>
      <h1 className="font-display mb-8 text-[42px]">Wishlist</h1>
      <WishlistClient products={products} />
    </div>
  );
}
