// Product Form JavaScript functionality

// DOM Elements
const productForm = document.getElementById('productForm');
const imageInput = document.getElementById('productImages');
const imagePreview = document.getElementById('imagePreview');
const submitBtn = document.querySelector('.submit-btn');
const previewBtn = document.querySelector('.preview-btn');

// Form validation
function validateForm() {
    const requiredFields = [
        'productName', 'quantity', 'rate', 'description', 
        'auctionEndTime', 'category', 'sellerName', 'sellerEmail', 'condition'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate email
    const emailField = document.getElementById('sellerEmail');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate auction end time
    const auctionTime = document.getElementById('auctionEndTime');
    if (auctionTime.value) {
        const endTime = new Date(auctionTime.value);
        const now = new Date();
        if (endTime <= now) {
            showFieldError(auctionTime, 'Auction end time must be in the future');
            isValid = false;
        }
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    field.style.backgroundColor = '#fdf2f2';
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.3rem';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e1e5e9';
    field.style.backgroundColor = '#f8f9fa';
    
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Image upload functionality
imageInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    displayImagePreviews(files);
});

function displayImagePreviews(files) {
    imagePreview.innerHTML = '';
    
    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'preview-image';
                previewDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Product image ${index + 1}">
                    <button class="remove-image" onclick="removeImage(${index})">×</button>
                `;
                imagePreview.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        }
    });
}

function removeImage(index) {
    const previewImages = imagePreview.querySelectorAll('.preview-image');
    if (previewImages[index]) {
        previewImages[index].remove();
    }
}

// Form submission
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Product...';
    
    // Simulate API call
    setTimeout(() => {
        const formData = new FormData(productForm);
        const productData = Object.fromEntries(formData.entries());
        
        // Add additional data
        productData.id = generateProductId();
        productData.createdAt = new Date().toISOString();
        productData.status = 'active';
        productData.images = Array.from(imageInput.files).map(file => file.name);
        
        // Store product data
        storeProductData(productData);
        
        // Show success message
        showNotification('Product created successfully!', 'success');
        
        // Reset form
        productForm.reset();
        imagePreview.innerHTML = '';
        
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Product Listing';
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }, 2000);
});

// Store product data
function storeProductData(productData) {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(productData);
    localStorage.setItem('products', JSON.stringify(products));
}

// Generate product ID
function generateProductId() {
    return 'product_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Preview product functionality
function previewProduct() {
    if (!validateForm()) {
        showNotification('Please fill in all required fields to preview', 'error');
        return;
    }
    
    const formData = new FormData(productForm);
    const productData = Object.fromEntries(formData.entries());
    
    // Create preview content
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = createPreviewHTML(productData);
    
    // Show modal
    document.getElementById('productPreviewModal').style.display = 'flex';
}

function createPreviewHTML(productData) {
    const images = Array.from(imageInput.files);
    const imageHTML = images.length > 0 ? 
        images.map((file, index) => {
            const reader = new FileReader();
            return new Promise(resolve => {
                reader.onload = e => resolve(`<img src="${e.target.result}" alt="Product image ${index + 1}">`);
                reader.readAsDataURL(file);
            });
        }).join('') : 
        '<div class="no-image">No images uploaded</div>';
    
    return `
        <div class="preview-product">
            <div class="preview-images">
                ${imageHTML}
            </div>
            <div class="preview-info">
                <h3>${productData.productName}</h3>
                <div class="price">Starting Bid: $${parseFloat(productData.rate).toFixed(2)}</div>
                <div class="description">${productData.description}</div>
            </div>
            <div class="preview-details">
                <div class="preview-detail">
                    <strong>Quantity:</strong>
                    <span>${productData.quantity}</span>
                </div>
                <div class="preview-detail">
                    <strong>Category:</strong>
                    <span>${productData.category}</span>
                </div>
                <div class="preview-detail">
                    <strong>Condition:</strong>
                    <span>${productData.condition}</span>
                </div>
                <div class="preview-detail">
                    <strong>Seller:</strong>
                    <span>${productData.sellerName}</span>
                </div>
                <div class="preview-detail">
                    <strong>Contact:</strong>
                    <span>${productData.sellerEmail}</span>
                </div>
                <div class="preview-detail">
                    <strong>Auction Ends:</strong>
                    <span>${new Date(productData.auctionEndTime).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

// Close preview modal
function closePreview() {
    document.getElementById('productPreviewModal').style.display = 'none';
}

// Go back to dashboard
function goBack() {
    window.location.href = 'dashboard.html';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    const colors = {
        success: '#10b981',
        error: '#e74c3c',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span>${getIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
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
    
    .submit-btn.loading {
        position: relative;
        color: transparent;
    }
    
    .submit-btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Real-time validation
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', function() {
        clearFieldError(this);
    });
    
    field.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            showFieldError(this, 'This field is required');
        }
    });
});

// Set minimum date for auction end time
document.addEventListener('DOMContentLoaded', function() {
    const auctionTimeInput = document.getElementById('auctionEndTime');
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // Minimum 1 minute from now
    auctionTimeInput.min = now.toISOString().slice(0, 16);
    
    // Auto-fill seller information from current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        document.getElementById('sellerName').value = currentUser.fullName || currentUser.name || '';
        document.getElementById('sellerEmail').value = currentUser.email || '';
        document.getElementById('sellerPhone').value = currentUser.phone || '';
    }
});

