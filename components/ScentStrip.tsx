const FAMILIES = ["WOODY", "FLORAL", "ORIENTAL", "CITRUS", "AQUATIC", "CHYPRE", "FOUGÈRE", "GOURMAND", "MUSK"];

export default function ScentStrip() {
  // Duplicate for seamless loop
  const items = [...FAMILIES, ...FAMILIES];

  return (
    <div className="bg-[#2e2a24] py-4 overflow-hidden">
      <div className="animate-marquee">
        {items.map((family, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="text-mist text-xs tracking-[.2em] whitespace-nowrap">{family}</span>
            <span className="text-bronze text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
