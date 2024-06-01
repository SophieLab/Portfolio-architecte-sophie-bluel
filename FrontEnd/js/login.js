document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login__form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('error');

    // Événement de soumission du formulaire
    loginForm.addEventListener('submit', function(event) {
        // Prévention de l'action par défaut
        event.preventDefault();
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        // Requête API de connexion
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
            // Vérification de la réponse de l'API
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            // Gestion des données de la réponse
            if (data.error) {
                throw new Error(data.error); 
            }
            // Stockage du token
            sessionStorage.setItem("Token", data.token);
            // Redirection de l'utilisateur
            window.location.href = "index.html"; 
        })
        .catch(error => {
            // Affichage du message d'erreur
            errorDiv.textContent = "Identifiants incorrects";
            errorDiv.style.display = "block";
        });
    });
});
