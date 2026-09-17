const TESTIMONIALS = [
  {
    quote: "I've never had so many strangers stop me to ask what I'm wearing. foriann is a conversation starter.",
    author: "AMARA O., LAGOS",
    dark: true,
  },
  {
    quote: "The packaging alone is worth the price. But the scent? It lasts from morning to night without a single reapplication.",
    author: "KWAME A., ACCRA",
    dark: false,
  },
  {
    quote: "Ordered the bespoke service and received something I'll wear for the rest of my life. Truly one of a kind.",
    author: "FATIMA S., ABUJA",
    dark: true,
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="flex items-center gap-4 mb-10">
        <span className="w-10 h-px bg-bronze inline-block" />
        <span className="text-bronze text-xs tracking-[.2em]">WORN & LOVED</span>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(({ quote, author, dark }) => (
          <div
            key={author}
            className={`p-8 ${dark ? "bg-charcoal" : "bg-[#f0ebe0]"}`}
          >
            <p className={`font-playfair text-lg italic leading-relaxed mb-6 ${dark ? "text-ivory" : "text-charcoal"}`}>
              &ldquo;{quote}&rdquo;
            </p>
            <p className="text-bronze text-xs tracking-widest">— {author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
