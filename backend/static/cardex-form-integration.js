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
            document.addEventListener('DOMContentLoaded', () => this.attachToForm());
        } else {
            this.attachToForm();
        }
    }

    attachToForm() {
        // Find the form
        this.form = document.querySelector('form');
        if (!this.form) {
            console.warn('CARDEX Form Handler: No form found on page');
            return;
        }

        // Find submit button
        this.submitButton = this.form.querySelector('button[type="submit"], .btn-submit');
        if (!this.submitButton) {
            console.warn('CARDEX Form Handler: No submit button found');
            return;
        }

        // Attach event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        console.log('CARDEX Form Handler: Attached to form successfully');
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Collect form data
        const formData = this.collectFormData();

        // Validate form
        const validationResult = this.validateForm(formData);
        if (!validationResult.isValid) {
            this.showErrorModal('Validation Error', validationResult.errors.join('<br>'));
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Submit to API
            const response = await fetch(`${API_URL}/submit-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

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

        return data;
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

        return {
            isValid: errors.length === 0,
            errors: errors
        };
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
    }
}

// Add CSS for spinner and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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