import Hero from "@/components/Hero";
import ScentStrip from "@/components/ScentStrip";
import ShopSection from "@/components/ShopSection";
import BespokeBanner from "@/components/BespokeBanner";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScentStrip />
      <ShopSection />
      <BespokeBanner />
      <Testimonials />
      <Footer />
    </main>
  );
}
