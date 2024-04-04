document.addEventListener('DOMContentLoaded', function() {
    chargerCategories();

    function ouvrirModale(idModale) {
        const modale = document.getElementById(idModale);
        if (modale) {
            modale.style.display = 'block'; // Affiche la modale
            document.getElementById('overlay').style.display = 'block'; // Affiche l'overlay
        }
    }
    // Ferme toutes les modales et l'overlay
    function fermerModales() {
        document.querySelectorAll('.modale').forEach(modale => {
            modale.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none';
    }

    // Gestion de l'ouverture de la modale de la galerie photo
    document.getElementById('button-modification').addEventListener('click', function() {
        ouvrirModale('modaleGalerie');
    });

    // Gestion de l'ouverture de la modale d'ajout de photo
    document.getElementById('AjoutPhoto').addEventListener('click', function(event) {
        event.stopPropagation();
        ouvrirModale('modaleAjoutPhoto');
    });

    // Fermeture des modales
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            fermerModales();
        });
    });

    // Validation de l'ajout de la photo
    document.getElementById('Valider').addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        const title = document.getElementById('photoTitle').value;
        const category = document.getElementById('photoCategory').value;

        // Vérifie si tous les champs sont remplis
        if (!fileInput.files.length || !title || !category) {
            alert('Veuillez remplir tous les champs et sélectionner une photo.');
        } else {
            fermerModales();
        }
    });

    document.getElementById('imageUploadContainer').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    // Retour à la galerie
    document.getElementById('retourGalerie').addEventListener('click', function() {
        fermerModales();
        ouvrirModale('modaleGalerie');
    });

    // Charge dynamiquement les options de catégories
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
