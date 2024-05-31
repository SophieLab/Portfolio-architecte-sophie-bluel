import { fetchAndDisplayWorks } from "./display-works.mjs";

document.addEventListener('DOMContentLoaded', function () {

    //de base, le formulaire est vide donc on appelle la fonction checkFormValidity au chargement de la page pour être sure que le bouton est directement en disabled
    checkFormValidity();
    initApp();

    // Fonction d'initialisation de l'application
    function initApp() {
        loadWorks();
        loadCategories();
        attachEventListeners();
    }

    // Fonction pour obtenir le token d'autorisation
    function getAuthorization() {
        console.log("Getting authorization token...");
        return 'Bearer ' + sessionStorage.getItem('Token');
    }

    // Chargement des catégories depuis l'API
    function loadCategories() {
        console.log("Loading categories...");
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(categories => {
                console.log("Categories loaded:", categories);
                const select = document.getElementById('photoCategory');
                select.innerHTML = '';
                const defaultOption = new Option("Sélectionnez une catégorie", "");
                select.appendChild(defaultOption);
                categories.forEach(cat => {
                    const option = new Option(cat.name, cat.id);
                    option.classList.add('custom-text-color'); // Ajouter une classe à chaque option
                    select.appendChild(option);
                });
            })
            .catch(err => console.error('Error loading categories:', err));
    }
    
    // Chargement des travaux depuis l'API
    function loadWorks() {
        console.log("Loading works from API...");
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                console.log("Works loaded:", works);
                displayWorks(works);
            })
            .catch(err => console.error('Error loading works:', err));
    }

    // Affichage des travaux dans la galerie
    function displayWorks(works) {
        console.log("Displaying works:", works);
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
            deleteBtn.innerHTML = '<img src="assets/icons/trash-icon.svg" alt="Delete">';
            deleteBtn.onclick = (event) => {
                deleteWork(event, work.id)
            };
            figure.appendChild(deleteBtn);

            galleryContainer.appendChild(figure);
        });
    }

    // Suppression d'un travail
    function deleteWork(event, id) {
        console.log(`Deleting work with ID: ${id}`);
        fetch('http://localhost:5678/api/works/' + id, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                console.log("Work deleted successfully, ID:", id);
                event.target.closest('figure').remove();
                alert("Votre photo a été supprimée avec succès.");
                fetchAndDisplayWorks('Tous');
            })
            .catch((error) => {
                console.error('Error deleting work:', error);
                alert("Erreur lors de la suppression de la photo.");
            });
    }

    // Attachement des écouteurs d'événements
    function attachEventListeners() {

        // on s'assure que le formulaire d'envoi de la photo est bon pour changer l'état du bouton disabled
        document.getElementById('fileInput').onchange = () => {
            handleFileSelect();
            checkFormValidity();
        };

        //on ajoute un écouteur d'évènement pour s'assurer que le titre de la photo contient quelque chose
        document.getElementById('photoTitle').onchange = () => {
            checkFormValidity();
        }

        // on ajout un écouteur d'évènement pour s'assurer que la catégorie de la photo a été sélectionnée
        document.getElementById('photoCategory').onchange = () => {
            checkFormValidity();
        }

        document.getElementById('button-modification').onclick = () => {
            openModal('modaleGalerie');
        };

        document.getElementById('AjoutPhoto').onclick = () => {
            openModal('modaleAjoutPhoto');
            resetUploadForm(); // Assuming a function to reset the form
        };

        document.querySelectorAll('.close').forEach(btn => {
            btn.onclick = closeModal;
        });

        document.getElementById('retourGalerie').onclick = () => {
            closeModal();
            openModal('modaleGalerie');
        };

        document.getElementById('Valider').onclick = () => {
            checkFormValidity();
            uploadNewWork();
        };
    }

    // Sélection d'une image et prévisualisation
    function handleFileSelect() {
        const file = document.getElementById('fileInput').files[0]
        const reader = new FileReader();
        reader.onload = function (e) {
            const newImg = document.createElement('img');
            newImg.src = e.target.result;
            newImg.alt = 'Preview of uploaded photo';
            newImg.style.width = '100%';

            const uploadContainer = document.getElementById('imageUploadContainer');

            //nous voulons juste que quelques éléments se cachent ;) notamment le bouton d'ajout de photo ainsi que les infos et l'illustration
            let addPictureButton = document.querySelector('.image-upload-label');
            let formatInfo = document.querySelector('.format-info');
            let iconImage = document.querySelector('.icon-image');

            addPictureButton.style.display = "none";
            formatInfo.style.display = "none";
            iconImage.style.display = "none";

            // Ajoutez la nouvelle image au conteneur
            newImg.classList.add('new-image')
            uploadContainer.appendChild(newImg);
        };
        reader.readAsDataURL(file);
    }

    // Vérification de la validité du formulaire
    function checkFormValidity() {
        const fileInput = document.getElementById('fileInput');
        const titleInput = document.getElementById('photoTitle');
        const categorySelect = document.getElementById('photoCategory');
        const validerButton = document.getElementById('Valider');

        //!\ à la base tu avais mis !fileInput.files[0], on préfèrera plutot vérifier que le tableau contient tout simplement quelque chose avec la condition fileInput.file.length === 0
        if (fileInput.files.length === 0 || titleInput.value === '' || categorySelect.value === '') {
            validerButton.disabled = true;
        } else {
            validerButton.disabled = false;
        }
    }

    // Ouverture de la modale
    function openModal(modalId) {
        closeModal();
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Fermeture de la modale
    function closeModal() {
        document.querySelectorAll('.mod
