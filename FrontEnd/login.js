document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#email').value = 'sophiebluel@gmail.com';
    document.querySelector('#password').value = 'admin';

    const loginLink = document.querySelector('.login__link');
    const token = localStorage.getItem('token');

    // Vérification si l'utilisateur est déjà connecté
    if (token) {
        loginLink.textContent = 'Logout';
    } else {
        loginLink.textContent = 'Login';
    }

    loginLink.addEventListener('click', (e) => {
        if (loginLink.textContent === 'Logout') {
            e.preventDefault();
            localStorage.removeItem('token');
            loginLink.textContent = 'Login';
            window.location.href = 'index.html';
        }
    });

    const formulaire = document.getElementById('login__form');

    formulaire.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const messageError = document.querySelector('#error');

        const user = { email, password };
        const url = 'http://localhost:5678/api/users/login';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                /*if (!response.ok) {
                    throw new Error('Erreur d’identification. Veuillez vérifier votre email ou mot de passe.');
                }*/
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                // Mettre à jour le texte du lien 
                loginLink.textContent = 'Logout';
                // Redirection vers la page d'accueil après connexion réussie
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error("Echec de l'authentification :", error);
                messageError.textContent = error.message;
                messageError.style.display = 'block';
                setTimeout(() => {
                    messageError.style.display = 'none';
                }, 5000);
            });
    });
});
