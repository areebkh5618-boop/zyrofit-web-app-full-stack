import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { toProductDTO, toOrderDTO } from "@/lib/serialize";
import { ProductDTO, OrderDTO } from "@/lib/types";
import AdminClient from "@/components/ui/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "admin") redirect("/dashboard");

  let products: ProductDTO[] = [];
  let orders: OrderDTO[] = [];
  try {
    await connectDB();
    const [productDocs, orderDocs] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean(),
      Order.find({}).sort({ createdAt: -1 }).lean(),
    ]);
    products = productDocs.map(toProductDTO);
    orders = orderDocs.map(toOrderDTO);
  } catch {
    // leave empty if DB unreachable
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10">
      <div className="mb-2 font-mono-ui text-xs uppercase tracking-wider text-zyro-blue">Admin</div>
      <h1 className="font-display mb-8 text-[38px]">Admin Panel</h1>
      <AdminClient products={products} orders={orders} />
    </div>
  );
}
