// DOM Elements
const signinForm = document.getElementById('signinForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const signinBtn = document.querySelector('.signin-btn');

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 6 characters
    return password.length >= 6;
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
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    
    // Validate email
    if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
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
    
    return isValid;
}

// Real-time validation
emailInput.addEventListener('input', function() {
    if (this.value.trim() && !validateEmail(this.value)) {
        showError(this, emailError, 'Please enter a valid email address');
    } else {
        clearError(this, emailError);
    }
});

passwordInput.addEventListener('input', function() {
    if (this.value && !validatePassword(this.value)) {
        showError(this, passwordError, 'Password must be at least 6 characters');
    } else {
        clearError(this, passwordError);
    }
});

// Form submission
signinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    signinBtn.classList.add('loading');
    signinBtn.disabled = true;
    
    // Check if user exists
    const user = checkUserExists(emailInput.value, passwordInput.value);
    
    if (!user) {
        // User not found, show error
        showError(emailInput, emailError, 'Invalid email or password');
        showError(passwordInput, passwordError, 'Invalid email or password');
        
        // Remove loading state
        signinBtn.classList.remove('loading');
        signinBtn.disabled = false;
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Store user information
        const userInfo = {
            email: user.email,
            fullName: user.fullName,
            loginTime: new Date().toISOString(),
            rememberMe: document.getElementById('rememberMe').checked,
            id: user.id,
            name: user.fullName,
            phone: user.phone
        };
        
        // Store in localStorage
        storeUserInfo(userInfo);
        
        // Simulate successful login
        showSuccessMessage();
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
        // Reset form
        signinForm.reset();
        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);
        
        // Remove loading state
        signinBtn.classList.remove('loading');
        signinBtn.disabled = false;
    }, 2000);
});

// Success message
function showSuccessMessage() {
    // Create success notification
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
            <span>Successfully signed in!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

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

// Google sign-in simulation
document.querySelector('.google-btn').addEventListener('click', function() {
    // Show loading state
    this.style.opacity = '0.7';
    this.style.pointerEvents = 'none';
    
    setTimeout(() => {
        showSuccessMessage();
        this.style.opacity = '1';
        this.style.pointerEvents = 'auto';
    }, 1500);
});

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Password reset functionality would be implemented here. For now, this is just a demo.');
});

// Sign up link - now redirects to signup page
document.querySelector('.signup-link a').addEventListener('click', function(e) {
    // Link will naturally redirect to signup.html
});

// User storage functions
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function extractNameFromEmail(email) {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function storeUserInfo(userInfo) {
    // Store user info in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    
    // Store in users array (simulate database)
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const existingUserIndex = users.findIndex(user => user.email === userInfo.email);
    
    if (existingUserIndex !== -1) {
        // Update existing user
        users[existingUserIndex] = {
            ...users[existingUserIndex],
            ...userInfo,
            lastLogin: userInfo.loginTime
        };
    } else {
        // Add new user
        users.push({
            ...userInfo,
            createdAt: userInfo.loginTime,
            lastLogin: userInfo.loginTime
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store session info
    const sessionInfo = {
        isLoggedIn: true,
        loginTime: userInfo.loginTime,
        userId: userInfo.id
    };
    localStorage.setItem('session', JSON.stringify(sessionInfo));
}

function getUserInfo() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('session');
    window.location.href = 'index.html';
}

// Check if user is already logged in
function checkLoginStatus() {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (session && session.isLoggedIn) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Check if user exists in database
function checkUserExists(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    return user;
}

// Initialize login check
checkLoginStatus();

// Add some interactive effects
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
            signinBtn.click();
        }
    }
});
