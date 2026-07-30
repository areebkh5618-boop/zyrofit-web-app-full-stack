import Hero from "@/components/home/Hero";
import TrustMarquee from "@/components/home/TrustMarquee";
import CategoryTiles from "@/components/home/CategoryTiles";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <CategoryTiles />
      <Testimonials />
      <Newsletter />
    </>
  );
}