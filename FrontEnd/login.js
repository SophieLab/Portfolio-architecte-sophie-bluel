document.addEventListener('DOMContentLoaded', function() {
    // Selectors for form elements and error display
    const loginForm = document.getElementById('login__form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('error');

    // Handling the login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        errorDiv.textContent = ''; // Clear any previous errors
        errorDiv.style.display = 'none'; // Hide the error div until needed

        // Constructing the request to the login API
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
            // Check if the response was not OK, indicating a server-side error
            if (!response.ok) {
                // Attempt to parse the error message body
                return response.json().then(errData => {
                    throw new Error(errData.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            // Handle successful login, storing the session data
            if (data.error) {
                throw new Error(data.error); // Throw an error if there is an error message in the data
            }
            sessionStorage.setItem("Token", data.token);
            sessionStorage.setItem("isConnected", JSON.stringify(true));
            window.location.href = "index.html"; // Redirect to the home page
        })
        .catch(error => {
            // Display any caught errors to the user
            errorDiv.textContent = error.message;
            errorDiv.style.display = "block";
        });
    });
});
