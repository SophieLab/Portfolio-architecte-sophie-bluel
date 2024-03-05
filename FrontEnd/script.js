const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');

// Fonction pour afficher les travaux
function fetchAndDisplayWorks(category = '') {
    let url = 'http://localhost:5678/api/works';
    if (category) {
        url += `?category=${category}`; 
    }

    fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) throw new Error('Erreur serveur');
            return response.json();
        })
        .then(works => {
            displayWorks(works);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des œuvres :', error);
        });
}

// Fonction pour afficher les œuvres dans la galerie
function displayWorks(works) {
    imagesContainer.innerHTML = ''; // Effacer les œuvres précédentes
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

// Fonction pour initialiser les filtres
function initializeFilters() {
    fetch('http://localhost:5678/api/categories', {
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => response.json())
        .then(categories => {
            createFilterButtons(categories);
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

// Fonction pour créer les boutons de filtres
function createFilterButtons(categories) {
    // Bouton pour afficher tous les travaux
    const allWorksButton = document.createElement('button');
    allWorksButton.textContent = 'Tous';
    allWorksButton.className = 'button';
    allWorksButton.addEventListener('click', () => {
        fetchAndDisplayWorks();
    });
    filtersContainer.appendChild(allWorksButton);

    // Boutons pour chaque catégorie
    categories.forEach(category => {
        const filterButton = document.createElement('button');
        filterButton.textContent = category.name; 
        filterButton.className = 'button';
        filterButton.addEventListener('click', () => {
            fetchAndDisplayWorks(category.name);
        });
        filtersContainer.appendChild(filterButton);
    });
}

// Appel initial pour charger et afficher les travaux et initialiser les filtres
fetchAndDisplayWorks();
initializeFilters();
