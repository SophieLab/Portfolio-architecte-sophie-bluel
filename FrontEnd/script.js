// Attend que le DOM soit chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
    // Affiche initialement tous les travaux
    fetchAndDisplayWorks('Tous');
    // Initialise les boutons de filtres
    initializeFilters();
});

// Sélectionne le conteneur des images dans la galerie
const imagesContainer = document.querySelector('.gallery');
// Sélectionne le conteneur des filtres
const filtersContainer = document.querySelector('.filters');

// Fonction pour récupérer et afficher les travaux selon la catégorie sélectionnée
function fetchAndDisplayWorks(category) {
    // URL de l'API pour récupérer les travaux
    let url = 'http://localhost:5678/api/works';
    // Appel à l'API pour récupérer les travaux
    fetch(url)
        .then(response => response.json())
        .then(works => {
            // Filtre les travaux si une catégorie spécifique est choisie
            const filteredWorks = category !== "Tous" ? works.filter(work => work.category.name === category) : works;
            // Affiche les travaux filtrés dans la galerie
            displayWorks(filteredWorks);
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux:', error));
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
    // Vide la galerie avant d'ajouter de nouveaux éléments
    imagesContainer.innerHTML = '';
    // Pour chaque travail, crée une figure avec une image et un titre, puis l'ajoute à la galerie
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

// Fonction pour initialiser les boutons de filtres de catégorie
function initializeFilters() {
    // Appel à l'API pour récupérer les catégories
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            // Ajoute "Tous" au début du tableau des catégories pour créer un bouton "Tous"
            categories.unshift({name: "Tous"});
            // Pour chaque catégorie, crée un bouton de filtre et l'ajoute au conteneur des filtres
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;
                button.className = 'filtersNone'; 
                button.setAttribute('data-filter', category.name);
                // Ajoute un gestionnaire d'événement au clic sur le bouton pour filtrer les travaux
                button.addEventListener('click', function() {
                    // Retire la classe 'filterActive' de tous les boutons avant de l'ajouter au bouton cliqué
                    document.querySelectorAll('.filtersNone').forEach(btn => {
                        btn.classList.remove('filterActive');
                    });
                    this.classList.add('filterActive');
                    // Récupère et affiche les travaux de la catégorie sélectionnée
                    fetchAndDisplayWorks(category.name);
                });

                filtersContainer.appendChild(button);
            });
            // Sélectionne le bouton "Tous" et lui ajoute la classe 'filterActive'
            const allButton = filtersContainer.querySelector('button[data-filter="Tous"]');
            allButton.classList.add('filterActive');
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}
