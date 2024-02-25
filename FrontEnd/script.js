const imagesContainer = document.querySelector('.gallery');

fetch('http://localhost:5678/api/works', {
    headers: {
        Accept: 'application/json'
    }
})
.then(r => {
    if (r.ok) {
        return r.json();
    } else {
        throw new Error('Erreur serveur', { cause: r });
    } 
})
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
})
.catch(e => {
    console.error('Une erreur est survenue', e);
});
