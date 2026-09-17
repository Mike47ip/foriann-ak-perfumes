import BottleIllustration from "./BottleIllustration";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] bg-charcoal flex items-center overflow-hidden">
      {/* Background orbs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          background: "#b8916a",
          top: -100, right: -100,
          filter: "blur(80px)",
          opacity: 0.18,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 300, height: 300,
          background: "#7a8f7a",
          bottom: 0, left: "10%",
          filter: "blur(80px)",
          opacity: 0.18,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12 pt-40">
        {/* Text */}
        <div className="flex-1">
          <p className="text-bronze pt-12 text-xs tracking-[.25em] mb-6">EXCLUSIVELY CRAFTED</p>
          <h1
            className="font-playfair text-ivory font-medium leading-tight mb-6"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
          >
            Wear your
            <br />
            <em>invisible</em>
            <br />
            signature.
          </h1>
          <p className="text-mist text-sm leading-relaxed max-w-sm mb-10">
            Each bottle holds a conversation between rare ingredients, time, and the person who wears it. Find yours.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#shop"
              className="bg-charcoal text-ivory text-xs tracking-widest font-medium px-8 py-3.5 hover:bg-bronze transition-colors no-underline"
            >
              Explore Collection
            </a>
            <button className="text-ivory text-xs tracking-widest border-b border-bronze pb-0.5 bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer">
              OUR STORY
            </button>
          </div>
        </div>

        {/* Bottle */}
        <div className="flex-1 flex justify-center items-end relative" style={{ maxWidth: 380 }}>
          <div className="bottle-glow" />
          <BottleIllustration />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-y z-10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(247,242,234,.4)" strokeWidth={1.5}>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
