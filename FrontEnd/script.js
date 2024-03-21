document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayWorks();
    initializeFilters();
    setupModificationButton();

});

const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');
const overlay = document.getElementById('overlay');


// Afficher les travaux
function fetchAndDisplayWorks(category) {
    let url = 'http://localhost:5678/api/works';
    fetch(url)
        .then(response => response.json())
        .then(works => {
            if (category === undefined || category === "Tous") {
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
            filtersContainer.innerHTML = '<button class="filter-btn" data-filter="Tous">Tous</button>';// Bouton pour tous les travaux


            const allButton = filtersContainer.querySelector('.filter-btn[data-filter="Tous"]');
            allButton.addEventListener('click', function () {
                fetchAndDisplayWorks('Tous');
            });

            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.name;
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
// Configuration du bouton de modification
function setupModificationButton() {
    const modificationButton = document.getElementById('button-modification');
    modificationButton.addEventListener('click', (event) => {
        event.preventDefault();
        overlay.style.display = 'block';
    });
}
overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
});