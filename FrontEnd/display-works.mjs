export function fetchAndDisplayWorks(category) {
    const url = 'http://localhost:5678/api/works';
    console.log("Début de la récupération des travaux, catégorie :", category); // Ajout pour suivre la catégorie demandée
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la récupération des travaux : ' + response.statusText);
            }
            console.log("Réponse obtenue de l'API");
            return response.json();
        })
        .then(works => {
            console.log("Travaux récupérés :", works); // Affiche tous les travaux récupérés
            const filteredWorks = category !== "Tous" ? works.filter(work => work.category.name === category) : works;
            console.log("Travaux filtrés selon la catégorie :", filteredWorks); // Affiche les travaux après filtrage
            displayWorks(filteredWorks);
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux :', error));
}

export function displayWorks(works) {
    const imagesContainer = document.querySelector('.gallery');
    console.log("Nettoyage de la galerie existante"); // Confirmer le nettoyage de la galerie
    imagesContainer.innerHTML = '';
    console.log("Affichage des travaux", works); // Log les travaux à afficher
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        imagesContainer.appendChild(figure);
    });
    console.log("Travaux affichés avec succès"); // Confirmation que les travaux sont affichés
}
