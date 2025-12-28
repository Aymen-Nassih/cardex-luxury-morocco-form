import CardexLogo from './components/CardexLogo';
import ClientForm from './components/ClientForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-moroccan-pattern">
      {/* Premium Header Design */}
      <div className="bg-gradient-to-br from-[#B5541B] via-[#9B4722] to-[#7a3819] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl sm:shadow-2xl mb-6 sm:mb-8">
              <CardexLogo size="large" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white drop-shadow-lg px-2">
              Luxury Morocco Experience
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl md:text-2xl text-orange-100 mb-2 sm:mb-3 max-w-3xl mx-auto px-2">
              Begin your journey to discover the magic of Morocco
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-orange-200 max-w-2xl mx-auto px-2">
              From ancient medinas to golden dunes, create unforgettable memories
            </p>
          </div>
        </div>

        {/* Wave separator */}
        <div className="relative h-12 sm:h-16">
          <svg
            className="absolute bottom-0 w-full h-16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Decorative Wave Separator */}
      <div className="relative h-12 sm:h-16 bg-ocean-gradient">
        <svg
          className="absolute bottom-0 w-full h-12 sm:h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#f5f6fa"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-morocco-orange-100 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">✈️</span>
              <span className="text-morocco-orange-700 font-semibold text-sm sm:text-base">Plan Your Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#B5541B] mb-2 sm:mb-3 px-2">
              Tell Us About Your Travel Dreams
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
              Fill out the form below and let us create your perfect Moroccan adventure
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-travel p-4 sm:p-6 md:p-8 lg:p-12 border-t-4 border-morocco-orange-500">
            <ClientForm />
          </div>

          {/* REMOVED: Trust Indicators Section
             Previously contained three stat boxes:
             - "7,000+ Happy Travelers" with trophy icon 🏆
             - "4.9/5 Average Rating" with star icon ⭐
             - "15+ Years Experience" with globe icon 🌍
             All stat boxes and associated styling have been completely removed.
          */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#5a2911] text-white py-6 sm:py-8 mt-12 sm:mt-16 md:mt-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <CardexLogo size="small" />
          <p className="mt-3 sm:mt-4 text-orange-200 text-sm sm:text-base px-2">
            Creating unforgettable Moroccan experiences since 2009
          </p>
        </div>
      </footer>
    </div>
  );
}
