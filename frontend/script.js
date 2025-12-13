document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    const totalSteps = 4;
    const form = document.getElementById('travelForm');
    const thankYou = document.getElementById('thankYou');

    // Simulate Salesforce auto-fill
    autoFillFromSalesforce();

    // Event listeners for buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', nextStep);
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', prevStep);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            form.style.display = 'none';
            thankYou.classList.remove('hidden');
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Allergies checkbox toggle
    const allergiesCheckbox = document.getElementById('allergies');
    const allergiesSpec = document.getElementById('allergiesSpec');
    
    if (allergiesCheckbox && allergiesSpec) {
        allergiesCheckbox.addEventListener('change', function() {
            if (this.checked) {
                allergiesSpec.classList.add('show');
                allergiesSpec.classList.remove('hidden-field');
            } else {
                allergiesSpec.classList.remove('show');
                allergiesSpec.classList.add('hidden-field');
            }
        });
    }

    function showStep(step) {
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('step' + step).classList.add('active');

        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('active');
        });
        document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
        
        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function validateStep(step) {
        const stepElement = document.getElementById('step' + step);
        const requiredFields = stepElement.querySelectorAll('[required]');
        let valid = true;

        requiredFields.forEach(field => {
            // Reset border
            field.style.borderColor = '#FFE4B5';
            
            if (field.type === 'radio') {
                const radioGroup = stepElement.querySelectorAll(`input[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    radioGroup.forEach(radio => {
                        radio.closest('.radio-label').style.borderColor = '#ff6b6b';
                    });
                    valid = false;
                }
            } else if (field.type === 'checkbox') {
                if (!field.checked) {
                    field.closest('.checkbox-label').style.borderColor = '#ff6b6b';
                    valid = false;
                }
            } else if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                valid = false;
            }
        });

        // Special validation for dates
        if (step === 2) {
            const arrival = document.getElementById('arrivalDate').value;
            const departure = document.getElementById('departureDate').value;
            if (arrival && departure && new Date(arrival) >= new Date(departure)) {
                alert('Departure date must be after arrival date.');
                document.getElementById('departureDate').style.borderColor = '#ff6b6b';
                valid = false;
            }
        }

        if (!valid) {
            // Show error message
            const existingError = stepElement.querySelector('.error-message');
            if (!existingError) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.cssText = 'color: #ff6b6b; text-align: center; margin-top: 10px; font-size: 14px;';
                errorDiv.textContent = 'Please fill in all required fields.';
                stepElement.querySelector('.btn-container').before(errorDiv);
                
                setTimeout(() => {
                    errorDiv.remove();
                }, 3000);
            }
        }

        return valid;
    }

    function autoFillFromSalesforce() {
        // Placeholder: Simulate auto-fill from Salesforce
        // In production, this would make an API call to Salesforce
        // document.getElementById('fullName').value = 'John Doe';
        // document.getElementById('email').value = 'john@example.com';
        // document.getElementById('phone').value = '+1234567890';
        
        console.log('Salesforce integration placeholder - ready for API connection');
    }
});