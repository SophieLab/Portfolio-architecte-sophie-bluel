document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('.login__link');
    const connectionButton = document.querySelector('#connection');
    const token = localStorage.getItem('token');
    updateLoginState(token);

    loginLink.addEventListener('click', handleLoginLinkClick);
    document.getElementById('login__form').addEventListener('submit', handleLoginFormSubmit);
});

function updateLoginState(token) {
    const loginLink = document.querySelector('.login__link');
    const connectionButton = document.querySelector('#connection');
    if (token) {
        loginLink.textContent = 'Logout';
        connectionButton.value = 'Déconnexion';
    } else {
        loginLink.textContent = 'Login';
        connectionButton.value = 'Se connecter';
    }
}

function handleLoginLinkClick(e) {
    if (e.target.textContent === 'Logout') {
        e.preventDefault();
        performLogout();
    }
}

function handleLoginFormSubmit(event) {
    event.preventDefault();
    const connectionButton = document.querySelector('#connection');
    if (connectionButton.value === 'Déconnexion') {
        performLogout();
    } else {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const messageError = document.querySelector('#error');
        loginUser(email, password, messageError);
    }
}

function performLogout() {
    localStorage.removeItem('token');
    updateLoginState(null);
    window.location.href = 'login.html';
}

function loginUser(email, password, messageError) {
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
        if (!response.ok) {
            throw new Error('Erreur d’identification. Veuillez vérifier votre email ou mot de passe.');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        updateLoginState(data.token);
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
}
