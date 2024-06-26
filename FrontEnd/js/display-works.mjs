// Fonction pour récupérer et afficher les travaux en fonction de la catégorie
export function fetchAndDisplayWorks(category) {
    const url = 'http://localhost:5678/api/works';

    // Récupération des données via l'API
    fetch(url)
        .then(response => {
            // Vérification de la réponse de l'API
            if (!response.ok) {
                throw new Error('Échec de la récupération des travaux : ' + response.statusText);
            }

            // Conversion de la réponse en format JSON
            return response.json();
        })
        .then(works => {
            // Filtrage des travaux en fonction de la catégorie demandée
            const filteredWorks = category !== "Tous" ? works.filter(work => work.category.name === category) : works;

            // Appel de la fonction pour afficher les travaux filtrés
            displayWorks(filteredWorks);
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux :', error)); // Gestion des erreurs
}

// Fonction pour afficher les travaux dans la galerie
export function displayWorks(works) {
    const imagesContainer = document.querySelector('.gallery');
    imagesContainer.innerHTML = ''; // Nettoyage de la galerie

    // Boucle à travers les travaux pour les afficher un par un
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title; 

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title; 

        figure.appendChild(img);
        figure.appendChild(figcaption);
        imagesContainer.appendChild(figure); // Ajout du figure au container de la galerie
    });
}
