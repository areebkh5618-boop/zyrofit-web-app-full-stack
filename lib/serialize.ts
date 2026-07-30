import { IProduct } from "@/models/Product";
import { IOrder } from "@/models/Order";
import { ProductDTO, OrderDTO } from "@/lib/types";

type LeanProduct = Omit<IProduct, "_id" | "createdAt"> & {
  _id: unknown;
  createdAt: Date;
};

export function toProductDTO(doc: LeanProduct): ProductDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    price: doc.price,
    oldPrice: doc.oldPrice ?? null,
    badge: doc.badge ?? null,
    rating: doc.rating,
    reviewsCount: doc.reviewsCount,
    sizes: doc.sizes,
    colors: doc.colors,
    imageSeed: doc.imageSeed,
    imageUrl: doc.imageUrl ?? null,
    description: doc.description,
    popularity: doc.popularity,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

type LeanOrder = Omit<IOrder, "_id" | "createdAt"> & {
  _id: unknown;
  createdAt: Date;
};

export function toOrderDTO(doc: LeanOrder): OrderDTO {
  return {
    id: String(doc._id),
    userId: doc.userId,
    items: doc.items,
    subtotal: doc.subtotal,
    shipping: doc.shipping,
    total: doc.total,
    status: doc.status,
    paymentMethod: doc.paymentMethod,
    shippingAddress: doc.shippingAddress,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}
