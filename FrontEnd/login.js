document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login__form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('error');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error); 
            }
            sessionStorage.setItem("Token", data.token);
            sessionStorage.setItem("isConnected", JSON.stringify(true));
            window.location.href = "index.html"; 
        })
        .catch(error => {
            errorDiv.textContent = error.message;
            errorDiv.style.display = "block";
        });
    });
});
