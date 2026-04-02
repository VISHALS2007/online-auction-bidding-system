// Dashboard JavaScript functionality

// DOM Elements
let currentUser = null;
let allUsers = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadUserData();
    loadAllUsers();
});

// Check if user is logged in
function checkLoginStatus() {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (!session || !session.isLoggedIn) {
        // User is not logged in, redirect to sign-in
        window.location.href = 'index.html';
        return;
    }
    
    // Load current user data
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        // No user data found, redirect to sign-in
        window.location.href = 'index.html';
        return;
    }
}

// Load and display user data
function loadUserData() {
    if (!currentUser) return;
    
    // Update header user info
    const userInitial = document.getElementById('userInitial');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const welcomeName = document.getElementById('welcomeName');
    
    if (userInitial) userInitial.textContent = currentUser.name.charAt(0).toUpperCase();
    if (userName) userName.textContent = currentUser.name;
    if (userEmail) userEmail.textContent = currentUser.email;
    if (welcomeName) welcomeName.textContent = currentUser.name;
    
    // Update stats cards
    const lastLoginTime = document.getElementById('lastLoginTime');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const userId = document.getElementById('userId');
    
    if (lastLoginTime) {
        const loginDate = new Date(currentUser.loginTime);
        lastLoginTime.textContent = formatDate(loginDate);
    }
    if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;
    if (userId) userId.textContent = currentUser.id;
    
    // Update account information
    const fullName = document.getElementById('fullName');
    const emailAddress = document.getElementById('emailAddress');
    const userIdDisplay = document.getElementById('userIdDisplay');
    const accountCreated = document.getElementById('accountCreated');
    const lastLoginDisplay = document.getElementById('lastLoginDisplay');
    const rememberMeStatus = document.getElementById('rememberMeStatus');
    
    if (fullName) fullName.textContent = currentUser.name;
    if (emailAddress) emailAddress.textContent = currentUser.email;
    if (userIdDisplay) userIdDisplay.textContent = currentUser.id;
    if (accountCreated) {
        const createdDate = new Date(currentUser.loginTime);
        accountCreated.textContent = formatDate(createdDate);
    }
    if (lastLoginDisplay) {
        const loginDate = new Date(currentUser.loginTime);
        lastLoginDisplay.textContent = formatDate(loginDate);
    }
    if (rememberMeStatus) {
        rememberMeStatus.textContent = currentUser.rememberMe ? 'Yes' : 'No';
    }
}

// Load all users data
function loadAllUsers() {
    allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    displayAllUsers();
}

// Display all users in table
function displayAllUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    if (allUsers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666;">No users found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = allUsers.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${formatDate(new Date(user.createdAt || user.loginTime))}</td>
            <td>${formatDate(new Date(user.lastLogin || user.loginTime))}</td>
        </tr>
    `).join('');
}

// Format date for display
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Logout function
function logout() {
    // Clear session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('session');
    
    // Show logout message
    showNotification('Successfully logged out!', 'success');
    
    // Redirect to sign-in page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Refresh data
function refreshData() {
    showNotification('Refreshing data...', 'info');
    
    // Reload user data
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Update displays
    loadUserData();
    displayAllUsers();
    
    setTimeout(() => {
        showNotification('Data refreshed successfully!', 'success');
    }, 500);
}

// Export data
function exportData() {
    const data = {
        currentUser: currentUser,
        allUsers: allUsers,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.clear();
        showNotification('All data cleared!', 'warning');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Show notification
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
    
    // Set background color based on type
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
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Get icon for notification type
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
`;
document.head.appendChild(style);

// Auto-refresh data every 30 seconds
setInterval(() => {
    if (currentUser) {
        loadUserData();
        loadAllUsers();
    }
}, 30000);

// Portal switching functionality
function switchToPortal(portalType) {
    // Remove active class from all portal cards
    document.querySelectorAll('.portal-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected portal
    const selectedPortal = document.querySelector(`.${portalType}-portal`);
    if (selectedPortal) {
        selectedPortal.classList.add('active');
    }
    
    // Update user's portal preference
    if (currentUser) {
        currentUser.preferredPortal = portalType;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Show portal-specific content
    showPortalContent(portalType);
    
    // Show notification
    const portalName = portalType === 'import' ? 'Import the Product' : 'Bidder';
    showNotification(`Switched to ${portalName} portal!`, 'success');
}

function showPortalContent(portalType) {
    // Hide all portal-specific content sections
    const importContent = document.getElementById('importContent');
    const biddingContent = document.getElementById('biddingContent');
    const productContent = document.getElementById('productContent');
    const propertyContent = document.getElementById('propertyContent');
    
    if (importContent) importContent.style.display = 'none';
    if (biddingContent) biddingContent.style.display = 'none';
    if (productContent) productContent.style.display = 'none';
    if (propertyContent) propertyContent.style.display = 'none';
    
    // Show selected portal content
    if (portalType === 'import') {
        if (importContent) {
            importContent.style.display = 'block';
            importContent.style.animation = 'slideUp 0.6s ease-out';
        }
    } else if (portalType === 'bidding') {
        if (biddingContent) {
            biddingContent.style.display = 'block';
            biddingContent.style.animation = 'slideUp 0.6s ease-out';
        }
    }
}

// Import frame switching functionality
function switchToImportFrame(frameType) {
    const importContent = document.getElementById('importContent');
    const productContent = document.getElementById('productContent');
    const propertyContent = document.getElementById('propertyContent');
    
    // Hide all frames
    if (importContent) importContent.style.display = 'none';
    if (productContent) productContent.style.display = 'none';
    if (propertyContent) propertyContent.style.display = 'none';
    
    // Show selected frame
    if (frameType === 'product') {
        if (productContent) {
            productContent.style.display = 'block';
            productContent.style.animation = 'slideUp 0.6s ease-out';
        }
        showNotification('Switched to Product Import!', 'success');
    } else if (frameType === 'property') {
        if (propertyContent) {
            propertyContent.style.display = 'block';
            propertyContent.style.animation = 'slideUp 0.6s ease-out';
        }
        showNotification('Switched to Property Import!', 'success');
    } else if (frameType === 'back') {
        if (importContent) {
            importContent.style.display = 'block';
            importContent.style.animation = 'slideUp 0.6s ease-out';
        }
        showNotification('Back to Import Selection!', 'info');
    }
}

// Initialize portal based on user's last login type
function initializePortal() {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (session && session.loginType) {
        switchToPortal(session.loginType);
    } else if (currentUser && currentUser.preferredPortal) {
        switchToPortal(currentUser.preferredPortal);
    }
}

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && currentUser) {
        // Page became visible, refresh data
        refreshData();
    }
});

// Open product form in new page
function openProductForm() {
    window.open('product-form.html', '_blank');
    showNotification('Opening Product Form in new tab...', 'info');
}

// Initialize portal on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portal after user data is loaded
    setTimeout(() => {
        initializePortal();
    }, 500);
});

