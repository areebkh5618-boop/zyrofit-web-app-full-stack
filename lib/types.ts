export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  badge?: string | null;
  rating: number;
  reviewsCount: number;
  sizes: string[];
  colors: string[];
  imageSeed: string;
  imageUrl?: string | null;
  description: string;
  popularity: number;
  createdAt: string;
}

export interface OrderItemDTO {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  imageSeed: string;
}

export interface OrderDTO {
  id: string;
  userId?: string;
  items: OrderItemDTO[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod?: string;
  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    zip?: string;
  };
  createdAt: string;
}
