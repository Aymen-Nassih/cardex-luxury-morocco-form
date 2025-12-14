// CARDEX Form Integration JavaScript
// Auto-attaches to form on page load and handles submission to API

const API_URL = 'http://localhost:5000/api';

class CardexFormHandler {
    constructor() {
        this.form = null;
        this.submitButton = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachToForm();
                this.initTravelerForms();
            });
        } else {
            this.attachToForm();
            this.initTravelerForms();
        }
    }

    attachToForm() {
        // Find the form
        this.form = document.querySelector('form');
        console.log('CARDEX Form Handler: Looking for form...', this.form);
        if (!this.form) {
            console.error('CARDEX Form Handler: No form found on page');
            return;
        }

        // Find submit button (now using ID since it's type="button")
        this.submitButton = this.form.querySelector('#final-submit-btn');
        console.log('CARDEX Form Handler: Looking for submit button...', this.submitButton);
        if (!this.submitButton) {
            console.error('CARDEX Form Handler: No submit button found');
            return;
        }

        // Attach click handler to submit button
        this.submitButton.addEventListener('click', (e) => {
            console.log('CARDEX Form Handler: Submit button clicked directly');
            e.preventDefault();
            this.handleSubmit(e);
        });

        // Attach event listeners to navigation buttons
        this.attachNavigationListeners();

        console.log('CARDEX Form Handler: Attached to form successfully');
    }

    initTravelerForms() {
        // Listen for changes on the number of travelers input
        const numberOfTravelersInput = document.querySelector('input[name="number_of_travelers"], input[name="numTravelers"]');

        if (numberOfTravelersInput) {
            numberOfTravelersInput.addEventListener('input', (e) => this.handleTravelersChange(e));
            numberOfTravelersInput.addEventListener('change', (e) => this.handleTravelersChange(e));
        }
    }

    /**
     * Handle changes to number of travelers
     */
    handleTravelersChange(event) {
        const numberOfTravelers = parseInt(event.target.value) || 1;
        const section = document.getElementById('additionalTravelersSection');
        const container = document.getElementById('additionalTravelersContainer');

        if (!section || !container) {
            console.warn('Additional travelers section not found in DOM');
            return;
        }

        if (numberOfTravelers > 1) {
            // Show the section
            section.style.display = 'block';

            // Generate forms for additional travelers (traveler 2, 3, 4, etc.)
            this.generateAdditionalTravelerForms(numberOfTravelers - 1, container);
        } else {
            // Hide the section
            section.style.display = 'none';
            container.innerHTML = '';
        }
    }

    /**
     * Generate forms for additional travelers
     */
    generateAdditionalTravelerForms(count, container) {
        container.innerHTML = ''; // Clear existing forms

        for (let i = 1; i <= count; i++) {
            const travelerForm = this.createTravelerForm(i + 1); // i+1 because main form is traveler 1
            container.appendChild(travelerForm);
        }
    }

    /**
     * Create a single traveler form
     */
    createTravelerForm(travelerNumber) {
        const wrapper = document.createElement('div');
        wrapper.className = 'additional-traveler-form';
        wrapper.style.cssText = `
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 20px;
            animation: slideIn 0.3s ease-out;
        `;

        wrapper.innerHTML = `
            <h3 style="color: #2c5f8d; margin-bottom: 20px; font-size: 20px;">
                Traveler ${travelerNumber}
            </h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Full Name -->
                <div>
                    <label style="display: block; color: #1a5f7a; font-weight: 600; margin-bottom: 8px;">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="traveler_${travelerNumber}_name"
                        required
                        placeholder="Enter full name"
                        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;"
                    />
                </div>

                <!-- Email -->
                <div>
                    <label style="display: block; color: #1a5f7a; font-weight: 600; margin-bottom: 8px;">
                        Email
                    </label>
                    <input
                        type="email"
                        name="traveler_${travelerNumber}_email"
                        placeholder="email@example.com"
                        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;"
                    />
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Phone -->
                <div>
                    <label style="display: block; color: #1a5f7a; font-weight: 600; margin-bottom: 8px;">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="traveler_${travelerNumber}_phone"
                        placeholder="+1234567890"
                        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;"
                    />
                </div>

                <!-- Age Group -->
                <div>
                    <label style="display: block; color: #1a5f7a; font-weight: 600; margin-bottom: 8px;">
                        Age Group
                    </label>
                    <select
                        name="traveler_${travelerNumber}_age_group"
                        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;"
                    >
                        <option value="">Select age group</option>
                        <option value="child">Child (0-12)</option>
                        <option value="teen">Teen (13-17)</option>
                        <option value="adult">Adult (18-64)</option>
                        <option value="senior">Senior (65+)</option>
                    </select>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <!-- Relationship to Main Traveler -->
                <label style="display: block; color: #1a5f7a; font-weight: 600; margin-bottom: 8px;">
                    Relationship to Main Traveler
                </label>
                <select
                    name="traveler_${travelerNumber}_relationship"
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;"
                >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse/Partner</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <!-- Dietary Restrictions for this traveler -->
                <label style="display: block; color: #1a5f7a; font-weight: 600; margin-bottom: 12px;">
                    Dietary Restrictions
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="traveler_${travelerNumber}_dietary" value="vegetarian" />
                        <span>Vegetarian</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="traveler_${travelerNumber}_dietary" value="vegan" />
                        <span>Vegan</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="traveler_${travelerNumber}_dietary" value="halal" />
                        <span>Halal</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="traveler_${travelerNumber}_dietary" value="gluten_free" />
                        <span>Gluten-Free</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="traveler_${travelerNumber}_dietary" value="allergies" />
                        <span>Allergies</span>
                    </label>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <!-- Special Notes for this traveler -->
                <label style="display: block; color: #1a5f7a; font-weight: 600; margin-bottom: 8px;">
                    Special Notes (Optional)
                </label>
                <textarea
                    name="traveler_${travelerNumber}_notes"
                    placeholder="Any special requirements or notes for this traveler..."
                    rows="3"
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px; resize: vertical;"
                ></textarea>
            </div>
        `;

        return wrapper;
    }

    attachNavigationListeners() {
        console.log('CARDEX Form Handler: Attaching navigation listeners');
        // Next buttons
        const nextButtons = this.form.querySelectorAll('.btn-next');
        console.log('CARDEX Form Handler: Found next buttons:', nextButtons.length);
        nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('CARDEX Form Handler: Next button clicked');
                e.preventDefault();
                this.handleNext(e);
            });
        });

        // Previous buttons
        const prevButtons = this.form.querySelectorAll('.btn-prev');
        console.log('CARDEX Form Handler: Found prev buttons:', prevButtons.length);
        prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('CARDEX Form Handler: Previous button clicked');
                e.preventDefault();
                this.handlePrev(e);
            });
        });
    }

    handleNext(e) {
        console.log('CARDEX Form Handler: Handling next step');
        alert('Moving to next step!');
        // Simple step navigation - show next step
        const currentStep = this.getCurrentStep();
        if (currentStep < 4) {
            this.showStep(currentStep + 1);
        }
    }

    handlePrev(e) {
        console.log('CARDEX Form Handler: Handling previous step');
        alert('Moving to previous step!');
        // Simple step navigation - show previous step
        const currentStep = this.getCurrentStep();
        if (currentStep > 1) {
            this.showStep(currentStep - 1);
        }
    }

    getCurrentStep() {
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById('step' + i);
            if (stepElement && stepElement.classList.contains('active')) {
                return i;
            }
        }
        return 1;
    }

    showStep(stepNumber) {
        console.log('CARDEX Form Handler: Showing step', stepNumber);
        // Hide all steps
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById('step' + i);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        }

        // Show target step
        const targetStep = document.getElementById('step' + stepNumber);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        // Update progress indicators
        const progressSteps = document.querySelectorAll('.step');
        progressSteps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    async handleSubmit(e) {
        console.log('CARDEX Form Handler: handleSubmit called');
        alert('Form submit triggered! Check console for details.');

        // Collect form data
        const formData = this.collectFormData();
        console.log('CARDEX Form Handler: Collected form data:', formData);

        // Validate form
        const validationResult = this.validateForm(formData);
        console.log('CARDEX Form Handler: Validation result:', validationResult);
        if (!validationResult.isValid) {
            this.showErrorModal('Validation Error', validationResult.errors.join('<br>'));
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            console.log('CARDEX Form Handler: Submitting to API...');
            // Submit to API
            const response = await fetch(`${API_URL}/submit-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('CARDEX Form Handler: API response status:', response.status);
            const result = await response.json();
            console.log('CARDEX Form Handler: API response:', result);

            if (result.success) {
                this.showSuccessModal(result.client_id);
                this.resetForm();
            } else {
                this.showErrorModal('Submission Error', result.message);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorModal('Network Error', 'Unable to submit form. Please try again later.');
        } finally {
            this.setLoadingState(false);
        }
    }

    collectFormData() {
        const data = {};

        // Basic information
        data.full_name = this.getValue('full_name') || this.getValue('fullName');
        data.email = this.getValue('email');
        data.phone = this.getValue('phone');
        data.number_of_travelers = parseInt(this.getValue('number_of_travelers') || this.getValue('numTravelers')) || 1;

        // Group type (radio buttons)
        data.group_type = this.getRadioValue('group_type') || this.getRadioValue('groupType');

        // Dates
        data.arrival_date = this.getValue('arrival_date') || this.getValue('arrivalDate');
        data.departure_date = this.getValue('departure_date') || this.getValue('departureDate');

        // Accommodation & Budget
        data.accommodation_type = this.getValue('accommodation_type') || this.getValue('accommodation');
        data.budget_range = this.getValue('budget_range') || this.getValue('budget');

        // Dietary restrictions (checkboxes)
        data.dietary_restrictions = this.getCheckboxValues([
            'dietary_vegetarian', 'dietary_vegan', 'dietary_halal',
            'dietary_gluten_free', 'dietary_allergies'
        ]);

        // Accessibility needs (checkboxes)
        data.accessibility_needs = this.getCheckboxValues([
            'accessibility_wheelchair_access', 'accessibility_mobility_assistance'
        ]);

        // Language
        data.preferred_language = this.getValue('preferred_language') || this.getValue('language');

        // Special requests
        data.custom_activities = this.getValue('custom_activities') || this.getValue('activities');
        data.food_preferences = this.getValue('food_preferences') || this.getValue('foodPrefs');
        data.additional_inquiries = this.getValue('additional_inquiries') || this.getValue('inquiries');

        // GDPR consent
        data.gdpr_consent = this.getCheckboxValue('gdpr_consent') || this.getCheckboxValue('consent');

        // Handle file upload
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (file.size <= 5 * 1024 * 1024) { // 5MB limit
                data.attached_document = {
                    name: file.name,
                    data: this.fileToBase64(file)
                };
            }
        }

        // Collect additional travelers data
        data.additional_travelers = this.collectAdditionalTravelersData();

        return data;
    }

    /**
     * Collect additional travelers data when form is submitted
     */
    collectAdditionalTravelersData() {
        const numberOfTravelers = parseInt(this.getValue('number_of_travelers') || this.getValue('numTravelers')) || 1;
        const additionalTravelers = [];

        // Loop through each additional traveler (starting from traveler 2)
        for (let i = 2; i <= numberOfTravelers; i++) {
            const traveler = {
                traveler_number: i,
                name: this.getValue(`traveler_${i}_name`),
                email: this.getValue(`traveler_${i}_email`),
                phone: this.getValue(`traveler_${i}_phone`),
                age_group: this.getValue(`traveler_${i}_age_group`),
                relationship: this.getValue(`traveler_${i}_relationship`),
                notes: this.getValue(`traveler_${i}_notes`),
                dietary_restrictions: this.getCheckboxValues([
                    `traveler_${i}_dietary`
                ])
            };

            additionalTravelers.push(traveler);
        }

        return additionalTravelers;
    }

    getValue(name) {
        const element = document.querySelector(`[name="${name}"]`);
        return element ? element.value.trim() : '';
    }

    getRadioValue(name) {
        const radio = document.querySelector(`input[name="${name}"]:checked`);
        return radio ? radio.value : '';
    }

    getCheckboxValue(name) {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        return checkbox ? (checkbox.checked ? 1 : 0) : 0;
    }

    getCheckboxValues(names) {
        const values = [];
        names.forEach(name => {
            const checkbox = document.querySelector(`input[name="${name}"]`);
            if (checkbox && checkbox.checked) {
                // Extract the value part after the underscore
                const value = name.split('_').slice(1).join('_');
                values.push(value);
            }
        });
        return values;
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data URL prefix (e.g., "data:image/png;base64,")
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    validateForm(data) {
        const errors = [];

        // Required fields
        if (!data.full_name) errors.push('Full name is required');
        if (!data.email) errors.push('Email is required');
        if (!data.phone) errors.push('Phone number is required');
        if (!data.gdpr_consent) errors.push('GDPR consent is required');

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }

        // Date validation
        if (data.arrival_date && data.departure_date) {
            const arrival = new Date(data.arrival_date);
            const departure = new Date(data.departure_date);
            if (arrival >= departure) {
                errors.push('Departure date must be after arrival date');
            }
        }

        // Validate additional travelers
        const travelerErrors = this.validateAdditionalTravelers(data.number_of_travelers);
        errors.push(...travelerErrors);

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Validate additional travelers data
     */
    validateAdditionalTravelers(numberOfTravelers) {
        const errors = [];
        const numTravelers = parseInt(numberOfTravelers) || 1;

        for (let i = 2; i <= numTravelers; i++) {
            const name = this.getValue(`traveler_${i}_name`);
            if (!name.trim()) {
                errors.push(`Please enter name for Traveler ${i}`);
            }
        }

        return errors;
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<span class="spinner"></span> Submitting...';
            this.submitButton.style.opacity = '0.7';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Submit My Preferences';
            this.submitButton.style.opacity = '1';
        }
    }

    showSuccessModal(clientId) {
        const modal = this.createModal(`
            <h3 style="color: #27ae60; margin-bottom: 15px;">✓ Form Submitted Successfully!</h3>
            <p style="margin-bottom: 15px;">Thank you for your submission. Your reference ID is: <strong>${clientId}</strong></p>
            <p style="color: #666; font-size: 14px;">We will contact you shortly to confirm your arrangements.</p>
        `, 'success');
        document.body.appendChild(modal);
    }

    showErrorModal(title, message) {
        const modal = this.createModal(`
            <h3 style="color: #e74c3c; margin-bottom: 15px;">✗ ${title}</h3>
            <p style="color: #666;">${message}</p>
        `, 'error');
        document.body.appendChild(modal);
    }

    createModal(content, type) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            position: relative;
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        `;
        closeButton.onclick = () => modal.remove();

        modalContent.innerHTML = content;
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);

        // Auto-remove after 5 seconds for success, keep for errors
        if (type === 'success') {
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 5000);
        }

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };

        return modal;
    }

    resetForm() {
        this.form.reset();
        // Reset any custom states
        const hiddenFields = document.querySelectorAll('.hidden-field');
        hiddenFields.forEach(field => field.classList.add('hidden-field'));

        // Hide additional travelers section
        const section = document.getElementById('additionalTravelersSection');
        if (section) {
            section.style.display = 'none';
        }
    }
}

// Add CSS for spinner and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .additional-traveler-form {
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize the form handler
const cardexFormHandler = new CardexFormHandler();

// Export for potential external use
window.CardexFormHandler = CardexFormHandler;