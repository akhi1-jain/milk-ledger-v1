// js/auth.js
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        if(errorMsg) errorMsg.style.display = 'none';

        const data = {
            reg_no: document.getElementById('reg_no').value,
            password: document.getElementById('password').value
        };

        fetch('api/auth/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if(result.status === 'success') {
                
                // 1. SAVE DATA: Store the specific details the server sent back
                localStorage.setItem('user_reg_no', result.reg_no);
                localStorage.setItem('user_role', result.role);
                localStorage.setItem('user_name', result.name); // <--- Now we have this!

                // 2. REDIRECT: Send them to the right dashboard
                if (result.role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'user/dashboard.html';
                }

            } else {
                if(errorMsg) {
                    errorMsg.innerText = result.message;
                    errorMsg.style.display = 'block';
                } else {
                    alert(result.message);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Connection error. Check console.");
        });
    });
}