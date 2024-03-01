const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('#filters');

fetch('http://localhost:5678/api/works', {
    headers: {
        Accept: 'application/json'
    }
})
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Erreur serveur');
    }
})
.then(works => {
    displayWorks(works); 

    // Récupérer les catégories pour les filtres
    const categories = new Set(works.map(work => work.category));
    categories.forEach(category => {
        const filterButton = document.createElement('button');
        filterButton.textContent = category;
        filterButton.addEventListener('click', () => filterWorks(category, works));
        filtersContainer.appendChild(filterButton);
    });

    // Bouton pour afficher tous les travaux
    const allWorksButton = document.createElement('button');
    allWorksButton.textContent = 'Tous';
    allWorksButton.addEventListener('click', () => displayWorks(works));
    filtersContainer.appendChild(allWorksButton);
})
.catch(e => {
    console.error('Une erreur est survenue', e);
});

// Afficher les travaux
function displayWorks(works) {
    imagesContainer.innerHTML = '';
    works.forEach(work => {
        let figure = document.createElement('figure');
        imagesContainer.appendChild(figure);

        let image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.alt;
        figure.appendChild(image);

        let figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;
        figure.appendChild(figcaption);
    });
}

// Filtrer les travaux
function filterWorks(category, works) {
    const filteredWorks = works.filter(work => work.category === category);
    displayWorks(filteredWorks);
}
