document.addEventListener('DOMContentLoaded', function () {
    console.log("Document chargé. Initialisation de l'application...");
    initApp(); // Appelle la fonction initApp pour démarrer l'initialisation de l'application

    // Définition de la fonction   qui initialise les composants principaux de l'application
    function initApp() {
        console.log("Initialisation de l'application...");
        loadWorks();
        loadCategories();
        attachEventListeners();
    }

    // Définition de la fonction getAuthorization qui gère l'authentification
    function getAuthorization() {
        console.log("Obtention du jeton d'autorisation...");
        return 'Bearer ' + sessionStorage.getItem('Token');
    }

    // Définition de la fonction loadCategories qui charge les catégories depuis l'API
    function loadCategories() {
        console.log("Chargement des catégories...");
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(renderCategoryOptions)
            .catch(err => console.error('Erreur lors du chargement des catégories:', err));
    }

    // Définition de la fonction renderCategoryOptions qui affiche les options de catégories
    function renderCategoryOptions(categories) {
        console.log("Catégories chargées :", categories);
        const select = document.getElementById('photoCategory');
        select.innerHTML = '';
        categories.forEach(cat => {
            const option = new Option(cat.name, cat.id);
            select.appendChild(option);
        });
    }

    // Définition de la fonction loadWorks qui charge les œuvres depuis l'API
    function loadWorks() {
        console.log("Chargement des œuvres depuis l'API...");
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(displayWorks)
            .catch(err => console.error('Erreur lors du chargement des œuvres:', err));
    }

    // Définition de la fonction displayWorks qui affiche les œuvres dans la galerie
    function displayWorks(works) {
        console.log("Affichage des œuvres :", works);
        const galleryContainer = document.getElementById('galerie-modale');
        galleryContainer.innerHTML = '';
        works.forEach(work => createWorkFigure(work, galleryContainer));
    }

    // Définition de la fonction createWorkFigure qui crée une figure pour une œuvre
    function createWorkFigure(work, container) {
        const figure = document.createElement('figure');
        figure.className = 'figure-img';
        const imgElement = document.createElement('img');
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;
        figure.appendChild(imgElement);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<img src="assets/icons/trash-icon.svg" alt="Delete">';
        deleteBtn.onclick = event => deleteWork(event, work.id);
        figure.appendChild(deleteBtn);

        container.appendChild(figure);
    }

    // Définition de la fonction deleteWork qui supprime une œuvre
    function deleteWork(event, id) {
        console.log(`Suppression de l'œuvre avec l'ID : ${id}`);
        fetch('http://localhost:5678/api/works/' + id, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("Œuvre supprimée avec succès, ID :", id);
                event.target.closest('figure').remove();
                alert("Votre photo a été supprimée avec succès.");
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || "Une erreur s'est produite lors de la suppression.");
                });
            }
        })
        .catch((error) => {
            console.error('Erreur lors de la suppression de l\'œuvre:', error);
            alert("Erreur lors de la suppression de la photo.");
        });
    }

    // Définition de la fonction attachEventListeners qui attache divers écouteurs d'événements
    function attachEventListeners() {
        document.getElementById('imageUploadContainer').onclick = () => document.getElementById('fileInput').click();
        document.getElementById('fileInput').onchange = handleFileSelect;
        document.getElementById('button-modification').onclick = () => openModal('modaleGalerie');
        document.getElementById('AjoutPhoto').onclick = () => {
            openModal('modaleAjoutPhoto');
            resetUploadForm();
        };
        document.querySelectorAll('.close').forEach(btn => btn.onclick = closeModal);
        document.getElementById('retourGalerie').onclick = () => {
            closeModal();
            openModal('modaleGalerie');
        };
        document.getElementById('Valider').onclick = uploadNewWork;
    }

    // Définition de la fonction handleFileSelect qui gère la sélection de fichiers
    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            const previewImage = document.querySelector('.icon-image');
            previewImage.src = e.target.result;
            previewImage.alt = 'Aperçu de la photo téléchargée';
        };
        reader.readAsDataURL(file);
    }

    // Définition de la fonction openModal qui ouvre un modal
    function openModal(modalId) {
        closeModal();
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Définition de la fonction closeModal qui ferme les modals
    function closeModal() {
        document.querySelectorAll('.modale').forEach(modal => modal.style.display = 'none');
        document.getElementById('overlay').style.display = 'none';
    }

    // Définition de la fonction resetUploadForm qui réinitialise le formulaire d'upload
    function resetUploadForm() {
        const form = document.getElementById('uploadForm');
        form.reset();
        const previewImage = document.querySelector('.icon-image');
        previewImage.src = '';
        previewImage.alt = '';
    }

    // Définition de la fonction uploadNewWork qui télécharge une nouvelle œuvre
    function uploadNewWork() {
        const fileInput = document.getElementById('fileInput');
        if (!fileInput.files.length) {
            alert("Veuillez sélectionner un fichier à télécharger.");
            return;
        }

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', "coucou"); // À ajuster selon les besoins réels
        formData.append('category', document.getElementById('photoCategory').value);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Authorization': getAuthorization(),
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("Œuvre téléchargée avec succès:", data);
            closeModal();
            loadWorks();
            alert("Votre photo a été ajoutée avec succès.");
        })
        .catch(err => {
            console.error('Erreur lors du téléchargement de l\'œuvre:', err);
            alert("Erreur lors de l'ajout de la photo.");
        });
    }
});
