'use client';

import { useState } from 'react';
import AdditionalTravelers from './AdditionalTravelers';

export default function ClientForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    number_of_travelers: 1,
    group_type: 'Individual',
    arrival_date: '',
    departure_date: '',
    dietary_restrictions: [],
    accessibility_needs: [],
    preferred_language: '',
    custom_activities: '',
    food_preferences: '',
    additional_inquiries: '',
    gdpr_consent: false
  });

  const [additionalTravelers, setAdditionalTravelers] = useState([]);
  const [travelerIdCounter, setTravelerIdCounter] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const updateTravelerCount = (count) => {
    const numTravelers = parseInt(count) || 1;
    setFormData(prev => ({ ...prev, number_of_travelers: numTravelers }));

    if (numTravelers > 1) {
      const additionalCount = numTravelers - 1;
      const currentCount = additionalTravelers.length;

      if (additionalCount > currentCount) {
        // Add more travelers with unique IDs
        const newTravelers = Array(additionalCount - currentCount).fill().map(() => ({
          id: `traveler_${travelerIdCounter + 1}`, // Unique ID for React keys
          name: '',
          email: '',
          phone: '',
          age_group: '',
          relationship: '',
          dietary_restrictions: [],
          special_notes: ''
        }));
        setAdditionalTravelers(prev => [...prev, ...newTravelers]);
        setTravelerIdCounter(prev => prev + (additionalCount - currentCount));
      } else if (additionalCount < currentCount) {
        // Remove travelers
        setAdditionalTravelers(prev => prev.slice(0, additionalCount));
      }
    } else {
      setAdditionalTravelers([]);
    }
  };

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.phone) {
      setSubmitMessage('Please fill in all required fields');
      return false;
    }

    if (!formData.gdpr_consent) {
      setSubmitMessage('Please accept the GDPR consent');
      return false;
    }

    // Validate additional travelers
    for (let i = 0; i < additionalTravelers.length; i++) {
      if (!additionalTravelers[i].name) {
        setSubmitMessage(`Please enter name for traveler ${i + 2}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const submitData = {
        ...formData,
        additional_travelers: additionalTravelers
      };

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Form submitted successfully!');
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          number_of_travelers: 1,
          group_type: 'Individual',
          arrival_date: '',
          departure_date: '',
          dietary_restrictions: [],
          accessibility_needs: [],
          preferred_language: '',
          custom_activities: '',
          food_preferences: '',
          additional_inquiries: '',
          gdpr_consent: false
        });
        setAdditionalTravelers([]);
        setTravelerIdCounter(0);
      } else {
        setSubmitMessage(result.message || 'Submission failed');
      }
    } catch (error) {
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border border-gray-200">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CARDEX Luxury Morocco Travel</h1>
          <p className="text-xl text-gray-700">Pre-Arrival Needs & Inquiries Form</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { number: 1, label: 'Personal Info', active: true },
              { number: 2, label: 'Travel Details', active: true },
              { number: 3, label: 'Preferences', active: true },
              { number: 4, label: 'Submit', active: false }
            ].map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step circle */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`
                    w-12 h-12
                    rounded-full
                    flex items-center justify-center
                    font-bold text-lg
                    transition-all duration-300
                    ${step.active
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {step.number}
                  </div>
                  <span className={`
                    mt-2 text-sm font-medium
                    ${step.active ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < 3 && (
                  <div className={`
                    h-1 flex-1 mx-2
                    transition-all duration-300
                    ${step.active ? 'bg-blue-600' : 'bg-gray-200'}
                  `}/>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">📍</span>
              Basic Information
            </h2>
            <p className="text-gray-600 text-lg">Tell us about yourself and your travel plans</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
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
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
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
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Number of Travelers
              </label>
              <input
                type="number"
                name="number_of_travelers"
                value={formData.number_of_travelers}
                onChange={(e) => updateTravelerCount(e.target.value)}
                className="
                  w-full
                  px-4 py-3.5
                  text-gray-900
                  font-semibold
                  text-lg
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
                "
                min="1"
                max="50"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-800 font-semibold mb-4 text-base">
                Group Type
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="
                  flex-1
                  flex items-center justify-center gap-3
                  px-6 py-4
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  cursor-pointer
                  transition-all duration-200
                  hover:border-blue-500
                  hover:bg-blue-50
                  has-[:checked]:border-blue-600
                  has-[:checked]:bg-blue-50
                  has-[:checked]:ring-4
                  has-[:checked]:ring-blue-100
                ">
                  <input
                    type="radio"
                    name="group_type"
                    value="Individual"
                    checked={formData.group_type === 'Individual'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-semibold text-lg">👤 Individual</span>
                </label>

                <label className="
                  flex-1
                  flex items-center justify-center gap-3
                  px-6 py-4
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  cursor-pointer
                  transition-all duration-200
                  hover:border-blue-500
                  hover:bg-blue-50
                  has-[:checked]:border-blue-600
                  has-[:checked]:bg-blue-50
                  has-[:checked]:ring-4
                  has-[:checked]:ring-blue-100
                ">
                  <input
                    type="radio"
                    name="group_type"
                    value="Family"
                    checked={formData.group_type === 'Family'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-semibold text-lg">👨‍👩‍👧‍👦 Family</span>
                </label>

                <label className="
                  flex-1
                  flex items-center justify-center gap-3
                  px-6 py-4
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  cursor-pointer
                  transition-all duration-200
                  hover:border-blue-500
                  hover:bg-blue-50
                  has-[:checked]:border-blue-600
                  has-[:checked]:bg-blue-50
                  has-[:checked]:ring-4
                  has-[:checked]:ring-blue-100
                ">
                  <input
                    type="radio"
                    name="group_type"
                    value="Group"
                    checked={formData.group_type === 'Group'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-semibold text-lg">👥 Group</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Separator between sections */}
        <div className="my-12 border-t-2 border-gray-200"></div>

        {/* Travel Preferences */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">✈️</span>
              Travel Preferences
            </h2>
            <p className="text-gray-600 text-lg">Tell us about your travel dates and accommodation preferences</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Arrival Date
              </label>
              <input
                type="date"
                name="arrival_date"
                value={formData.arrival_date}
                onChange={handleInputChange}
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
                "
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Departure Date
              </label>
              <input
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleInputChange}
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
                "
              />
            </div>

          </div>
        </div>

        {/* Separator between sections */}
        <div className="my-12 border-t-2 border-gray-200"></div>

        {/* Dietary Restrictions */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">🥗</span>
              Dietary Restrictions
            </h2>
            <p className="text-gray-600 text-lg">Let us know about any dietary requirements for your journey</p>
          </div>

          <div className="space-y-6">
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
              ">
                <input
                  type="checkbox"
                  checked={formData.dietary_restrictions.includes(option)}
                  onChange={(e) => handleArrayChange('dietary_restrictions', option, e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-900 font-medium">🥗 {option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Separator between sections */}
        <div className="my-12 border-t-2 border-gray-200"></div>

        {/* Accessibility Needs */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">♿</span>
              Accessibility Needs
            </h2>
            <p className="text-gray-600 text-lg">Help us ensure your journey is comfortable and accessible</p>
          </div>

          <div className="space-y-6">
            {['Wheelchair access', 'Hearing assistance', 'Visual assistance', 'Mobility assistance', 'None'].map(option => (
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
              ">
                <input
                  type="checkbox"
                  checked={formData.accessibility_needs.includes(option)}
                  onChange={(e) => handleArrayChange('accessibility_needs', option, e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-900 font-medium">♿ {option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Separator between sections */}
        <div className="my-12 border-t-2 border-gray-200"></div>

        {/* Additional Information */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">💬</span>
              Additional Information
            </h2>
            <p className="text-gray-600 text-lg">Share any additional preferences or special requests</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Preferred Language
              </label>
              <select
                name="preferred_language"
                value={formData.preferred_language}
                onChange={handleInputChange}
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
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Arabic">Arabic</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Custom Activities
              </label>
              <textarea
                name="custom_activities"
                value={formData.custom_activities}
                onChange={handleInputChange}
                rows={3}
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
                  min-h-[120px]
                "
                placeholder="Any specific activities or experiences you're interested in..."
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Food Preferences
              </label>
              <textarea
                name="food_preferences"
                value={formData.food_preferences}
                onChange={handleInputChange}
                rows={3}
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
                  min-h-[120px]
                "
                placeholder="Any food preferences or favorite cuisines..."
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-base">
                Additional Inquiries
              </label>
              <textarea
                name="additional_inquiries"
                value={formData.additional_inquiries}
                onChange={handleInputChange}
                rows={3}
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
                  min-h-[120px]
                "
                placeholder="Any other questions or special requests..."
              />
            </div>
          </div>
        </div>

        {/* Additional Travelers */}
        <AdditionalTravelers
          travelers={additionalTravelers}
          setTravelers={setAdditionalTravelers}
        />

        {/* GDPR Consent */}
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="gdpr_consent"
              checked={formData.gdpr_consent}
              onChange={handleInputChange}
              className="mt-1 mr-3"
              required
            />
            <div className="text-sm">
              <span className="font-medium text-red-800">GDPR Consent Required *</span>
              <p className="text-red-700 mt-1">
                I consent to CARDEX collecting and processing my personal data for the purpose of providing luxury travel services in Morocco. I understand my data will be stored securely and used only for this purpose.
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              group
              w-full
              px-8 py-5
              bg-gradient-to-r from-blue-600 to-blue-700
              text-white
              text-lg font-bold
              rounded-xl
              shadow-lg
              hover:shadow-2xl
              hover:from-blue-700
              hover:to-blue-800
              focus:outline-none
              focus:ring-4
              focus:ring-blue-300
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:shadow-lg
              transform
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all
              duration-200
            "
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Submitting Your Journey...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span>Submit My Travel Preferences</span>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Premium Success/Error Messages */}
      {submitMessage && (
        submitMessage.includes('success') ? (
          <div className="
            fixed top-8 left-1/2 transform -translate-x-1/2
            w-full max-w-md
            bg-green-50
            border-l-4 border-green-500
            rounded-xl
            shadow-2xl
            p-6
            animate-slide-down
            z-50
          ">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-green-900 font-bold text-lg mb-1">
                  Success!
                </h3>
                <p className="text-green-800 font-medium">
                  {submitMessage}
                </p>
              </div>
              <button
                onClick={() => setSubmitMessage('')}
                className="text-green-600 hover:text-green-800 font-bold text-xl"
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <div className="
            fixed top-8 left-1/2 transform -translate-x-1/2
            w-full max-w-md
            bg-red-50
            border-l-4 border-red-500
            rounded-xl
            shadow-2xl
            p-6
            animate-slide-down
            z-50
          ">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-red-900 font-bold text-lg mb-1">
                  Error
                </h3>
                <p className="text-red-800 font-medium">
                  {submitMessage}
                </p>
              </div>
              <button
                onClick={() => setSubmitMessage('')}
                className="text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )
      )}
      </div>
    </div>
  );
}