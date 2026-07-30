import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { toProductDTO } from "@/lib/serialize";
import { ProductDTO } from "@/lib/types";
import ShopClient from "@/components/shop/ShopClient";

export const dynamic = "force-dynamic";

async function getAllProducts(): Promise<ProductDTO[]> {
  try {
    await connectDB();
    const docs = await Product.find({}).lean();
    return docs.map(toProductDTO);
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getAllProducts();

  return (
    <>
      <div className="bg-zyro-black py-12 text-white md:py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="mb-3.5 flex items-center gap-2 font-mono-ui text-xs uppercase tracking-wider text-[#9aa3af]">
            Home <span className="text-zyro-green">/</span> Shop
          </div>
          <h1 className="font-display text-[clamp(40px,6vw,64px)]">All Gear</h1>
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <ShopClient products={products} initialCategory={category} />
      </div>
    </>
  );
}
