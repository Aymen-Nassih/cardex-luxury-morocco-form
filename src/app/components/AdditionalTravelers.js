'use client';

export default function AdditionalTravelers({ travelers, setTravelers }) {
  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
    setTravelers(updatedTravelers);
  };

  const handleTravelerArrayChange = (index, field, value, checked) => {
    const updatedTravelers = [...travelers];
    const currentArray = updatedTravelers[index][field] || [];
    updatedTravelers[index][field] = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    setTravelers(updatedTravelers);
  };

  if (travelers.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <span className="text-4xl">👥</span>
          Additional Travelers
        </h2>
        <p className="text-gray-600 text-lg">Please provide details for each person traveling with you</p>
      </div>

      <div className="space-y-6">
        {travelers.map((traveler, index) => (
          <div
            key={`traveler-${traveler.id || index}-${Date.now()}`}
            className="
              bg-gradient-to-br from-blue-50 to-white
              border-2 border-blue-200
              rounded-2xl
              p-8
              shadow-lg
              hover:shadow-xl
              transition-all duration-300
              overflow-visible
              min-h-[600px]
              relative
              z-10
            "
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-blue-200">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {index + 2}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                  Traveler {index + 2}
                </h3>
                <p className="text-gray-700 font-medium leading-tight">
                  Additional guest information
                </p>
              </div>
            </div>

            {/* Form fields with same styling as main form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traveler Name - Required */}
              <div className="lg:col-span-2">
                <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={traveler.name || ''}
                  onChange={(e) => handleTravelerChange(index, 'name', e.target.value)}
                  className="
                    w-full
                    px-4 py-3.5
                    text-gray-900
                    font-medium
                    bg-white
                    border-2 border-gray-300
                    rounded-xl
                    placeholder:text-gray-400
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                  "
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email - Optional */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                  Email
                </label>
                <input
                  type="email"
                  value={traveler.email || ''}
                  onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                  className="
                    w-full
                    px-4 py-3.5
                    text-gray-900
                    font-medium
                    bg-white
                    border-2 border-gray-300
                    rounded-xl
                    placeholder:text-gray-400
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                  "
                  placeholder="email@example.com"
                />
              </div>

              {/* Phone - Optional */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                  Phone
                </label>
                <input
                  type="tel"
                  value={traveler.phone || ''}
                  onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                  className="
                    w-full
                    px-4 py-3.5
                    text-gray-900
                    font-medium
                    bg-white
                    border-2 border-gray-300
                    rounded-xl
                    placeholder:text-gray-400
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                  "
                  placeholder="+1-XXX-XXX-XXXX"
                />
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                  Age Group
                </label>
                <select
                  value={traveler.age_group || ''}
                  onChange={(e) => handleTravelerChange(index, 'age_group', e.target.value)}
                  className="
                    w-full
                    px-4 py-3.5
                    text-gray-900
                    font-medium
                    bg-white
                    border-2 border-gray-300
                    rounded-xl
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                    cursor-pointer
                  "
                >
                  <option value="">Select...</option>
                  <option value="Child">Child (0-12)</option>
                  <option value="Teen">Teen (13-19)</option>
                  <option value="Adult">Adult (20-64)</option>
                  <option value="Senior">Senior (65+)</option>
                </select>
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                  Relationship
                </label>
                <select
                  value={traveler.relationship || ''}
                  onChange={(e) => handleTravelerChange(index, 'relationship', e.target.value)}
                  className="
                    w-full
                    px-4 py-3.5
                    text-gray-900
                    font-medium
                    bg-white
                    border-2 border-gray-300
                    rounded-xl
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                    cursor-pointer
                  "
                >
                  <option value="">Select...</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="mt-6">
              <label className="block text-gray-800 font-semibold mb-4 text-base leading-tight">
                Dietary Restrictions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-visible">
                {['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Dairy-free', 'Nut-free', 'Other'].map(option => (
                  <label key={option} className="
                    flex items-center gap-3
                    px-4 py-3
                    bg-white
                    border-2 border-gray-300
                    rounded-lg
                    cursor-pointer
                    transition-all duration-200
                    hover:border-blue-500
                    hover:bg-blue-50
                    has-[:checked]:border-blue-600
                    has-[:checked]:bg-blue-50
                    has-[:checked]:ring-2
                    has-[:checked]:ring-blue-200
                    min-h-[50px]
                    overflow-visible
                  ">
                    <input
                      type="checkbox"
                      checked={(traveler.dietary_restrictions || []).includes(option)}
                      onChange={(e) => handleTravelerArrayChange(index, 'dietary_restrictions', option, e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="text-gray-900 font-medium leading-tight">🥗 {option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <div className="mt-6">
              <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                Special Notes
              </label>
              <textarea
                value={traveler.special_notes || ''}
                onChange={(e) => handleTravelerChange(index, 'special_notes', e.target.value)}
                rows={4}
                className="
                  w-full
                  px-4 py-3.5
                  text-gray-900
                  font-medium
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  placeholder:text-gray-400
                  focus:border-blue-600
                  focus:ring-4
                  focus:ring-blue-100
                  focus:outline-none
                  transition-all
                  duration-200
                  hover:border-gray-400
                  resize-vertical
                  min-h-[140px]
                  overflow-visible
                "
                placeholder="Any special requirements, preferences, or notes for this traveler..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}