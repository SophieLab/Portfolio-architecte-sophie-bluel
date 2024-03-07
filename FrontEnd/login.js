// Sélection du formulaire de connexion par son identifiant
const formulaire = document.getElementById('login__form');

// Ajout d'un gestionnaire d'événements pour intercepter la soumission du formulaire
formulaire.addEventListener("submit", (event) => {
    // Prévention du rechargement de la page lors de la soumission du formulaire
    event.preventDefault();

    // Récupération des éléments du formulaire et de la zone d'affichage des messages d'erreur
    const email = document.querySelector('#email').value; // Récupère directement la valeur
    const password = document.querySelector('#password').value; // Récupère directement la valeur
    const messageError = document.querySelector('#error');

    // Préparation des données utilisateur à envoyer à l'API
    const user = { email, password };

    // Définition de l'URL de l'API pour la connexion
    const url = 'http://localhost:5678/api/users/login';

    // Envoi des données utilisateur à l'API via une requête POST
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(user) // Conversion des données utilisateur en chaîne JSON
    })
    .then(response => {
        if (response.ok) {
            // Si la requête a réussi, traitement de la réponse JSON
            return response.json();
        } else {
            // En cas d'erreur (ex. utilisateur/mot de passe incorrect), lancement d'une exception
            throw new Error('Erreur d’identification. Veuillez vérifier votre email ou mot de passe.');
        }
    })
    .then(data => {
        // Stockage du token d'authentification dans le localStorage
        localStorage.setItem('token', data.token);
        // Redirection de l'utilisateur vers la page d'accueil
        window.location.href = 'index.html';
    })
    .catch(error => {
        // Affichage du message d'erreur en cas d'échec de l'authentification
        console.error("Echec de l'authentification :", error);
        messageError.textContent = error.message;
        messageError.style.display = 'block';
        // Disparition du message d'erreur après 5 secondes
        setTimeout(() => {
            messageError.style.display = 'none';
        }, 5000);
    });
});
