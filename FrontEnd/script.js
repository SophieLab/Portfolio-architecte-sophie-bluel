document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayWorks();
    initializeFilters();
});

const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');

// Afficher les travaux
function fetchAndDisplayWorks(category) {
    //ne pas oublier de mettre le paramètre category dans la fonction
    let url = 'http://localhost:5678/api/works';
    fetch(url)
        .then(response => response.json())
        .then(works => {
            if(category === undefined || category === "Tous") {
                displayWorks(works)
            } else {

                let newWorksArray = works.filter((work) => work.category.name === category)
                displayWorks(newWorksArray)
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux:', error));
}

//Afficher les travaux dans la galerie
function displayWorks(works) {
    imagesContainer.innerHTML = '';
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

// Initialiser les filtres
function initializeFilters() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            filtersContainer.innerHTML = '<button class="filter-btn" data-filter="Tous">Tous</button>'; // Bouton pour tous les travaux
            
            
            // Ajout de l'écouteur d'événement au bouton "Tous"
            const allButton = filtersContainer.querySelector('.filter-btn[data-filter="Tous"]');
            allButton.addEventListener('click', function () {
                fetchAndDisplayWorks('Tous'); // Ou un argument approprié pour afficher tous les travaux
            });
            
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name; // Utilisation de 'name' si l'API retourne un objet
                button.className = 'filter-btn';
                button.setAttribute('data-filter', category.name);
                button.addEventListener('click', function () {
                    const filterValue = this.getAttribute('data-filter');
                    fetchAndDisplayWorks(filterValue);
                });
                filtersContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

