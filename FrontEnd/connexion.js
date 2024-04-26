document.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.querySelector(".login-link");
    const logoutLink = document.querySelector(".logout-link");
    const category = document.querySelector(".category");
    const buttonModifier = document.querySelector(".button-modification");
    const baredition = document.querySelector("#logged");

    const isConnected = sessionStorage.getItem("isConnected");

    if (isConnected === "true") {
        loginLink.style.display = "none";
        logoutLink.style.display = "block";
        if (category) category.style.display = "none";
        if (buttonModifier) buttonModifier.style.display = "block";
        if (baredition) baredition.style.display = "flex";
    } else {
        loginLink.style.display = "block";
        logoutLink.style.display = "none";
        if (buttonModifier) buttonModifier.style.display = "none";
        if (baredition) baredition.style.display = "none";
    }

    logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        sessionStorage.removeItem("isConnected");
        sessionStorage.removeItem("Token"); 
        window.location.replace("index.html");
    });
});
