// Sign-up page JavaScript functionality

// DOM Elements
const signupForm = document.getElementById('signupForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const phoneInput = document.getElementById('phone');
const agreeTermsInput = document.getElementById('agreeTerms');

// Error elements
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const phoneError = document.getElementById('phoneError');

const signupBtn = document.querySelector('.signin-btn');

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateFullName(name) {
    return name.trim().length >= 2;
}

function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'fair';
    if (score <= 5) return 'good';
    return 'strong';
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearError(fullNameInput, fullNameError);
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    clearError(confirmPasswordInput, confirmPasswordError);
    clearError(phoneInput, phoneError);
    
    // Validate full name
    if (!fullNameInput.value.trim()) {
        showError(fullNameInput, fullNameError, 'Full name is required');
        isValid = false;
    } else if (!validateFullName(fullNameInput.value)) {
        showError(fullNameInput, fullNameError, 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
    } else if (isEmailAlreadyRegistered(emailInput.value)) {
        showError(emailInput, emailError, 'This email is already registered');
        isValid = false;
    }
    
    // Validate password
    if (!passwordInput.value) {
        showError(passwordInput, passwordError, 'Password is required');
        isValid = false;
    } else if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, passwordError, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPasswordInput.value) {
        showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
        isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
        isValid = false;
    }
    
    // Validate phone (optional)
    if (phoneInput.value && !validatePhone(phoneInput.value)) {
        showError(phoneInput, phoneError, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate terms agreement
    if (!agreeTermsInput.checked) {
        showError(agreeTermsInput, document.createElement('span'), 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Check if email is already registered
function isEmailAlreadyRegistered(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
}

// Real-time validation
fullNameInput.addEventListener('input', function() {
    if (this.value.trim() && !validateFullName(this.value)) {
        showError(this, fullNameError, 'Full name must be at least 2 characters');
    } else {
        clearError(this, fullNameError);
    }
});

emailInput.addEventListener('input', function() {
    if (this.value.trim() && !validateEmail(this.value)) {
        showError(this, emailError, 'Please enter a valid email address');
    } else if (this.value.trim() && isEmailAlreadyRegistered(this.value)) {
        showError(this, emailError, 'This email is already registered');
    } else {
        clearError(this, emailError);
    }
});

passwordInput.addEventListener('input', function() {
    if (this.value && !validatePassword(this.value)) {
        showError(this, passwordError, 'Password must be at least 6 characters');
    } else {
        clearError(this, passwordError);
        updatePasswordStrength(this.value);
    }
});

confirmPasswordInput.addEventListener('input', function() {
    if (this.value && passwordInput.value !== this.value) {
        showError(this, confirmPasswordError, 'Passwords do not match');
    } else {
        clearError(this, confirmPasswordError);
    }
});

phoneInput.addEventListener('input', function() {
    if (this.value && !validatePhone(this.value)) {
        showError(this, phoneError, 'Please enter a valid phone number');
    } else {
        clearError(this, phoneError);
    }
});

// Password strength indicator
function updatePasswordStrength(password) {
    const strength = checkPasswordStrength(password);
    const strengthText = document.getElementById('passwordStrengthText');
    const strengthBar = document.getElementById('passwordStrengthBar');
    
    if (strengthText && strengthBar) {
        const strengthLabels = {
            weak: { text: 'Weak', class: 'strength-weak' },
            fair: { text: 'Fair', class: 'strength-fair' },
            good: { text: 'Good', class: 'strength-good' },
            strong: { text: 'Strong', class: 'strength-strong' }
        };
        
        strengthText.textContent = strengthLabels[strength].text;
        strengthBar.className = `strength-fill ${strengthLabels[strength].class}`;
    }
}

// Add password strength indicator to HTML
function addPasswordStrengthIndicator() {
    const passwordGroup = passwordInput.parentElement;
    const strengthDiv = document.createElement('div');
    strengthDiv.className = 'password-strength';
    strengthDiv.innerHTML = `
        <div id="passwordStrengthText">Password strength</div>
        <div class="strength-bar">
            <div id="passwordStrengthBar" class="strength-fill"></div>
        </div>
    `;
    passwordGroup.appendChild(strengthDiv);
}

// Initialize password strength indicator
addPasswordStrengthIndicator();

// Form submission
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    signupBtn.classList.add('loading');
    signupBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create user account
        const userInfo = {
            id: generateUserId(),
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value, // In real app, this would be hashed
            phone: phoneInput.value.trim() || null,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        // Store user in localStorage
        storeNewUser(userInfo);
        
        // Show success message
        showSuccessMessage();
        
        // Redirect to login selection page after a short delay
        setTimeout(() => {
            window.location.href = 'login-selection.html';
        }, 2000);
        
        // Reset form
        signupForm.reset();
        clearAllErrors();
        
        // Remove loading state
        signupBtn.classList.remove('loading');
        signupBtn.disabled = false;
    }, 2000);
});

// Store new user
function storeNewUser(userInfo) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userInfo);
    localStorage.setItem('users', JSON.stringify(users));
}

// Generate user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Clear all errors
function clearAllErrors() {
    clearError(fullNameInput, fullNameError);
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    clearError(confirmPasswordInput, confirmPasswordError);
    clearError(phoneInput, phoneError);
}

// Success message
function showSuccessMessage() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Account created successfully! Redirecting to sign in...</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Google sign-up simulation
document.querySelector('.google-btn').addEventListener('click', function() {
    this.style.opacity = '0.7';
    this.style.pointerEvents = 'none';
    
    setTimeout(() => {
        showSuccessMessage();
        setTimeout(() => {
            window.location.href = 'login-selection.html';
        }, 2000);
        this.style.opacity = '1';
        this.style.pointerEvents = 'auto';
    }, 1500);
});

// Terms and conditions link
document.querySelector('.terms-link').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Terms and Conditions:\n\n1. You must be at least 13 years old to use this service.\n2. You are responsible for maintaining the security of your account.\n3. We reserve the right to modify these terms at any time.\n4. Your data will be stored securely and used only for service purposes.\n\nThis is a demo - in a real application, you would link to your actual terms page.');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add interactive effects
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const inputs = Array.from(document.querySelectorAll('input'));
        const currentIndex = inputs.indexOf(e.target);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            signupBtn.click();
        }
    }
});

