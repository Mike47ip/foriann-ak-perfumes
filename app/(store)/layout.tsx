import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Westside Perfumes | Luxury Fragrances in Ghana",
  description: "Shop premium luxury perfumes at Westside Perfumes. Exclusive fragrances for men, women and unisex delivered across Ghana. Based in Accra.",
  keywords: "westside perfumes, perfumes ghana, luxury fragrances ghana, buy perfume accra, perfume shop ghana, eau de parfum ghana, westsideperfumes.com",
  verification: {
    google: "4Mg4VWmjkNYFMd0nOBslFr6bw8L_MYhKGVbReGrDoMo",
  },
  openGraph: {
    title: "Westside Perfumes | Luxury Fragrances in Ghana",
    description: "Shop premium luxury perfumes at Westside Perfumes. Exclusive fragrances delivered across Ghana.",
    url: "https://westsideperfumes.com",
    siteName: "Westside Perfumes",
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Westside Perfumes | Luxury Fragrances in Ghana",
    description: "Shop premium luxury perfumes at Westside Perfumes. Exclusive fragrances delivered across Ghana.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://westsideperfumes.com",
  },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      {children}
    </>
  );
}