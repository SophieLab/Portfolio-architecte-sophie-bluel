import { fetchAndDisplayWorks } from "./display-works.mjs";

// Événement se déclenchant lorsque le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', () => {

    // Initialisation des filtres et chargement des travaux de la catégorie 'Tous'
    initializeFilters();
    fetchAndDisplayWorks('Tous');
});

// Sélection de l'élément HTML contenant les filtres
const filtersContainer = document.querySelector('.filters');

// Fonction pour initialiser les filtres
function initializeFilters() {

    // Récupération des catégories depuis l'API
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            // Vérification si la requête a réussi
            if (!response.ok) {
                throw new Error('Échec de la récupération des catégories : ' + response.statusText);
            }
            return response.json();
        })
        .then(categories => {

            // Ajout de la catégorie "Tous" au début du tableau des catégories
            categories.unshift({ name: "Tous" });

            // Boucle à travers chaque catégorie
            categories.forEach(category => {
                // Création d'un bouton pour chaque catégorie
                const button = document.createElement('button');
                button.textContent = category.name;
                button.className = 'filtersNone';
                button.dataset.filter = category.name;

                // Écouteur d'événement pour chaque bouton de filtre
                button.addEventListener('click', () => {

                    // Retire la classe 'filterActive' de tous les boutons de filtre
                    document.querySelectorAll('.filtersNone').forEach(btn => {
                        btn.classList.remove('filterActive');
                    });

                    // Ajoute la classe 'filterActive' au bouton cliqué
                    button.classList.add('filterActive');

                    // Appel de la fonction fetchAndDisplayWorks avec la catégorie sélectionnée
                    fetchAndDisplayWorks(category.name);
                });

                // Ajout du bouton de filtre au conteneur des filtres
                filtersContainer.appendChild(button);
            });

            // Active par défaut le bouton "Tous"
            filtersContainer.querySelector('button[data-filter="Tous"]').classList.add('filterActive');
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
}
