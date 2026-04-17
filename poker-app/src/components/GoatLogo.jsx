export default function GoatLogo({ size = 44, opacity = 1 }) {
  const id = `goat-grad-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, flexShrink: 0 }}
      aria-label="Golden Goats logo"
    >
      <defs>
        <linearGradient id={id} x1="50" y1="120" x2="50" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="45%" stopColor="#f7c948" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      {/* Body */}
      <path
        d="M30 95 C20 90 15 78 18 65 C21 52 28 48 32 42 C36 36 34 28 38 22 C41 17 47 14 50 12
           C48 18 46 24 48 30 C50 35 55 37 58 34 C62 30 63 22 61 16
           C65 18 68 24 67 31 C66 37 62 40 60 46 C58 52 60 58 64 62
           C68 66 74 66 78 70 C83 75 82 84 78 90 C74 96 66 100 58 101
           C50 102 42 102 36 100 C33 99 31 97 30 95 Z"
        fill={`url(#${id})`}
      />
      {/* Head */}
      <ellipse cx="50" cy="13" rx="10" ry="9" fill={`url(#${id})`} />
      {/* Horn left */}
      <path
        d="M44 6 C42 0 38 -2 36 2 C34 5 36 10 40 8"
        stroke={`url(#${id})`}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Horn right */}
      <path
        d="M56 5 C58 -1 62 -3 64 1 C66 4 64 9 60 7"
        stroke={`url(#${id})`}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ear */}
      <ellipse cx="41" cy="15" rx="4" ry="3" transform="rotate(-20 41 15)" fill={`url(#${id})`} />
      {/* Front legs */}
      <path d="M36 94 L32 110 L36 110 L38 96" fill={`url(#${id})`} />
      <path d="M46 96 L44 112 L48 112 L50 98" fill={`url(#${id})`} />
      {/* Back legs */}
      <path d="M60 98 L58 114 L62 114 L64 100" fill={`url(#${id})`} />
      <path d="M70 94 L70 110 L74 110 L74 96" fill={`url(#${id})`} />
      {/* Tail */}
      <path
        d="M78 72 C84 68 88 62 86 58 C84 54 80 56 78 60"
        stroke={`url(#${id})`}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Beard */}
      <path
        d="M50 20 C48 26 47 30 48 34"
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eye */}
      <circle cx="55" cy="11" r="1.5" fill="#0e0c1e" />
      {/* Rock base */}
      <path
        d="M20 112 C22 108 28 106 36 107 C44 108 56 108 66 107 C74 106 80 108 82 112 Z"
        fill={`url(#${id})`}
        opacity="0.6"
      />
    </svg>
  );
}
