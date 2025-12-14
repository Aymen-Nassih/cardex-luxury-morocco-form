'use client';

export default function CardexLogo({ size = 'large' }) {
  const sizes = {
    small: { width: 120, height: 60, fontSize: '24px', tagline: '10px' },
    medium: { width: 180, height: 90, fontSize: '36px', tagline: '12px' },
    large: { width: 240, height: 120, fontSize: '48px', tagline: '14px' }
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Logo SVG */}
      <svg
        width={s.width}
        height={s.height}
        viewBox="0 0 400 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Decorative circle background */}
        <circle cx="80" cy="100" r="45" fill="#0066cc" opacity="0.1"/>

        {/* Riad Building Icon */}
        <g transform="translate(80, 100)">
          {/* Main building base */}
          <rect x="-40" y="-25" width="80" height="50" fill="#d4a574" stroke="#8b6f47" strokeWidth="2"/>

          {/* Moroccan arch doorway */}
          <path
            d="M -15,-25 L -15,10 Q -15,20 0,20 Q 15,20 15,10 L 15,-25"
            fill="#2c5f8d"
            stroke="#1a3d5c"
            strokeWidth="2"
          />

          {/* Inner arch detail */}
          <path
            d="M -10,-25 L -10,8 Q -10,15 0,15 Q 10,15 10,8 L 10,-25"
            fill="#4a8bc2"
            opacity="0.6"
          />

          {/* Decorative tiles pattern - Left */}
          <g opacity="0.7">
            <rect x="-35" y="-15" width="15" height="15" fill="#1a5f7a"/>
            <rect x="-35" y="0" width="15" height="15" fill="#2c8ba8"/>
            <circle cx="-27.5" cy="-7.5" r="3" fill="#f4a261"/>
            <circle cx="-27.5" cy="7.5" r="3" fill="#f4a261"/>

            {/* Right tiles */}
            <rect x="20" y="-15" width="15" height="15" fill="#1a5f7a"/>
            <rect x="20" y="0" width="15" height="15" fill="#2c8ba8"/>
            <circle cx="27.5" cy="-7.5" r="3" fill="#f4a261"/>
            <circle cx="27.5" cy="7.5" r="3" fill="#f4a261"/>
          </g>

          {/* Roof with crenellations */}
          <rect x="-42" y="-30" width="84" height="5" fill="#8b6f47"/>
          <rect x="-42" y="-38" width="10" height="8" fill="#8b6f47"/>
          <rect x="-20" y="-38" width="10" height="8" fill="#8b6f47"/>
          <rect x="2" y="-38" width="10" height="8" fill="#8b6f47"/>
          <rect x="24" y="-38" width="10" height="8" fill="#8b6f47"/>

          {/* Courtyard fountain element */}
          <circle cx="0" cy="35" r="8" fill="#4a8bc2" opacity="0.5"/>
          <circle cx="0" cy="35" r="4" fill="#2c5f8d"/>

          {/* Window details */}
          <rect x="-32" y="-8" width="8" height="10" fill="#1a3d5c" opacity="0.6"/>
          <rect x="24" y="-8" width="8" height="10" fill="#1a3d5c" opacity="0.6"/>
        </g>

        {/* Company Name */}
        <text
          x="140"
          y="100"
          fontFamily="Georgia, serif"
          fontSize={s.fontSize}
          fontWeight="bold"
          fill="#1a3d5c"
        >
          CARDEX
        </text>

        {/* Tagline */}
        <text
          x="140"
          y="120"
          fontFamily="Georgia, serif"
          fontSize={s.tagline}
          fill="#8b6f47"
          letterSpacing="2"
        >
          TRAVEL & TOURISM
        </text>

        {/* Decorative Moroccan pattern border */}
        <g transform="translate(140, 130)">
          <path
            d="M 0,0 L 15,0 M 25,0 L 40,0 M 50,0 L 65,0 M 75,0 L 90,0 M 100,0 L 115,0 M 125,0 L 140,0 M 150,0 L 165,0"
            stroke="#f4a261"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="0" r="2.5" fill="#2c5f8d"/>
          <circle cx="45" cy="0" r="2.5" fill="#2c5f8d"/>
          <circle cx="70" cy="0" r="2.5" fill="#2c5f8d"/>
          <circle cx="95" cy="0" r="2.5" fill="#2c5f8d"/>
          <circle cx="120" cy="0" r="2.5" fill="#2c5f8d"/>
          <circle cx="145" cy="0" r="2.5" fill="#2c5f8d"/>
        </g>

        {/* Decorative corner element */}
        <g transform="translate(340, 85)">
          <path d="M 0,0 L 8,-8 M 0,0 L 8,8" stroke="#f4a261" strokeWidth="2" fill="none"/>
          <circle cx="0" cy="0" r="3" fill="#2c5f8d"/>
        </g>
      </svg>
    </div>
  );
}