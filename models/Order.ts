import { Schema, models, model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  imageSeed: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "card" | "cod";
  stripeSessionId?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    size: String,
    color: String,
    imageSeed: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true, index: true },
  items: { type: [OrderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cod"],
    default: "card",
  },
  stripeSessionId: String,
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    zip: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default models.Order || model<IOrder>("Order", OrderSchema);
