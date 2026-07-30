/**
 * Seed script — creates sample products + admin & demo customer accounts.
 *
 * Usage:
 *   1. Copy .env.example → .env.local and fill MONGODB_URI + JWT_SECRET
 *   2. npm install
 *   3. npm run seed
 *
 * Default accounts after seed:
 *   Admin:    admin@zyrofit.com  /  admin123
 *   Customer: demo@zyrofit.com   /  demo123
 */

import { config } from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User";
import Product from "../models/Product";

// Load .env.local first, then .env as fallback
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI in .env.local first.");
  console.error("Expected file:", path.resolve(process.cwd(), ".env.local"));
  process.exit(1);
}

const PRODUCTS = [
  {
    name: "Velocity Performance Shirt",
    slug: "velocity-performance-shirt",
    category: "shirts",
    price: 48,
    oldPrice: 60,
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 214,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Blue", "Green"],
    imageSeed: "zf-velocity-shirt",
    description:
      "Four-way stretch technical fabric that wicks sweat and stays light through long sessions. Flatlock seams, athletic cut.",
    popularity: 98,
  },
  {
    name: "Flux Training Shorts",
    slug: "flux-training-shorts",
    category: "shorts",
    price: 42,
    badge: "New",
    rating: 4.7,
    reviewsCount: 89,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey"],
    imageSeed: "zf-flux-shorts",
    description: "7-inch inseam training shorts with secure zip pocket and stretch waistband. Built for WODs and runs.",
    popularity: 85,
  },
  {
    name: "Voyager Sports Duffel",
    slug: "voyager-sports-duffel",
    category: "bags",
    price: 79,
    oldPrice: 95,
    badge: "Sale",
    rating: 4.8,
    reviewsCount: 156,
    sizes: ["One Size"],
    colors: ["Black", "Blue"],
    imageSeed: "zf-voyager-duffel",
    description: "45L duffel with shoe compartment, wet pocket, and reinforced straps. Survives road trips and daily gym runs.",
    popularity: 92,
  },
  {
    name: "Core Compression Top",
    slug: "core-compression-top",
    category: "compression",
    price: 54,
    badge: "New",
    rating: 4.6,
    reviewsCount: 67,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue"],
    imageSeed: "zf-core-compression",
    description: "Targeted compression that breathes. Ideal base layer for lifting, running, and recovery work.",
    popularity: 78,
  },
  {
    name: "Forge Gym Tank",
    slug: "forge-gym-tank",
    category: "gym",
    price: 36,
    rating: 4.5,
    reviewsCount: 112,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Green"],
    imageSeed: "zf-forge-tank",
    description: "Dropped-armhole tank with moisture-wicking mesh panels. Room to move on big presses.",
    popularity: 70,
  },
  {
    name: "Grip Lifting Straps",
    slug: "grip-lifting-straps",
    category: "accessories",
    price: 24,
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 301,
    sizes: ["One Size"],
    colors: ["Black"],
    imageSeed: "zf-grip-straps",
    description: "Padded lifting straps with reinforced stitching. Stay locked in through heavy pulls.",
    popularity: 95,
  },
  {
    name: "Pulse Running Shorts",
    slug: "pulse-running-shorts",
    category: "shorts",
    price: 38,
    rating: 4.6,
    reviewsCount: 54,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Blue", "Green"],
    imageSeed: "zf-pulse-shorts",
    description: "Lightweight 5-inch running shorts with built-in liner and reflective hits.",
    popularity: 65,
  },
  {
    name: "Apex Training Hoodie",
    slug: "apex-training-hoodie",
    category: "gym",
    price: 68,
    oldPrice: 82,
    badge: "Sale",
    rating: 4.8,
    reviewsCount: 143,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey"],
    imageSeed: "zf-apex-hoodie",
    description: "Midweight performance hoodie with thumbholes and a clean athletic fit. Warm-ups and cool-downs covered.",
    popularity: 88,
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  // Clear existing products (optional — comment out if you want to keep data)
  await Product.deleteMany({});
  await Product.insertMany(PRODUCTS);
  console.log(`Seeded ${PRODUCTS.length} products`);

  // Admin account
  const adminHash = await bcrypt.hash("admin123", 10);
  await User.findOneAndUpdate(
    { email: "admin@zyrofit.com" },
    {
      name: "Zyro Admin",
      email: "admin@zyrofit.com",
      passwordHash: adminHash,
      role: "admin",
    },
    { upsert: true, new: true }
  );
  console.log("Admin: admin@zyrofit.com / admin123");

  // Demo customer
  const demoHash = await bcrypt.hash("demo123", 10);
  await User.findOneAndUpdate(
    { email: "demo@zyrofit.com" },
    {
      name: "Demo Athlete",
      email: "demo@zyrofit.com",
      passwordHash: demoHash,
      role: "customer",
      shirtSize: "L",
    },
    { upsert: true, new: true }
  );
  console.log("Customer: demo@zyrofit.com / demo123");

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
