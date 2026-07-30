import { Schema, models, model } from "mongoose";

export type Category =
  | "shirts"
  | "shorts"
  | "bags"
  | "gym"
  | "compression"
  | "accessories";

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: Category;
  price: number;
  oldPrice?: number | null;
  badge?: "New" | "Best Seller" | "Sale" | null;
  rating: number;
  reviewsCount: number;
  sizes: string[];
  colors: string[];
  imageSeed: string;
  imageUrl?: string | null;
  description: string;
  popularity: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    required: true,
    enum: ["shirts", "shorts", "bags", "gym", "compression", "accessories"],
  },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  badge: { type: String, enum: ["New", "Best Seller", "Sale", null], default: null },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  sizes: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  imageSeed: { type: String, default: "placeholder" },
  imageUrl: { type: String, default: null },
  description: { type: String, required: true },
  popularity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default models.Product || model<IProduct>("Product", ProductSchema);
