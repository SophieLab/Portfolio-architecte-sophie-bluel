document.addEventListener('DOMContentLoaded', function () {
    initApp();

    function initApp() {
        loadWorks();
        loadCategories();
        attachEventListeners();
    }

    function getAuthorization() {
        return 'Bearer votre_jeton_api_ici';  // Remplacez par votre méthode de récupération du jeton réel
    }

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
        document.getElementById('imageUploadContainer').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', handleFileSelect);

        document.getElementById('button-modification').addEventListener('click', () => openModal('modaleGalerie'));
        document.getElementById('AjoutPhoto').addEventListener('click', () => openModal('modaleAjoutPhoto'));

        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        document.getElementById('retourGalerie').addEventListener('click', () => {
            closeModal();
            openModal('modaleGalerie');
        });

        document.getElementById('Valider').addEventListener('click', closeModal);
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const iconImage = document.querySelector('.icon-image');
        const uploadLabel = document.querySelector('.image-upload-label');
        const formatInfo = document.querySelector('.format-info');

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                iconImage.src = e.target.result;
                iconImage.alt = 'Aperçu de la photo téléchargée';
                uploadLabel.style.display = 'none';
                formatInfo.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    function openModal(modalId) {
        closeModal();
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function closeModal() {
        const modals = document.querySelectorAll('.modale');
        const overlay = document.getElementById('overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        overlay.style.display = 'none';
    }
});
