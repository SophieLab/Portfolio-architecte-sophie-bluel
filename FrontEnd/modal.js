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
                categories.forEach(category => {
                    const option = new Option(category.name, category.id);
                    select.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading categories:', error));
    }

    function loadWorks() {
        console.log("Loading works from API...");
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                console.log("Works loaded:", works);
                displayWorks(works);
            })
            .catch(error => console.error('Error loading works:', error));
    }

    function displayWorks(works) {
        console.log("Displaying works...");
        const galleryContainer = document.getElementById('galerie-modale');
        galleryContainer.innerHTML = '';
        works.forEach(work => {
            const figure = document.createElement('figure');
            figure.className = 'figure-img';
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;
            figure.appendChild(img);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<img src="assets/icons/trash-icon.svg" alt="Delete">';
            deleteBtn.onclick = () => deleteWork(work.id);
            figure.appendChild(deleteBtn);

            galleryContainer.appendChild(figure);
        });
    }

    function deleteWork(id) {
        console.log(`Deleting work with ID: ${id}`);
        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                console.log("Work deleted successfully, ID:", id);
                loadWorks();
                alert("Photo supprimée avec succès.");
            })
            .catch(error => {
                console.error('Error deleting work:', error);
                alert("Erreur lors de la suppression de la photo.");
            });
    }

    function attachEventListeners() {
        console.log("Attaching event listeners...");
        const imageUploadContainer = document.getElementById('imageUploadContainer');
        if (imageUploadContainer) {
            imageUploadContainer.addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });
        }

        document.getElementById('fileInput').addEventListener('change', handleFileSelect);

        document.getElementById('button-modification').addEventListener('click', () => openModal('modaleGalerie'));
        document.getElementById('AjoutPhoto').addEventListener('click', () => openModal('modaleAjoutPhoto'));

        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        document.getElementById('retourGalerie').addEventListener('click', () => {
            closeModal();
            openModal('modaleGalerie');
        });

        document.getElementById('Valider').addEventListener('click', postNewWork);

        // Add event listener for image input change
        const imageInput = document.querySelector("#fileInput");
        imageInput.addEventListener("change", checkImg);
    }

    function handleFileSelect(event) {
        console.log("File selected:", event.target.files[0]);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const preview = document.querySelector('.icon-image');
                preview.src = e.target.result;
                preview.alt = 'Preview of uploaded photo';
                document.querySelector('.image-upload-label').style.display = 'none';
                document.querySelector('.format-info').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    function postNewWork() {
        const imageBase64 = document.querySelector('.icon-image').src;
        const title = document.getElementById('photoTitle').value;
        const category = document.getElementById('photoCategory').value;
        console.log("Posting new work...");
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl: imageBase64, title: title, category: category })
        })
            .then(response => response.json())
            .then(data => {
                console.log("New work added:", data);
                closeModal();
                loadWorks();
            })
            .catch(error => {
                console.error('Error posting new work:', error);
                alert("Erreur lors de l'ajout de la photo.");
            });
    }

    function openModal(modalId) {
        console.log(`Opening modal: ${modalId}`);
        closeModal();
        document.getElementById(modalId).style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }

    function closeModal() {
        console.log("Closing all modals...");
        document.querySelectorAll('.modale').forEach(modal => {
            modal.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none';
    }

    // Image validation functions
    const msgSuccesErrorSlot = document.querySelector(".msg-add-photo-success-error");
    const msgBadSizeFormatImg = document.querySelector(".msg-bad-size-format-img");

    function checkImg() {
        const selectedImage = imageInput.files[0];

        if (selectedImage) {
            if (selectedImage.size > 4 * 1024 * 1024) {
                resetForm();
                msgBadSize();
                return;
            }

            const allowedFormats = ["image/jpeg", "image/png"];
            if (!allowedFormats.includes(selectedImage.type)) {
                resetForm();
                msgBadFormat();
                return;
            }
        }
    }

    function msgAddSuccessF() {
        msgSuccesErrorSlot.textContent = "Projet ajouté avec succès !";
        msgSuccesErrorSlot.style.display = "block";

        setTimeout(() => {
            msgSuccesErrorSlot.textContent = "";
            msgSuccesErrorSlot.style.display = "none";
        }, 3000);
    }

    function msgAddErrorF() {
        msgSuccesErrorSlot.textContent = "Un problème est survenu, veuillez recommencer.";
        msgSuccesErrorSlot.style.display = "block";

        setTimeout(() => {
            msgSuccesErrorSlot.textContent = "";
            msgSuccesErrorSlot.style.display = "none";
        }, 3000);
    }

    function msgBadSize() {
        msgBadSizeFormatImg.textContent = "L'image dépasse la limite de taille de 4 Mo !";

        setTimeout(() => {
            msgBadSizeFormatImg.textContent = "";
        }, 3000);
    }

    function msgBadFormat() {
        msgBadSizeFormatImg.textContent = "Format de fichier non supporté. Utilisez JPEG ou PNG.";

        setTimeout(() => {
            msgBadSizeFormatImg.textContent = "";
        }, 3000);
    }

    function resetForm() {
        document.getElementById('fileInput').value = '';
        document.querySelector('.icon-image').src = '';
        document.querySelector('.icon-image').alt = 'Image preview';
        document.querySelector('.image-upload-label').style.display = 'block';
        document.querySelector('.format-info').style.display = 'block';
    }
});
