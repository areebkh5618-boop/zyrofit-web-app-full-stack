import type { Metadata } from "next";
import { Manrope, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { toProductDTO } from "@/lib/serialize";
import { ProductDTO } from "@/lib/types";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZyroFit — Premium Sports Apparel & Training Gear",
    template: "%s · ZyroFit",
  },
  description:
    "Premium sports apparel, gym wear, training accessories and fitness gear — engineered for athletes who train with intent.",
};

export const dynamic = "force-dynamic";

async function getHeaderProducts(): Promise<ProductDTO[]> {
  try {
    await connectDB();
    const docs = await Product.find({}).sort({ popularity: -1 }).limit(24).lean();
    return docs.map(toProductDTO);
  } catch {
    return [];
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getHeaderProducts();

  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${bebas.variable} ${jbmono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("zyrofit_theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <AppProviders>
          <Header products={products} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
