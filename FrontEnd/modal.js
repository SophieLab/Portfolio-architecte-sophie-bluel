document.addEventListener('DOMContentLoaded', function () {
    initApp();

    function initApp() {
        // Charger les catégories et les œuvres
        loadWorks();
        attachEventListeners();
    }

    // Fonction pour récupérer le jeton d'autorisation
    function getAuthorization() {
        // Remplacez cette chaîne par votre méthode de récupération du jeton réel
        return 'Bearer votre_jeton_api_ici';
    }

    // Récupère les données des catégories et remplit le menu déroulant des catégories
    function loadCategories() {
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

    // Récupère les données des œuvres et les affiche dans la galerie modale
    function loadWorks() {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                const galleryContainer = document.getElementById('galerie-modale');
                galleryContainer.innerHTML = '';
                works.forEach(work => {
                    const figure = document.createElement('figure');
                    figure.className = 'figure-img';
                    const imgElement = document.createElement('img');
                    imgElement.src = work.imageUrl;
                    imgElement.alt = work.title;
                    figure.appendChild(imgElement);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '<img src="assets/icons/trash-icon.svg" alt="Supprimer">';
                    deleteBtn.addEventListener('click', (event) => deleteWork(event, work.id));
                    figure.appendChild(deleteBtn);
                    galleryContainer.appendChild(figure);
                });
            })
            .catch(err => console.error('Erreur lors du chargement des œuvres:', err));
    }

    // Supprimer des œuvres
    function deleteWork(event, id) {
        fetch('http://localhost:5678/api/works/' + id, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json',
            }
        })
        .then(() => {
            event.target.closest('figure').remove();
            alert("Votre photo a été supprimée avec succès.");
        })
        .catch((error) => {
            console.error('Erreur:', error);
            alert("Erreur lors de la suppression de la photo.");
        });
    }

    function attachEventListeners() {
        const modaleGalerieBtn = document.getElementById('button-modification');
        modaleGalerieBtn.addEventListener('click', () => openModal('modaleGalerie'));

        const ajoutPhotoBtn = document.getElementById('AjoutPhoto');
        ajoutPhotoBtn.addEventListener('click', () => openModal('modaleAjoutPhoto'));

        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        const retourGalerie = document.getElementById('retourGalerie');
        retourGalerie.addEventListener('click', () => {
            closeModal();
            openModal('modaleGalerie');
        });

        document.getElementById('imageUploadContainer').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('Valider').addEventListener('click', closeModal);
    }

    // Ouvre une modale
    function openModal(modalId) {
        closeModal();
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Ferme toutes les modales et l'overlay
    function closeModal() {
        const modals = document.querySelectorAll('.modale');
        const overlay = document.getElementById('overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        overlay.style.display = 'none';
    }
});
