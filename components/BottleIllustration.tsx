export default function BottleIllustration() {
  return (
    <svg
      width="220"
      height="380"
      viewBox="0 0 220 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 30px 60px rgba(184,145,106,.3))" }}
    >
      {/* Cap */}
      <rect x="82" y="10" width="56" height="38" rx="6" fill="#2e2a24" stroke="#b8916a" strokeWidth="1" />
      <rect x="90" y="4" width="40" height="12" rx="3" fill="#3a3530" />

      {/* Neck */}
      <rect x="92" y="48" width="36" height="28" rx="3" fill="#2a2620" stroke="#b8916a" strokeWidth=".5" />

      {/* Body */}
      <path
        d="M75 76 Q75 110 55 130 L55 310 Q55 330 110 330 Q165 330 165 310 L165 130 Q145 110 145 76 Z"
        fill="#1e1c19"
        stroke="#b8916a"
        strokeWidth=".8"
      />

      {/* Inner highlight */}
      <path
        d="M90 110 L90 300 Q90 318 110 320 Q128 320 128 302 L128 110"
        fill="none"
        stroke="rgba(184,145,106,.15)"
        strokeWidth="1"
      />

      {/* Liquid */}
      <clipPath id="bottleClip">
        <path d="M76 130 L56 310 Q56 329 110 329 Q164 329 164 310 L144 130Z" />
      </clipPath>
      <g clipPath="url(#bottleClip)">
        <rect x="55" y="150" width="110" height="180" fill="rgba(184,145,106,.18)" />
        <ellipse cx="110" cy="150" rx="55" ry="8" fill="rgba(184,145,106,.25)" />
      </g>

      {/* Label */}
      <rect
        x="68" y="165" width="84" height="110" rx="2"
        fill="rgba(247,242,234,.06)"
        stroke="rgba(247,242,234,.2)"
        strokeWidth=".7"
      />
      <text x="110" y="200" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="11" fill="rgba(247,242,234,.85)" fontStyle="italic">
        f
      </text>
      <line x1="78" y1="210" x2="142" y2="210" stroke="rgba(184,145,106,.5)" strokeWidth=".5" />
      <text x="110" y="226" textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize="7" fill="rgba(247,242,234,.5)" letterSpacing="3">
        EAU DE PARFUM
      </text>
      <text x="110" y="248" textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize="7" fill="rgba(184,145,106,.7)" letterSpacing="2">
        50 ML
      </text>

      {/* Bottom */}
      <ellipse cx="110" cy="325" rx="55" ry="6" fill="#2e2a24" />

      {/* Edge highlight */}
      <path d="M78 100 Q70 160 65 250" stroke="rgba(255,255,255,.07)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
