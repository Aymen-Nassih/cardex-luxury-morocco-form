'use client';

export default function ExperienceMoroccoLogo({ size = 'large' }) {
  const sizes = {
    small: { fontSize: 'text-lg', subSize: 'text-xs', padding: 'p-2' },
    medium: { fontSize: 'text-xl', subSize: 'text-sm', padding: 'p-3' },
    large: { fontSize: 'text-2xl', subSize: 'text-base', padding: 'p-4' }
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center ${s.padding}`}>
      {/* Text-based Logo */}
      <div className="text-center">
        <h1 className={`${s.fontSize} font-bold text-[#B5541B] tracking-wide`}>
          ✈️ Experience Morocco
        </h1>
        <p className={`${s.subSize} text-[#9B4722] font-medium mt-1`}>
          Luxury Travel Experiences
        </p>
      </div>
    </div>
  );
}