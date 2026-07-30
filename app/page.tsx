import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { toProductDTO } from "@/lib/serialize";
import ProductDetail from "@/components/shop/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    await connectDB();
    const doc = await Product.findOne({ slug }).lean();
    if (!doc) notFound();
    const product = toProductDTO(doc);
    return (
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <ProductDetail product={product} />
      </div>
    );
  } catch {
    notFound();
  }
}
