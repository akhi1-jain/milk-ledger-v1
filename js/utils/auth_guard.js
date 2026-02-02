// js/utils/authGuard.js

// Determine API path based on where this file is loaded
// (Assumes this runs inside pages located in /admin/ or /user/)
const apiPath = '../api/auth/validate_session.php'; 

fetch(apiPath)
.then(response => response.json())
.then(data => {
    
    // CASE 1: Session is dead
    if (data.status === 'expired') {
        // Clear old stale data
        localStorage.clear();
        alert("Session expired. Please login again.");
        window.location.href = '../login.html';
        return;
    }

    // CASE 2: Wrong Role (Security)
    const currentPath = window.location.pathname;
    
    // If I am on an admin page, but my role is 'user' -> Kick me out
    if (currentPath.includes('/admin/') && data.role !== 'admin') {
        alert("Unauthorized Access! Redirecting to Member Dashboard.");
        window.location.href = '../user/dashboard.html';
        return;
    }
    
    // CASE 3: Success - Update the UI
    // Look for an element like <span id="display_name"></span> in your HTML
    const nameDisplay = document.getElementById('display_name');
    if (nameDisplay && data.name) {
        nameDisplay.innerText = data.name; 
    }

    // Sync LocalStorage (Just in case it got out of sync)
    localStorage.setItem('user_reg_no', data.reg_no);
    localStorage.setItem('user_role', data.role);
    localStorage.setItem('user_name', data.name);
})
.catch(error => {
    console.error("Session Check Failed:", error);
    // Optional: window.location.href = '../login.html'; 
});