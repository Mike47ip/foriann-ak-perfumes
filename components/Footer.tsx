const LINKS = {
  SHOP: ["New Arrivals", "Bestsellers", "Gift Sets", "Bespoke"],
  INFO: ["Our Story", "Ingredients", "Journal", "Contact"],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <p className="font-playfair text-ivory text-xl tracking-widest mb-4">FORIANN</p>
            <p className="text-mist text-xs leading-relaxed">
              Perfumery for those who know the trail they leave is the most lasting impression.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-ivory text-xs tracking-widest mb-4">{heading}</p>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <a key={link} href="#" className="text-mist text-xs hover:text-bronze transition-colors no-underline">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="text-ivory text-xs tracking-widest mb-4">NEWSLETTER</p>
            <p className="text-mist text-xs mb-4">New arrivals and exclusive offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#2e2a24] text-ivory text-xs px-4 py-3 outline-none placeholder-mist border-none"
              />
              <button className="bg-bronze text-ivory text-xs px-4 py-3 border-none cursor-pointer hover:bg-bronze-light transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2e2a24] pt-6 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-mist text-xs">© 2026 Foriann Perfumery. All rights reserved.</p>
          <p className="text-mist text-xs">Privacy · Terms · Shipping</p>
        </div>
      </div>
    </footer>
  );
}
