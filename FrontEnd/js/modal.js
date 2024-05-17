import { fetchAndDisplayWorks } from "./display-works.mjs";

document.addEventListener('DOMContentLoaded', function () {
    console.log("Document loaded. Initializing app...");
    initApp();

    function initApp() {
        console.log("Initializing application...");
        loadWorks();
        loadCategories();
        attachEventListeners();
    }

    function getAuthorization() {
        console.log("Getting authorization token...");
        return 'Bearer ' + sessionStorage.getItem('Token');
    }

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
                    select.appendChild(option);
                });
            })
            .catch(err => console.error('Error loading categories:', err));
    }
    

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

    function attachEventListeners() {
        console.log("Attaching event listeners...");
        document.getElementById('imageUploadContainer').onclick = () => {
            document.getElementById('fileInput').click();
        };

        document.getElementById('fileInput').onchange = handleFileSelect;

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
            uploadNewWork();
        };
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            // Créer un nouvel élément img
            const newImg = document.createElement('img');
            newImg.src = e.target.result;
            newImg.alt = 'Preview of uploaded photo';
            newImg.style.width = '100%';
    
            // Sélectionnez le conteneur et effacez son contenu
            const uploadContainer = document.getElementById('imageUploadContainer');
            uploadContainer.innerHTML = ''; // Videz le conteneur
    
            // Ajoutez la nouvelle image au conteneur
            uploadContainer.appendChild(newImg);
        };
        reader.readAsDataURL(file);
    }
   // function checkFormValidity() {
       // const fileInput = document.getElementById('fileInput');
       // const titleInput = document.getElementById('photoTitle');
       // const categorySelect = document.getElementById('photoCategory');
       // const validerButton = document.getElementById('Valider');

        //if (!fileInput.files[0] || titleInput.value.trim() === '' || categorySelect.value === '') {
           // validerButton.disabled = true;
            //validerButton.style.opacity = 0.5; y
        //} else {
          //  validerButton.disabled = false;
            //validerButton.style.opacity = 1; 
       // }
   // }
    function openModal(modalId) {
        closeModal();
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function closeModal() {
        document.querySelectorAll('.modale').forEach(modal => {
            modal.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none';
    }

    function resetUploadForm() {
        const previewImage = document.querySelector('.icon-image');
        previewImage.src = 'assets/icons/picture.svg'; // Remettre l'icône d'origine
        previewImage.alt = 'Icône image';
    
        const imageTitle = document.getElementById('photoTitle');
        imageTitle.value = '';
    
        const photoCategory = document.getElementById('photoCategory');
        photoCategory.selectedIndex = 0; // Réinitialiser à l'option par défaut
    }
    

    function uploadNewWork() {
        const fileInput = document.getElementById('fileInput');
        const formData = new FormData();

        formData.append('image', fileInput.files[0]);
        formData.append('title', document.getElementById('photoTitle').value);
        formData.append('category', document.getElementById('photoCategory').value);


        fetch("http://localhost:5678/api/works", {
            method: "POST",
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
                closeModal();
                loadWorks();
                fetchAndDisplayWorks('Tous');
            })
            .catch(error => {
                document.getElementById("modal-error").innerText="Champs incorretces";
                console.error('Error uploading new work:', error);
            });
    }
});
