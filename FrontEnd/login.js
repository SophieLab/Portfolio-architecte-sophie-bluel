const formulaire = document.getElementById('login__form');

// Ajout d'un gestionnaire d'événements
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    // Récupération des éléments du formulaire et de la zone d'affichage des messages d'erreur
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const messageError = document.querySelector('#error');

    // Préparation des données utilisateur à envoyer à l'API
    const user = { email, password };
    const url = 'http://localhost:5678/api/users/login';

    // Envoi des données utilisateur à l'API 
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
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
            setTimeout(() => {
                messageError.style.display = 'none';
            }, 5000);
        });
});
