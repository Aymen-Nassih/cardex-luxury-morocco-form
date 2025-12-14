# Contributing to CARDEX Luxury Morocco Travel Form

Thank you for your interest in contributing to the CARDEX Luxury Morocco Travel Form project! This document provides guidelines for contributing to this proprietary software.

## 🚫 Important Notice

This is **proprietary software** owned by CARDEX Travel & Tourism. All contributions are subject to the terms of the CARDEX Proprietary License. By contributing, you agree to:

- Transfer copyright of your contributions to CARDEX Travel & Tourism
- Allow CARDEX to use, modify, and distribute your contributions
- Maintain confidentiality of proprietary information

## 📋 Contribution Process

### 1. Development Environment Setup

```bash
# Clone the repository
git clone https://github.com/cardex/cardex-luxury-morocco-form.git
cd cardex-luxury-morocco-form

# Set up backend
cd backend
pip install -r requirements.txt

# Start development server
python run_system.py
```

### 2. Code Standards

#### Frontend (HTML/CSS/JavaScript)
- Use semantic HTML5
- Follow BEM CSS methodology
- Maintain CARDEX brand colors and typography
- Ensure WCAG 2.1 AA accessibility compliance
- Test on Chrome, Firefox, Safari, and Edge

#### Backend (Python/Flask)
- Follow PEP 8 style guidelines
- Use type hints for function parameters
- Write comprehensive docstrings
- Implement proper error handling
- Maintain GDPR compliance

### 3. Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Write tests if applicable
# Update documentation

# Commit with descriptive message
git commit -m "Add: Brief description of changes

- Detailed explanation of what was changed
- Why the change was necessary
- Any breaking changes"

# Push to your branch
git push origin feature/your-feature-name
```

### 4. Pull Request Process

1. **Create PR**: Open a pull request against the `main` branch
2. **Description**: Provide detailed description of changes
3. **Testing**: Ensure all existing functionality works
4. **Review**: Wait for code review from maintainers
5. **Merge**: Maintainers will merge approved changes

## 🎨 Design Guidelines

### CARDEX Brand Colors
- Primary: Burgundy (#800020)
- Secondary: Gold (#FFD700)
- Neutral: Cream (#FFFDD0)

### Typography
- Headings: Amiri font family
- Body: Noto Sans Arabic font family
- Maintain 16px base font size for accessibility

### UI Components
- Use rounded corners (8px radius)
- Maintain consistent spacing (8px grid)
- Ensure 44px minimum touch targets for mobile

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form validation works correctly
- [ ] Mobile responsiveness on various screen sizes
- [ ] Cross-browser compatibility
- [ ] Accessibility with screen readers
- [ ] File upload functionality
- [ ] Admin dashboard features

### Automated Testing
```bash
# Run backend tests (when implemented)
cd backend
python -m pytest

# Frontend testing with browser dev tools
# Check console for JavaScript errors
# Test form submission flow
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for JavaScript functions
- Use Google-style docstrings for Python functions
- Update README.md for any new features

### User Documentation
- Update setup instructions if dependencies change
- Document new configuration options
- Maintain API documentation

## 🔒 Security Considerations

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Implement proper input validation
- Follow OWASP security guidelines
- Maintain GDPR compliance

## 🚨 Issue Reporting

When reporting issues:
1. Use the issue template
2. Provide detailed steps to reproduce
3. Include browser/OS information
4. Attach screenshots if applicable
5. Specify expected vs. actual behavior

## 📞 Contact

For contribution questions:
- Email: dev@cardex.ma
- Project Lead: Development Team

---

**Remember**: All contributions are made under the CARDEX Proprietary License and become the property of CARDEX Travel & Tourism.