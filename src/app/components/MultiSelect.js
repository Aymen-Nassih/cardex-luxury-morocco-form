'use client';

import { useState, useRef, useEffect } from 'react';

export default function MultiSelect({ options, value, onChange, placeholder, label, otherValue, onOtherChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hasOther = value.includes('Other');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(item => item !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
    
    // Clear other value if "Other" is deselected
    if (optionValue === 'Other' && !newValue.includes('Other') && onOtherChange) {
      onOtherChange('');
    }
  };

  const removeTag = (optionValue) => {
    onChange(value.filter(item => item !== optionValue));
  };

  const getOptionLabel = (optionValue) => {
    const option = options.find(opt => opt.value === optionValue);
    return option ? option.label : optionValue;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-800 font-semibold mb-2 text-base">
        {label}
      </label>

      {/* Selected items display */}
      <div
        className="
          w-full
          min-h-[48px]
          px-4 py-3
          bg-white
          border-2 border-gray-300
          rounded-xl
          cursor-pointer
          focus:border-[#B5541B]
          focus:ring-4
          focus:ring-orange-100
          focus:outline-none
          transition-all
          duration-200
          hover:border-gray-400
        "
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <span
                key={item}
                className="
                  inline-flex items-center gap-1
                  px-2 py-1
                  bg-orange-100
                  text-[#7a3819]
                  text-sm
                  rounded-md
                  font-medium
                "
              >
                {getOptionLabel(item)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(item);
                  }}
                  className="
                    hover:bg-orange-200
                    rounded-full
                    w-4 h-4
                    flex items-center justify-center
                    text-[#9B4722]
                    font-bold
                    text-xs
                  "
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="
          absolute z-50
          w-full
          mt-1
          bg-white
          border-2 border-gray-300
          rounded-xl
          shadow-lg
          max-h-60
          overflow-y-auto
        ">
          {options.map((option) => (
            <label
              key={option.value}
              className="
                flex items-center gap-3
                px-4 py-3
                cursor-pointer
                hover:bg-orange-50
                transition-colors
                duration-150
                border-b border-gray-100
                last:border-b-0
              "
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                className="w-4 h-4 text-[#B5541B] rounded focus:ring-[#B5541B]"
              />
              <span className="text-gray-900 font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Other text input - shown when "Other" is selected */}
      {hasOther && onOtherChange && (
        <div className="mt-4">
          <label className="block text-gray-800 font-semibold mb-2 text-base">
            Please specify your dietary requirement
          </label>
          <input
            type="text"
            value={otherValue || ''}
            onChange={(e) => onOtherChange(e.target.value)}
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
  );
}