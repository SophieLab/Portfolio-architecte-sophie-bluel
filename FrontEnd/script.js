const imagesContainer = document.querySelector('.gallery');
const filtersContainer = document.querySelector('#filters');

fetch('http://localhost:5678/api/works', {
    headers: {
        Accept: 'application/json'
    }
})
    .then(r => {
        if (r.ok) {
            return r.json();
        } else {
            throw new Error('Erreur serveur', { cause: response });
        }
    })

    // Afficher tous les travaux
    .then(works => {
        for (let index = 0; index < works.length; index++) {
            let figure = document.createElement('figure');
            imagesContainer.appendChild(figure);

            let image = document.createElement('img');
            image.src = works[index].imageUrl;
            image.alt = works[index].alt;
            figure.appendChild(image);

            let figcaption = document.createElement('figcaption');
            figcaption.textContent = works[index].title;
            figure.appendChild(figcaption);
        }
        console.log('La liste des travaux: ', works);


        // Récupèrer les catégories pour les filtres
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

})
.catch (e => {
    console.error('Une erreur est survenue', e);
});
