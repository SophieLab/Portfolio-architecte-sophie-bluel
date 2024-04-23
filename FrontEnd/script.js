document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayWorks('Tous'); // Affiche initialement tous les travaux
    initializeFilters();
});

const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');
const overlay = document.getElementById('overlay');

// Afficher les travaux selon la catégorie
function fetchAndDisplayWorks(category) {
    let url = 'http://localhost:5678/api/works';
    fetch(url)
        .then(response => response.json())
        .then(works => {
            // Filtre les travaux si une catégorie spécifique est choisie
            const filteredWorks = category !== "Tous" ? works.filter(work => work.category.name === category) : works;
            displayWorks(filteredWorks);
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux:', error));
}

// Afficher les travaux dans la galerie
function displayWorks(works) {
    imagesContainer.innerHTML = ''; // Réinitialise la galerie
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
}


// Initialiser les filtres de catégorie
function initializeFilters() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            console.log("Catégories récupérées:", categories); // Log pour déboguer
            categories.unshift({name: "Tous"}); // Ajoute "Tous" au début du tableau pour créer un bouton "Tous"
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;
                button.className = 'filtersNone'; 
                button.setAttribute('data-filter', category.name);
                
                button.addEventListener('click', function() {
                    document.querySelectorAll('.filters-button').forEach(btn => {
                        btn.classList.remove('filterActive'); // Retire la classe active des autres boutons
                    });
                    this.classList.add('filterActive'); // Ajoute la classe active au bouton cliqué
                    fetchAndDisplayWorks(category.name);
                });
                
                filtersContainer.appendChild(button);
            });

            const allButton = filtersContainer.querySelector('button[data-filter="Tous"]');
            allButton.classList.add('filterActive');
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}
