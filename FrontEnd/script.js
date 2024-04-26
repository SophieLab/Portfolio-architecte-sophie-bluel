document.addEventListener('DOMContentLoaded', () => {
    // Affiche initialement tous les travaux
    fetchAndDisplayWorks('Tous');
    // Initialise les boutons de filtres
    initializeFilters();
});

const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');

// Afficher les travaux selon la catégorie sélectionnée
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
    imagesContainer.innerHTML = ''; // Vide la galerie avant d'ajouter de nouveaux éléments
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
            categories.unshift({name: "Tous"}); // Ajoute "Tous" au début du tableau pour créer un bouton "Tous"
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;
                button.className = 'filtersNone'; 
                button.setAttribute('data-filter', category.name);
                
                button.addEventListener('click', function() {
                    // Retire la classe 'filterActive' de tous les boutons avant de l'ajouter au bouton cliqué
                    document.querySelectorAll('.filtersNone').forEach(btn => {
                        btn.classList.remove('filterActive');
                    });
                    this.classList.add('filterActive');
                    fetchAndDisplayWorks(category.name);
                });

                filtersContainer.appendChild(button);
            });

            // Sélectionner le bouton "Tous" et lui ajouter la classe 'filterActive'
            const allButton = filtersContainer.querySelector('button[data-filter="Tous"]');
            allButton.classList.add('filterActive');
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}
