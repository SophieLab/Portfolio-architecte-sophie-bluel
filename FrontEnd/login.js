document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('.login__link');
    const connectionButton = document.querySelector('#connection');
    // Récupère le token de connexion stocké localement
    const token = localStorage.getItem('token');

    updateLoginState(loginLink, connectionButton, token);

    // Ajoute un écouteur d'événements pour gérer le clic sur le lien de déconnexion
    loginLink.addEventListener('click', (e) => {
        if (loginLink.textContent === 'Logout') {
            e.preventDefault();
            performLogout(loginLink, connectionButton);
        }
    });

    // Sélectionne le formulaire de connexion et ajoute un écouteur pour son envoi
    const formulaire = document.getElementById('login__form');
    formulaire.addEventListener("submit", (event) => {
        event.preventDefault();

        if (connectionButton.value === 'Déconnexion') {
            performLogout(loginLink, connectionButton);
        } else {
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            const messageError = document.querySelector('#error');
            loginUser(email, password, loginLink, messageError, connectionButton);
        }
    });
});

// Mettre à jour l'état de la connexion dans l'interface utilisateur
function updateLoginState(loginLink, connectionButton, token) {
    if (token) {
        loginLink.textContent = 'Logout';
        connectionButton.value = 'Déconnexion';
    } else {
        loginLink.textContent = 'Login';
        connectionButton.value = 'Se connecter';
    }
}

// Fonction pour gérer la déconnexion de l'utilisateur
function performLogout(loginLink, connectionButton) {
    // Supprime le token stocké localement
    localStorage.removeItem('token');
    // Met à jour les textes des liens et des boutons
    loginLink.textContent = 'Login';
    connectionButton.value = 'Se connecter';
    // Redirige l'utilisateur vers la page de connexion
    window.location.href = 'login.html';
}

// Gérer la connexion de l'utilisateur
function loginUser(email, password, loginLink, messageError, connectionButton) {
    // Crée un objet utilisateur avec email et mot de passe
    const user = { email, password };
    const url = 'http://localhost:5678/api/users/login';

    // Envoie une requête POST pour la connexion
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur d’identification. Veuillez vérifier votre email ou mot de passe.');
        }
        return response.json();
    })
    .then(data => {
        // Stocke le token dans le stockage local et met à jour l'interface
        localStorage.setItem('token', data.token);
        loginLink.textContent = 'Logout';
        connectionButton.value = 'Déconnexion';
        // Redirige l'utilisateur vers la page d'accueil
        window.location.href = 'index.html';
    })
    .catch(error => {
        // Affiche un message d'erreur si la connexion échoue
        console.error("Echec de l'authentification :", error);
        messageError.textContent = error.message;
        messageError.style.display = 'block';
        setTimeout(() => {
            messageError.style.display = 'none';
        }, 5000);
    });
}
