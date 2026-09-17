const STATS = [
  { value: "300+", label: "INGREDIENTS" },
  { value: "12",   label: "YEARS CRAFT" },
  { value: "48h",  label: "DISPATCH" },
];

export default function BespokeBanner() {
  return (
    <section className="bg-charcoal py-20 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        {/* Text */}
        <div className="flex-1">
          <p className="text-bronze text-xs tracking-[.2em] mb-4">BESPOKE SERVICE</p>
          <h2 className="font-playfair text-ivory text-4xl font-medium leading-snug mb-6">
            Commission your
            <br />
            <em>signature scent.</em>
          </h2>
          <p className="text-mist text-sm leading-relaxed max-w-sm mb-8">
            Work directly with our perfumer to craft something entirely yours — from initial accord to final formula. Limited to 12 commissions per season.
          </p>
          <button className="bg-charcoal text-ivory text-xs tracking-widest font-medium px-8 py-3.5 border border-ivory/20 cursor-pointer hover:bg-bronze hover:border-bronze transition-colors">
            Inquire Now
          </button>
        </div>

        {/* Stats grid */}
        <div className="flex-1 grid grid-cols-3 gap-px bg-[#2e2a24]">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-charcoal p-8 text-center">
              <p className="font-playfair text-bronze text-3xl mb-2">{value}</p>
              <p className="text-mist text-xs tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
