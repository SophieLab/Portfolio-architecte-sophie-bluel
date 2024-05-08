// L'écouteur d'événement 'DOMContentLoaded' est utilisé pour s'assurer que le DOM est entièrement chargé avant d'exécuter le code.
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();  // Initialisation des filtres.
    fetchAndDisplayWorks('Tous');  // Récupération et affichage des œuvres pour toutes les catégories.
});

const imagesContainer = document.querySelector('.gallery');  // Sélection du conteneur pour les images.
const filtersContainer = document.querySelector('.filters');  // Sélection du conteneur pour les filtres.

// Définition de la fonction qui récupère et affiche les œuvres selon une catégorie donnée.
function fetchAndDisplayWorks(category) {
    fetchWorks()
        .then(works => {
            // Filtrage des œuvres en fonction de la catégorie sélectionnée ou affichage de toutes les œuvres.
            const filteredWorks = category !== "Tous" ? works.filter(work => work.category.name === category) : works;
            displayWorks(filteredWorks);  // Affichage des œuvres filtrées.
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux :', error));
}

// Fonction pour afficher les œuvres dans le conteneur.
function displayWorks(works) {
    imagesContainer.innerHTML = '';  // Nettoyage du conteneur avant d'ajouter de nouvelles œuvres.
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;  // Définition de l'URL de l'image.
        img.alt = work.title;  // Définition du texte alternatif pour l'image.

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;  // Ajout du titre de l'œuvre.

        figure.appendChild(img);
        figure.appendChild(figcaption);
        imagesContainer.appendChild(figure);  // Ajout de l'élément figure au conteneur d'images.
    });
}

// Fonction pour initialiser les filtres basés sur les catégories disponibles.
function initializeFilters() {
    fetchCategories()
        .then(categories => {
            categories.unshift({ name: "Tous" });  // Ajout de l'option "Tous" au début de la liste des catégories.
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;  // Définition du nom du bouton selon la catégorie.
                button.className = 'filtersNone';
                button.dataset.filter = category.name;  // Utilisation de dataset pour stocker le nom de la catégorie.

                button.addEventListener('click', () => {
                    // Gestion du clic sur le bouton pour appliquer le filtre.
                    document.querySelectorAll('.filtersNone').forEach(btn => btn.classList.remove('filterActive'));
                    button.classList.add('filterActive');  // Activation du bouton cliqué.
                    fetchAndDisplayWorks(category.name);  // Récupération et affichage des œuvres selon la catégorie sélectionnée.
                });

                filtersContainer.appendChild(button);  // Ajout du bouton au conteneur de filtres.
            });
            // Activation par défaut du bouton "Tous".
            filtersContainer.querySelector('button[data-filter="Tous"]').classList.add('filterActive');
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
}
