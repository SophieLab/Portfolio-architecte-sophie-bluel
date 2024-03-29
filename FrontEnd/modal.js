document.addEventListener('DOMContentLoaded', function() {
    chargerCategories();

    function ouvrirModale(idModale) {
        const modale = document.getElementById(idModale);
        if (modale) {
            modale.style.display = 'block'; // Affiche la modale
            document.getElementById('overlay').style.display = 'block'; // Affiche l'overlay
        }
    }

    // Fonction pour fermer toutes les modales et l'overlay
    function fermerModales() {
        document.querySelectorAll('.modale').forEach(function(modale) {
            modale.style.display = 'none'; // Cache chaque modale
        });
        document.getElementById('overlay').style.display = 'none'; // Cache l'overlay
    }

    // Ouverture de la modale de la galerie photo
    document.getElementById('button-modification').addEventListener('click', function() {
        ouvrirModale('modaleGalerie');
    });

    // Ouverture de la modale d'ajout de photo
    document.getElementById('AjoutPhoto').addEventListener('click', function(event) {
        event.stopPropagation(); // Empêche l'événement de se propager
        ouvrirModale('modaleAjoutPhoto');
    });

    // Fermeture des modales
    document.querySelectorAll('.close').forEach(function(btn) {
        btn.addEventListener('click', function() {
            fermerModales();
        });
    });

    // Fermeture des modales quand on clique sur l'overlay, en dehors des modales
    document.getElementById('overlay').addEventListener('click', function(e) {
        if (e.target.id === 'overlay') {
            fermerModales();
        }
    });

    // Validation de l'ajout de la photo
    document.getElementById('Valider').addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        const title = document.getElementById('photoTitle').value;
        const category = document.getElementById('photoCategory').value;

        if (!fileInput.files.length || !title || !category) {
            alert('Veuillez remplir tous les champs et sélectionner une photo.');
        } else {
            fermerModales(); // Ferme les modales si l'ajout est réussi
        }
    });

    document.getElementById('imageUploadContainer').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    //Retourner à la galerie depuis la modale d'ajout de photo
    document.getElementById('retourGalerie').addEventListener('click', function() {
        fermerModales();
        ouvrirModale('modaleGalerie'); 
    });

    // Charge dynamiquement les catégories
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
});
