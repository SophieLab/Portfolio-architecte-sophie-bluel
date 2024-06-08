document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("mainHeader");
    const loginLink = document.querySelector(".login-link");
    const logoutLink = document.querySelector(".logout-link");
    const barEdition = document.querySelector("#bar");
    const buttonModification = document.getElementById("button-modification"); 

    // Récupération du token depuis sessionStorage
    const token = sessionStorage.getItem("Token");

    // Mise à jour de l'interface en fonction de l'état de connexion
    if (token) {
        loginLink.parentNode.style.display = "none"; 
        logoutLink.style.display = "block"; 
        barEdition.style.display = "block"; 
        buttonModification.style.display = "block"; 
        header.classList.add("header-with-bar"); // Ajoute un padding-top au header
    } else {
        loginLink.style.display = "block"; // Affiche le lien de connexion
        logoutLink.style.display = "none"; 
        barEdition.style.display = "none"; 
        buttonModification.style.display = "none";
        header.classList.remove("header-with-bar"); // Retire le padding-top du header
    }

    // Gestion du clic sur le lien de déconnexion
    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();

            sessionStorage.removeItem("Token");
            window.location.replace("index.html");
        });
    } else {
        console.error("L'élément .logout-link n'est pas trouvé dans le DOM.");
    }
});


