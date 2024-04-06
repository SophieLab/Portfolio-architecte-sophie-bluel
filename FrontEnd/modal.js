document.addEventListener('DOMContentLoaded', function() {
    chargerCategories();
    chargerTravaux();

    function ouvrirModale(idModale) {
        const modale = document.getElementById(idModale);
        if (modale) {
            modale.style.display = 'block'; // Affiche la modale
            document.getElementById('overlay').style.display = 'block'; // Affiche l'overlay
            // Si ouverture de la modale galerie, recharge les travaux
            if (idModale === 'modaleGalerie') chargerTravaux();
        }
    }

    function fermerModales() {
        document.querySelectorAll('.modale').forEach(modale => {
            modale.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none';
    }

    document.getElementById('button-modification').addEventListener('click', function() {
        ouvrirModale('modaleGalerie');
    });

    document.getElementById('AjoutPhoto').addEventListener('click', function(event) {
        event.stopPropagation();
        ouvrirModale('modaleAjoutPhoto');
    });

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            fermerModales();
        });
    });

    document.getElementById('Valider').addEventListener('click', function() {
        // Logique de validation...
        fermerModales();
    });

    document.getElementById('imageUploadContainer').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    document.getElementById('retourGalerie').addEventListener('click', function() {
        fermerModales();
        ouvrirModale('modaleGalerie');
    });

    function chargerCategories() {
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(categories => {
                const select = document.getElementById('photoCategory');
                categories.forEach(cat => {
                    const option = new Option(cat.name, cat.id);
                    select.appendChild(option);
                });
            })
            .catch(err => console.error('Erreur lors du chargement des catégories:', err));
    }

    function chargerTravaux() {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                const galerieContainer = document.getElementById('galerie-modale');
                galerieContainer.innerHTML = ''; // Vide la galerie avant de la remplir à nouveau
                works.forEach(work => {
                    const imgElement = document.createElement('img');
                    imgElement.src = work.imageUrl;
                    imgElement.alt = work.title;
                    imgElement.style.width = '100%'; // Ajustez comme nécessaire
                    galerieContainer.appendChild(imgElement);
                });
            })
            .catch(err => console.error('Erreur lors du chargement des travaux:', err));
    }
});
