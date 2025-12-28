'use client';

import { useState } from 'react';
import AdditionalTravelers from './AdditionalTravelers';
import MultiSelect from './MultiSelect';

export default function ClientForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    number_of_travelers: 1,
    group_type: 'Individual',
    occasion_description: '',
    has_different_travel: false,
    arrival_date: '',
    departure_date: '',
    flight_number: '',
    arrival_time: '',
    city_of_arrival: '',
    dietary_restrictions: [],
    dietary_restrictions_other: '',
    accessibility_needs: [],
    accessibility_needs_other: '',
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
          phone: '',
          age: '',
          relationship: '',
          dietary_restrictions: [],
          dietary_restrictions_other: '',
          special_notes: '',
          has_different_travel: false,
          arrival_date: '',
          departure_date: '',
          flight_number: '',
          arrival_time: '',
          city_of_arrival: ''
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
          age: '',
          number_of_travelers: 1,
          group_type: 'Individual',
          occasion_description: '',
          arrival_date: '',
          departure_date: '',
          flight_number: '',
          arrival_time: '',
          city_of_arrival: '',
          dietary_restrictions: [],
          dietary_restrictions_other: '',
          accessibility_needs: [],
          accessibility_needs_other: '',
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white rounded-2xl shadow-lg sm:shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-100">
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Experience Morocco</h1>
          <p className="text-lg sm:text-xl text-gray-700">Travel Curriculum</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-start justify-between max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
            {[
              { number: 1, label: 'Inquiry', active: true },
              { number: 2, label: 'Quotation', active: true },
              { number: 3, label: 'Client Approval', active: true },
              { number: 4, label: 'Booking', active: true },
              { number: 5, label: 'Confirmation', active: false }
            ].map((step, index) => (
              <div key={step.number} className="flex items-center flex-1 relative">
                {/* Step circle */}
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`
                    w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                    rounded-full
                    flex items-center justify-center
                    font-bold text-sm sm:text-base md:text-lg
                    transition-all duration-300
                    ${step.active
                      ? 'bg-[#B5541B] text-white shadow-md sm:shadow-lg ring-4 ring-orange-100'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {step.number}
                  </div>
                  
                  {/* Step label */}
                  <span className={`
                    mt-2 sm:mt-3 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium text-center
                    leading-tight px-0.5 sm:px-1
                    transition-all duration-300
                    ${step.active ? 'text-gray-900 font-semibold' : 'text-gray-500'}
                  `}>
                    {step.label.split(' ').map((word, i, arr) => (
                      <span key={i}>
                        <span className="block sm:inline">{word}</span>
                        {i < arr.length - 1 && <span className="hidden sm:inline"> </span>}
                      </span>
                    ))}
                  </span>
                </div>

                {/* Connector line */}
                {index < 4 && (
                  <div className={`
                    absolute top-5 sm:top-6 md:top-7
                    left-[calc(50%+20px)] sm:left-[calc(50%+24px)] md:left-[calc(50%+28px)]
                    right-[calc(-50%+20px)] sm:right-[calc(-50%+24px)] md:right-[calc(-50%+28px)]
                    h-0.5 sm:h-1
                    transition-all duration-300
                    ${step.active ? 'bg-[#B5541B]' : 'bg-gray-200'}
                  `}/>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">📍</span>
              Basic Information
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Tell us about yourself and your travel plans</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="
                  w-full
                  px-3 py-3 sm:px-4 sm:py-3.5
                  text-gray-900
                  font-medium
                  text-sm sm:text-base
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  placeholder:text-gray-400
                  focus:border-orange-600
                  focus:ring-2 sm:focus:ring-4
                  focus:ring-orange-100
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
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="
                  w-full
                  px-3 py-3 sm:px-4 sm:py-3.5
                  text-gray-900
                  font-medium
                  text-sm sm:text-base
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  placeholder:text-gray-400
                  focus:border-orange-600
                  focus:ring-2 sm:focus:ring-4
                  focus:ring-orange-100
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
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="
                  w-full
                  px-3 py-3 sm:px-4 sm:py-3.5
                  text-gray-900
                  font-medium
                  text-sm sm:text-base
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  placeholder:text-gray-400
                  focus:border-orange-600
                  focus:ring-2 sm:focus:ring-4
                  focus:ring-orange-100
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
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="
                  w-full
                  px-3 py-3 sm:px-4 sm:py-3.5
                  text-gray-900
                  font-medium
                  text-sm sm:text-base
                  bg-white
                  border-2 border-gray-300
                  rounded-xl
                  placeholder:text-gray-400
                  focus:border-orange-600
                  focus:ring-2 sm:focus:ring-4
                  focus:ring-orange-100
                  focus:outline-none
                  transition-all
                  duration-200
                  hover:border-gray-400
                "
                placeholder="Enter your age"
                min="0"
                max="120"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
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
                  focus:border-orange-600
                  focus:ring-4
                  focus:ring-orange-100
                  focus:outline-none
                  transition-all
                  duration-200
                  hover:border-gray-400
                "
                min="1"
                max="50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-800 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Group Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { value: 'Individual', label: '👤 Individual', icon: '👤' },
                  { value: 'Couple', label: '💑 Couple', icon: '💑' },
                  { value: 'Family', label: '👨‍👩‍👧‍👦 Family', icon: '👨‍👩‍👧‍👦' },
                  { value: 'Group', label: '👥 Group', icon: '👥' },
                  { value: 'Special Occasion', label: '🎉 Special Occasion', icon: '🎉' },
                  { value: 'Honeymooner', label: '💕 Honeymooner', icon: '💕' },
                  { value: 'Other', label: '📝 Other', icon: '📝' }
                ].map((option) => (
                  <label key={option.value} className="
                    flex-1
                    flex items-center justify-center gap-2
                    px-4 py-3
                    bg-white
                    border-2 border-gray-300
                    rounded-xl
                    cursor-pointer
                    transition-all duration-200
                    hover:border-[#B5541B]
                    hover:bg-orange-50
                    has-[:checked]:border-[#B5541B]
                    has-[:checked]:bg-orange-50
                    has-[:checked]:ring-4
                    has-[:checked]:ring-orange-100
                    text-center
                  ">
                    <input
                      type="radio"
                      name="group_type"
                      value={option.value}
                      checked={formData.group_type === option.value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#B5541B] focus:ring-2 focus:ring-[#B5541B]"
                    />
                    <span className="text-gray-900 font-semibold text-sm sm:text-base">{option.label}</span>
                  </label>
                ))}
              </div>

              {/* Conditional occasion description field */}
              {(formData.group_type === 'Special Occasion' || formData.group_type === 'Honeymooner' || formData.group_type === 'Other') && (
                <div className="mt-4 sm:col-span-2">
                  <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                    Please describe your occasion or requirements
                  </label>
                  <input
                    type="text"
                    name="occasion_description"
                    value={formData.occasion_description}
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
                      focus:border-[#B5541B]
                      focus:ring-4
                      focus:ring-orange-100
                      focus:outline-none
                      transition-all
                      duration-200
                      hover:border-gray-400
                    "
                    placeholder="Tell us more about your special occasion..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Travel Information */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">✈️</span>
              Travel Information
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Tell us about your travel dates</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
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
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
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
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Flight Number
              </label>
              <input
                type="text"
                name="flight_number"
                value={formData.flight_number}
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
                  focus:border-[#B5541B]
                  focus:ring-4
                  focus:ring-orange-100
                  focus:outline-none
                  transition-all
                  duration-200
                  hover:border-gray-400
                "
                placeholder="Enter your flight number (e.g., AT205, RAM123)"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Arrival Time
              </label>
              <input
                type="time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleInputChange}
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
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                City of Arrival
              </label>
              <select
                name="city_of_arrival"
                value={formData.city_of_arrival}
                onChange={handleInputChange}
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

        {/* Dietary Restrictions */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">🥗</span>
              Dietary Restrictions
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Let us know about any dietary requirements for your journey</p>
          </div>

          <MultiSelect
            label=""
            placeholder="Select any dietary requirements..."
            options={[
              { value: 'Vegetarian', label: '🥬 Vegetarian' },
              { value: 'Vegan', label: '🌱 Vegan' },
              { value: 'Gluten-free', label: '🌾 Gluten-free' },
              { value: 'Halal', label: '☪️ Halal' },
              { value: 'Kosher', label: '✡️ Kosher' },
              { value: 'Dairy-free', label: '🥛 Dairy-free' },
              { value: 'Nut-free', label: '🥜 Nut-free' },
              { value: 'Other', label: '📝 Other' }
            ]}
            value={formData.dietary_restrictions}
            onChange={(value) => setFormData(prev => ({ ...prev, dietary_restrictions: value }))}
            otherValue={formData.dietary_restrictions_other}
            onOtherChange={(value) => setFormData(prev => ({ ...prev, dietary_restrictions_other: value }))}
          />
        </div>

        {/* Accessibility Needs */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">♿</span>
              Accessibility Needs
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Help us ensure your journey is comfortable and accessible</p>
          </div>

          <MultiSelect
            label=""
            placeholder="Select any accessibility requirements..."
            options={[
              { value: 'Wheelchair access', label: '♿ Wheelchair access' },
              { value: 'Hearing assistance', label: '🔊 Hearing assistance' },
              { value: 'Visual assistance', label: '👁️ Visual assistance' },
              { value: 'Mobility assistance', label: '🦽 Mobility assistance' },
              { value: 'None', label: '✅ None' },
              { value: 'Other', label: '📝 Other' }
            ]}
            value={formData.accessibility_needs}
            onChange={(value) => setFormData(prev => ({ ...prev, accessibility_needs: value }))}
            otherValue={formData.accessibility_needs_other}
            onOtherChange={(value) => setFormData(prev => ({ ...prev, accessibility_needs_other: value }))}
          />
        </div>

        {/* Additional Information */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">💬</span>
              Additional Information
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Share any additional preferences or special requests</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
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
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Arabic">Arabic</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
                Activities of Interest
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
                  focus:border-orange-600
                  focus:ring-4
                  focus:ring-orange-100
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

            <div className="sm:col-span-2">
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
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
                  focus:border-orange-600
                  focus:ring-4
                  focus:ring-orange-100
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

            <div className="sm:col-span-2">
              <label className="block text-gray-800 font-semibold mb-2 text-sm sm:text-base">
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
                  focus:border-orange-600
                  focus:ring-4
                  focus:ring-orange-100
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
        <div className="bg-orange-50 p-5 sm:p-6 rounded-xl border-2 border-orange-100">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="gdpr_consent"
              checked={formData.gdpr_consent}
              onChange={handleInputChange}
              className="mt-1 w-5 h-5 text-[#B5541B] rounded focus:ring-2 focus:ring-[#B5541B] flex-shrink-0"
              required
            />
            <div className="text-sm sm:text-base">
              <span className="font-semibold text-[#B5541B] block mb-1">GDPR Consent Required *</span>
              <p className="text-gray-700 leading-relaxed">
                I consent to Experience Morocco collecting and processing my personal data for the purpose of providing luxury travel services in Morocco. I understand my data will be stored securely and used only for this purpose.
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-8 sm:mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              group
              w-full
              sm:w-auto
              sm:min-w-[280px]
              px-8 py-4 sm:py-5
              bg-gradient-to-r from-[#B5541B] to-[#9B4722]
              text-white
              text-base sm:text-lg font-bold
              rounded-xl
              shadow-lg
              hover:shadow-2xl
              hover:from-[#9B4722]
              hover:to-[#7a3819]
              focus:outline-none
              focus:ring-4
              focus:ring-orange-300
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