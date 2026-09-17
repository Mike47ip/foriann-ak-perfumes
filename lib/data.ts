export type ScentFamily = "all" | "floral" | "woody" | "oriental" | "citrus" | "aquatic";
export type Badge = "new" | "best" | "ltd" | null;

export interface Product {
  id: number;
  name: string;
  family: Exclude<ScentFamily, "all">;
  price: number;
  badge: Badge;
  notes: string[];
  emoji: string;
  image?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export const PRODUCTS: Product[] = [];

export const SCENT_FAMILIES: { label: string; value: ScentFamily }[] = [
  { label: "All",      value: "all" },
  { label: "Floral",   value: "floral" },
  { label: "Woody",    value: "woody" },
  { label: "Oriental", value: "oriental" },
  { label: "Citrus",   value: "citrus" },
  { label: "Aquatic",  value: "aquatic" },
];

export const FAMILY_COLORS: Record<Exclude<ScentFamily, "all">, string> = {
  woody:    "#7a8f7a",
  floral:   "#c98ba0",
  oriental: "#b8916a",
  citrus:   "#c4a94a",
  aquatic:  "#6a8fb8",
};