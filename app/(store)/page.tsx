import Hero from "@/components/Hero";
import ScentStrip from "@/components/ScentStrip";
import BestsellerCarousel from "@/components/BestsellerCarousel";
import ShopSection from "@/components/ShopSection";
import BespokeBanner from "@/components/BespokeBanner";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScentStrip />
      <BestsellerCarousel />
      <ShopSection />
      <BespokeBanner />
      <Testimonials />
      <Footer />
    </main>
  );
}