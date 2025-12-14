import CardexLogo from './components/CardexLogo';
import ClientForm from './components/ClientForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-moroccan-pattern">
      {/* Premium Header Design */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-block bg-white rounded-2xl p-6 shadow-2xl mb-8">
              <CardexLogo size="large" />
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Luxury Morocco Experience
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-blue-100 mb-3 max-w-3xl mx-auto">
              Begin your journey to discover the magic of Morocco
            </p>

            {/* Description */}
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              From ancient medinas to golden dunes, create unforgettable memories
            </p>
          </div>
        </div>

        {/* Wave separator */}
        <div className="relative h-16">
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
      <div className="relative h-16 bg-ocean-gradient">
        <svg
          className="absolute bottom-0 w-full h-16"
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-morocco-orange-100 px-6 py-2 rounded-full mb-4">
              <span className="text-2xl">✈️</span>
              <span className="text-morocco-orange-700 font-semibold">Plan Your Journey</span>
            </div>
            <h2 className="text-3xl font-bold text-morocco-blue-700 mb-3">
              Tell Us About Your Travel Dreams
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and let us create your perfect Moroccan adventure
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-travel p-8 md:p-12 border-t-4 border-morocco-orange-500">
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
      <footer className="bg-morocco-blue-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <CardexLogo size="small" />
          <p className="mt-4 text-blue-200">
            Creating unforgettable Moroccan experiences since 2009
          </p>
        </div>
      </footer>
    </div>
  );
}
