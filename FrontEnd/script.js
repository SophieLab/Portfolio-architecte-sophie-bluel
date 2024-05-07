document.addEventListener('DOMContentLoaded', () => {
    // Initialise les filtres et charge tous les travaux par défaut
    initializeFilters();
    fetchAndDisplayWorks('Tous');
});

const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');

function fetchAndDisplayWorks(category) {
    const url = 'http://localhost:5678/api/works';
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la récupération des travaux : ' + response.statusText);
            }
            return response.json();
        })
        .then(works => {
            const filteredWorks = category !== "Tous" ? works.filter(work => work.category.name === category) : works;
            displayWorks(filteredWorks);
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux :', error));
}

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

function initializeFilters() {
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la récupération des catégories : ' + response.statusText);
            }
            return response.json();
        })
        .then(categories => {
            categories.unshift({ name: "Tous" });
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;
                button.className = 'filtersNone';
                button.dataset.filter = category.name;

                button.addEventListener('click', () => {
                    document.querySelectorAll('.filtersNone').forEach(btn => btn.classList.remove('filterActive'));
                    button.classList.add('filterActive');
                    fetchAndDisplayWorks(category.name);
                });

                filtersContainer.appendChild(button);
            });
            // Active par défaut le bouton "Tous"
            filtersContainer.querySelector('button[data-filter="Tous"]').classList.add('filterActive');
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
}
