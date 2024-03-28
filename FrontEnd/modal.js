document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour ouvrir une modale spécifique
    function ouvrirModale(idModale) {
        const modale = document.getElementById(idModale);
        if (modale) {
            modale.style.display = 'block';
            document.getElementById('overlay').style.display = 'block'; // Assure que l'overlay est affiché
        }
    }

    // Fonction pour fermer toutes les modales
    function fermerModales() {
        document.querySelectorAll('.modale').forEach(function(modale) {
            modale.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none'; // Cache l'overlay
    }

    // Ouverture de la modale de la galerie photo via le bouton de modification
    document.getElementById('button-modification').addEventListener('click', function() {
        ouvrirModale('modaleGalerie');
    });

    // Ouverture de la modale d'ajout de photo depuis la modale de galerie
    document.getElementById('AjoutPhoto').addEventListener('click', function(event) {
        event.stopPropagation(); // Empêche la fermeture de la modale de galerie
        ouvrirModale('modaleAjoutPhoto');
    });

    // Fermeture des modales via les boutons de fermeture
    document.querySelectorAll('.close').forEach(function(btn) {
        btn.addEventListener('click', function() {
            fermerModales();
        });
    });

    // Fermeture des modales en cliquant sur l'overlay
    document.getElementById('overlay').addEventListener('click', function(e) {
        if (e.target.id === 'overlay') {
            fermerModales();
        }
    });

    // Validation et ajout d'une photo
    document.getElementById('Valider').addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        const title = document.getElementById('photoTitle').value;
        const category = document.getElementById('photoCategory').value;
        if (!fileInput.files.length || !title || !category) {
            alert('Veuillez remplir tous les champs et sélectionner une photo.');
        } else {
            // Logique pour traiter/envoyer l'image, le titre et la catégorie
            console.log("Photo ajoutée avec succès.");

            fermerModales(); // Ferme les modales une fois la photo ajoutée
        }
    });

    // Écouteur pour simuler le clic sur l'input file quand on clique sur le carré d'ajout d'image
    document.getElementById('imageUploadContainer').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });
});
