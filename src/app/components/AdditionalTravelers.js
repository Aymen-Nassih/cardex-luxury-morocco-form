'use client';

import FileUpload from './FileUpload';

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
    <div className="mb-10 sm:mb-12">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
          <span className="text-3xl sm:text-4xl">👥</span>
          Additional Travelers
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">Please provide details for each person traveling with you</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {travelers.map((traveler, index) => (
          <div
            key={traveler.id || `traveler-${index}`}
            className="
              bg-gradient-to-br from-orange-50 to-white
              border-2 border-orange-200
              rounded-xl sm:rounded-2xl
              p-4 sm:p-6 md:p-8
              shadow-lg
              hover:shadow-xl
              transition-all duration-300
              overflow-visible
              relative
              z-10
            "
          >
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-orange-200">
              <div className="w-10 h-10 sm:w-12 sm:h-14 bg-[#B5541B] rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl shadow-lg flex-shrink-0">
                {index + 2}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Traveler {index + 2}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 font-medium leading-tight">
                  Additional guest information
                </p>
              </div>
            </div>

            {/* Form fields with same styling as main form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Traveler Name - Required */}
              <div className="sm:col-span-2">
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
                    focus:border-orange-600
                    focus:ring-4
                    focus:ring-orange-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                  "
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Age - Optional */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                  Age
                </label>
                <input
                  type="number"
                  value={traveler.age || ''}
                  onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                  className="
                    w-full
                    px-4 py-3.5
                    text-gray-900
                    font-medium
                    bg-white
                    border-2 border-gray-300
                    rounded-xl
                    placeholder:text-gray-400
                    focus:border-[#B5541B]
                    focus:ring-4
                    focus:ring-orange-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                  "
                  placeholder="Enter age"
                  min="0"
                  max="120"
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
                    focus:border-[#B5541B]
                    focus:ring-4
                    focus:ring-orange-100
                    focus:outline-none
                    transition-all
                    duration-200
                    hover:border-gray-400
                  "
                  placeholder="+1-XXX-XXX-XXXX"
                />
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
                    focus:border-orange-600
                    focus:ring-4
                    focus:ring-orange-100
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

            {/* Travel Information - Optional */}
            <div className="mt-6">
              <div className="mb-4">
                <label className="
                  flex items-center gap-3
                  px-4 py-3
                  bg-white
                  border-2 border-gray-300
                  rounded-lg
                  cursor-pointer
                  transition-all duration-200
                  hover:border-[#B5541B]
                  hover:bg-orange-50
                  has-[:checked]:border-[#B5541B]
                  has-[:checked]:bg-orange-50
                  has-[:checked]:ring-2
                  has-[:checked]:ring-orange-200
                  min-h-[50px]
                  overflow-visible
                ">
                  <input
                    type="checkbox"
                    checked={traveler.has_different_travel || false}
                    onChange={(e) => handleTravelerChange(index, 'has_different_travel', e.target.checked)}
                    className="w-5 h-5 text-[#B5541B] rounded focus:ring-2 focus:ring-[#B5541B] flex-shrink-0"
                  />
                  <span className="text-gray-900 font-medium leading-tight">✈️ This traveler flies on another plane</span>
                </label>
                <p className="text-sm text-gray-600 italic mt-2">
                  <strong>Not mandatory.</strong> Only the traveler that flies on another plane must fill this section. Leave unchecked if traveling on the same plane as the main group.
                </p>
              </div>

              {traveler.has_different_travel && (
                <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Arrival Date
                      </label>
                      <input
                        type="date"
                        value={traveler.arrival_date || ''}
                        onChange={(e) => handleTravelerChange(index, 'arrival_date', e.target.value)}
                        className="
                          w-full
                          px-4 py-3.5
                          text-gray-900
                          font-medium
                          bg-white
                          border-2 border-gray-300
                          rounded-xl
                          focus:border-[#B5541B]
                          focus:ring-4
                          focus:ring-orange-100
                          focus:outline-none
                          transition-all
                          duration-200
                          hover:border-gray-400
                        "
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Departure Date
                      </label>
                      <input
                        type="date"
                        value={traveler.departure_date || ''}
                        onChange={(e) => handleTravelerChange(index, 'departure_date', e.target.value)}
                        className="
                          w-full
                          px-4 py-3.5
                          text-gray-900
                          font-medium
                          bg-white
                          border-2 border-gray-300
                          rounded-xl
                          focus:border-[#B5541B]
                          focus:ring-4
                          focus:ring-orange-100
                          focus:outline-none
                          transition-all
                          duration-200
                          hover:border-gray-400
                        "
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Flight Number
                      </label>
                      <input
                        type="text"
                        value={traveler.flight_number || ''}
                        onChange={(e) => handleTravelerChange(index, 'flight_number', e.target.value)}
                        className="
                          w-full
                          px-4 py-3.5
                          text-gray-900
                          font-medium
                          bg-white
                          border-2 border-gray-300
                          rounded-xl
                          placeholder:text-gray-400
                          focus:border-[#B5541B]
                          focus:ring-4
                          focus:ring-orange-100
                          focus:outline-none
                          transition-all
                          duration-200
                          hover:border-gray-400
                        "
                        placeholder="e.g., AT205, RAM123"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        value={traveler.arrival_time || ''}
                        onChange={(e) => handleTravelerChange(index, 'arrival_time', e.target.value)}
                        className="
                          w-full
                          px-4 py-3.5
                          text-gray-900
                          font-medium
                          bg-white
                          border-2 border-gray-300
                          rounded-xl
                          focus:border-orange-600
                          focus:ring-4
                          focus:ring-orange-100
                          focus:outline-none
                          transition-all
                          duration-200
                          hover:border-gray-400
                          cursor-pointer
                        "
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        City of Arrival
                      </label>
                      <select
                        value={traveler.city_of_arrival || ''}
                        onChange={(e) => handleTravelerChange(index, 'city_of_arrival', e.target.value)}
                        className="
                          w-full
                          px-4 py-3.5
                          text-gray-900
                          font-medium
                          bg-white
                          border-2 border-gray-300
                          rounded-xl
                          focus:border-orange-600
                          focus:ring-4
                          focus:ring-orange-100
                          focus:outline-none
                          transition-all
                          duration-200
                          hover:border-gray-400
                          cursor-pointer
                        "
                      >
                        <option value="">Select arrival city...</option>
                        <option value="CMN">Casablanca (CMN - Mohammed V International Airport)</option>
                        <option value="RAK">Marrakech (RAK - Menara Airport)</option>
                        <option value="FEZ">Fes (FEZ - Saïss Airport)</option>
                        <option value="TNG">Tangier (TNG - Ibn Battouta Airport)</option>
                        <option value="RBA">Rabat (RBA - Rabat-Salé Airport)</option>
                        <option value="AGA">Agadir (AGA - Al Massira Airport)</option>
                        <option value="ESU">Essaouira (ESU - Mogador Airport)</option>
                        <option value="OZZ">Ouarzazate (OZZ - Ouarzazate Airport)</option>
                        <option value="NDR">Nador (NDR - Nador International Airport)</option>
                        <option value="OUD">Oujda (OUD - Angads Airport)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

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
                    hover:border-[#B5541B]
                    hover:bg-orange-50
                    has-[:checked]:border-[#B5541B]
                    has-[:checked]:bg-orange-50
                    has-[:checked]:ring-2
                    has-[:checked]:ring-orange-200
                    min-h-[50px]
                    overflow-visible
                  ">
                    <input
                      type="checkbox"
                      checked={(traveler.dietary_restrictions || []).includes(option)}
                      onChange={(e) => {
                        handleTravelerArrayChange(index, 'dietary_restrictions', option, e.target.checked);
                        // Clear other text if "Other" is deselected
                        if (option === 'Other' && !e.target.checked) {
                          handleTravelerChange(index, 'dietary_restrictions_other', '');
                        }
                      }}
                      className="w-5 h-5 text-[#B5541B] rounded focus:ring-2 focus:ring-[#B5541B] flex-shrink-0"
                    />
                    <span className="text-gray-900 font-medium leading-tight">🥗 {option}</span>
                  </label>
                ))}
              </div>
              
              {/* Other text input - shown when "Other" is selected */}
              {(traveler.dietary_restrictions || []).includes('Other') && (
                <div className="mt-4">
                  <label className="block text-gray-800 font-semibold mb-2 text-base leading-tight">
                    Please specify your dietary requirement
                  </label>
                  <input
                    type="text"
                    value={traveler.dietary_restrictions_other || ''}
                    onChange={(e) => handleTravelerChange(index, 'dietary_restrictions_other', e.target.value)}
                    placeholder="Enter your dietary requirement..."
                    className="
                      w-full
                      px-4 py-3.5
                      text-gray-900
                      font-medium
                      bg-white
                      border-2 border-gray-300
                      rounded-xl
                      placeholder:text-gray-400
                      focus:border-[#B5541B]
                      focus:ring-4
                      focus:ring-orange-100
                      focus:outline-none
                      transition-all
                      duration-200
                      hover:border-gray-400
                    "
                  />
                </div>
              )}
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
                  focus:border-orange-600
                  focus:ring-4
                  focus:ring-orange-100
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

            {/* Passport Upload */}
            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600 text-lg">📘</span>
                  <h4 className="font-semibold text-blue-900">Passport Document</h4>
                </div>
                <FileUpload
                  label={`Passport for ${traveler.name || `Traveler ${index + 2}`}`}
                  accept="image/*,.pdf"
                  maxSize={10 * 1024 * 1024} // 10MB
                  onFileSelect={(file) => handleTravelerChange(index, 'passport_file', file)}
                  currentFile={traveler.passport_file}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}