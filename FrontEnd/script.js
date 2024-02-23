document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5678/api-docs/') 
        .then(response => response.json())
        .then(data => {
            const galerie = document.querySelector('.gallery');
            data.forEach(projet => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const figcaption = document.createElement('figcaption');
                
                img.src = projet.image; 
                img.alt = projet.titre; 
                figcaption.textContent = projet.titre;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                galerie.appendChild(figure);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));
});
