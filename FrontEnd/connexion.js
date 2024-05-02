document.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.querySelector(".login-link");
    const logoutLink = document.querySelector(".logout-link");
    const category = document.querySelector(".category");
    const buttonModifier = document.querySelector(".button-modification");
    const barEdition = document.querySelector("#logged");

    const isConnected = sessionStorage.getItem("isConnected");

    if (isConnected === "true") {
        loginLink.style.display = "none";
        logoutLink.style.display = "block";
        if (category) category.style.display = "none";
        if (buttonModifier) buttonModifier.style.display = "block";
        if (barEdition) barEdition.style.display = "flex";
    } else {
        loginLink.style.display = "block";
        logoutLink.style.display = "none";
        if (category) category.style.display = "block"; // Assurez-vous que c'est la logique désirée pour 'category'.
        if (buttonModifier) buttonModifier.style.display = "none";
        if (barEdition) barEdition.style.display = "none";
    }

    // Assurez-vous que logoutLink existe avant d'ajouter un écouteur d'événement
    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            sessionStorage.removeItem("isConnected");
            sessionStorage.removeItem("Token"); 
            window.location.replace("index.html");
        });
    } else {
        console.error("L'élément .logout-link n'est pas trouvé dans le DOM.");
    }
});
