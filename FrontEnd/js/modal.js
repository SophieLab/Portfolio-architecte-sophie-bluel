import { fetchAndDisplayWorks } from "./display-works.mjs";

document.addEventListener('DOMContentLoaded', function () {
    // Initialisation de la validité du formulaire et de l'application
    checkFormValidity();
    initApp();

    // Fonction principale pour initialiser l'application
    function initApp() {
        loadWorks();
        loadCategories();
        attachEventListeners(); // Attache les écouteurs d'événements
    }

    // Récupère le token d'autorisation depuis sessionStorage
    function getAuthorization() {
        console.log("Getting authorization token...");
        return 'Bearer ' + sessionStorage.getItem('Token');
    }

    // Charge les catégories depuis l'API et les ajoute au select
    function loadCategories() {
        console.log("Loading categories...");
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json()) // Transforme la réponse en JSON
            .then(categories => {
                console.log("Categories loaded:", categories);
                const select = document.getElementById('photoCategory');
                select.innerHTML = ''; // Vide le select existant
                const defaultOption = new Option("Sélectionnez une catégorie", "");
                select.appendChild(defaultOption); // Ajoute l'option par défaut
                categories.forEach(cat => {
                    const option = new Option(cat.name, cat.id);
                    option.classList.add('custom-text-color');
                    select.appendChild(option); // Ajoute chaque catégorie au select
                });
            })
            .catch(err => console.error('Error loading categories:', err)); // Gestion des erreurs
    }

    // Charge les travaux depuis l'API et les affiche dans la galerie
    function loadWorks() {
        console.log("Loading works from API...");
        fetch('http://localhost:5678/api/works')
            .then(response => response.json()) // Transforme la réponse en JSON
            .then(works => {
                console.log("Works loaded:", works);
                displayWorks(works); // Affiche les travaux
            })
            .catch(err => console.error('Error loading works:', err)); // Gestion des erreurs
    }

    // Affiche les travaux dans la galerie modale
    function displayWorks(works) {
        console.log("Displaying works:", works);
        const galleryContainer = document.getElementById('galerie-modale');
        galleryContainer.innerHTML = ''; // Vide la galerie existante
        works.forEach(work => {
            const figure = document.createElement('figure');
            figure.className = 'figure-img';
            const imgElement = document.createElement('img');
            imgElement.src = work.imageUrl;
            imgElement.alt = work.title;
            figure.appendChild(imgElement);

            // Ajoute un bouton de suppression pour chaque travail
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<img src="assets/icons/trash-icon.svg" alt="Delete">';
            deleteBtn.onclick = (event) => {
                deleteWork(event, work.id);
            };
            figure.appendChild(deleteBtn);

            galleryContainer.appendChild(figure); // Ajoute le travail à la galerie
        });
    }

    // Supprime un travail via l'API
    function deleteWork(event, id) {
        console.log(`Deleting work with ID: ${id}`);
        fetch('http://localhost:5678/api/works/' + id, {
            method: "DELETE", // Méthode de suppression
            headers: {
                'Accept': 'application/json',
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                console.log("Work deleted successfully, ID:", id);
                event.target.closest('figure').remove(); // Retire le travail de l'affichage
                alert("Votre photo a été supprimée avec succès.");
                let activeFilter = document.querySelector('.filterActive');
                let currentCategory = activeFilter.dataset.filter
                fetchAndDisplayWorks('  currentCategory');
                fetchAndDisplayWorks('Tous'); // Recharge les travaux
            })
            .catch((error) => {
                console.error('Error deleting work:', error);
                alert("Erreur lors de la suppression de la photo.");
            });
    }

    // Attache les écouteurs d'événements nécessaires
    function attachEventListeners() {
        // Gestion de la sélection de fichier
        document.getElementById('fileInput').onchange = () => {
            handleFileSelect();
            checkFormValidity(); // Vérifie la validité du formulaire
        };

        // Vérification de la validité du formulaire lors du changement du titre
        document.getElementById('photoTitle').onchange = () => {
            checkFormValidity();
        };

        // Vérification de la validité du formulaire lors du changement de la catégorie
        document.getElementById('photoCategory').onchange = () => {
            checkFormValidity();
        };

        // Ouverture de la modale de modification
        document.getElementById('button-modification').onclick = () => {
            openModal('modaleGalerie');
        };

        // Ouverture de la modale d'ajout de photo
        document.getElementById('AjoutPhoto').onclick = () => {
            openModal('modaleAjoutPhoto');
            resetUploadForm(); // Réinitialise le formulaire d'upload
        };

        // Fermeture des modales
        document.querySelectorAll('.close').forEach(btn => {
            btn.onclick = closeModal;
        });

        // Retour à la galerie
        document.getElementById('retourGalerie').onclick = () => {
            closeModal();
            openModal('modaleGalerie');
        };

        // Soumission du formulaire de nouvelle photo
        document.getElementById('Valider').onclick = () => {
            checkFormValidity();
            uploadNewWork();
        };
    }

    // Gestion de la sélection de fichier et affichage de la prévisualisation
    function handleFileSelect() {
        const file = document.getElementById('fileInput').files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const newImg = document.createElement('img');
            newImg.src = e.target.result;
            newImg.alt = 'Preview of uploaded photo';
            newImg.style.width = '100%';

            const uploadContainer = document.getElementById('imageUploadContainer');

            // Masque les éléments associés à l'upload
            let addPictureButton = document.querySelector('.image-upload-label');
            let formatInfo = document.querySelector('.format-info');
            let iconImage = document.querySelector('.icon-image');

            addPictureButton.style.display = "none";
            formatInfo.style.display = "none";
            iconImage.style.display = "none";

            newImg.classList.add('new-image');
            uploadContainer.appendChild(newImg); // Ajoute l'image prévisualisée
        };
        reader.readAsDataURL(file);
    }

    // Vérifie la validité du formulaire d'ajout de photo
    function checkFormValidity() {
        const fileInput = document.getElementById('fileInput');
        const titleInput = document.getElementById('photoTitle');
        const categorySelect = document.getElementById('photoCategory');
        const validerButton = document.getElementById('Valider');

        // Active ou désactive le bouton de validation selon les champs remplis
        if (fileInput.files.length === 0 || titleInput.value === '' || categorySelect.value === '') {
            validerButton.disabled = true;
        } else {
            validerButton.disabled = false;
        }
    }

    // Ouvre une modale spécifiée par son ID
    function openModal(modalId) {
        closeModal(); // Ferme toutes les modales avant d'ouvrir la nouvelle
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Ferme toutes les modales
    function closeModal() {
        document.querySelectorAll('.modale').forEach(modal => {
            modal.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none';
    }

    // Réinitialise le formulaire d'upload de photo
    function resetUploadForm() {
        let addPictureButton = document.querySelector('.image-upload-label');
        let formatInfo = document.querySelector('.format-info');
        let iconImage = document.querySelector('.icon-image');

        addPictureButton.style.display = "flex";
        formatInfo.style.display = "flex";
        iconImage.style.display = "flex";

        const uploadContainer = document.getElementById('imageUploadContainer');
        const newImage = document.querySelector(".new-image");
        if (newImage) {
            uploadContainer.removeChild(newImage);
        }

        const imageTitle = document.getElementById('photoTitle');
        imageTitle.value = '';

        const photoCategory = document.getElementById('photoCategory');
        photoCategory.selectedIndex = 0; // Réinitialise à l'option par défaut
    }

    // Upload d'un nouveau travail via l'API
    function uploadNewWork() {
        const fileInput = document.getElementById('fileInput');
        const formData = new FormData();
        formData.append('image', fileInput.files[0]); // Ajoute le fichier image
        formData.append('title', document.getElementById('photoTitle').value); // Ajoute le titre
        formData.append('category', document.getElementById('photoCategory').value); // Ajoute la catégorie

        fetch("http://localhost:5678/api/works", {
            method: "POST", // Méthode de création
            headers: {
                'Authorization': getAuthorization(),
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.error || 'Failed to upload new work');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Work uploaded successfully:", data);
                closeModal(); // Ferme la modale d'ajout de photo
                loadWorks(); // Recharge les travaux
                let activeFilter = document.querySelector('.filterActive');
                let currentCategory = activeFilter.dataset.filter
                fetchAndDisplayWorks('  currentCategory');
                fileInput.value = ""; // Réinitialise le champ de fichier
            })


            .catch(error => {
                document.getElementById("modal-error").innerText = "Champs incorrects";
                console.error('Error uploading new work:', error);
            });
    }
});
