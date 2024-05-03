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
                categories.forEach(cat => {
                    const option = new Option(cat.name, cat.id);
                    select.appendChild(option);
                });
            })
            .catch(err => console.error('Error loading categories:', err));
    }

    function fetchAndDisplayWorks(category = "Tous") {
        console.log(`Fetching works for category: ${category}`);
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                console.log("Works fetched:", works);
                const filteredWorks = category !== "Tous" ? works.filter(work => work.category.name === category) : works;
                displayWorks(filteredWorks);
            })
            .catch(error => console.error('Error fetching works:', error));
    }

    function displayWorks(works) {
        console.log("Displaying works:", works);
        const imagesContainer = document.getElementById('imagesContainer');
        imagesContainer.innerHTML = '';
        works.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            imagesContainer.appendChild(figure);
        });
    }

    function loadWorks() {
        console.log("Loading works from API...");
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                console.log("Works loaded:", works);
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
                    deleteBtn.onclick = (event) => deleteWork(event, work.id);
                    figure.appendChild(deleteBtn);
                    galleryContainer.appendChild(figure);
                });
            })
            .catch(err => console.error('Error loading works:', err));
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
                fetchAndDisplayWorks("Tous");
                alert("Votre photo a été supprimée avec succès.");
            })
            .catch((error) => {
                console.error('Error deleting work:', error);
                alert("Erreur lors de la suppression de la photo.");
            });
    }

    function attachEventListeners() {
        console.log("Attaching event listeners...");
        document.getElementById('imageUploadContainer').onclick = () => {
            console.log("Image upload container clicked...");
            document.getElementById('fileInput').click();
        };

        document.getElementById('fileInput').onchange = handleFileSelect;

        document.getElementById('button-modification').onclick = () => {

            console.log("Modification button clicked...");
            openModal('modaleGalerie');
        };
        document.getElementById('AjoutPhoto').onclick = () => {

            console.log("Add photo button clicked...");
            openModal('modaleAjoutPhoto');
        };

        document.querySelectorAll('.close').forEach(btn => {
            btn.onclick = closeModal;
        });

        document.getElementById('retourGalerie').onclick = () => {
            console.log("Returning to gallery...");
            closeModal();
            openModal('modaleGalerie');
        };

        document.getElementById('Valider').onclick = () => {
            //closeModal
            fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Authorization': getAuthorization(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: "coucou.png",
                    title: "coucou",
                    category: 1
                })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errData => {
                            throw new Error(errData.error || 'Login failed');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.log(error);
                });
        };

    }

    function handleFileSelect(event) {
        console.log("File selected:", event.target.files[0]);
        const file = event.target.files[0];
        const iconImage = document.querySelector('.icon-image');
        const uploadLabel = document.querySelector('.image-upload-label');
        const formatInfo = document.querySelector('.format-info');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log("File loaded, displaying preview...");
                iconImage.src = e.target.result;
                iconImage.alt = 'Preview of uploaded photo';
                uploadLabel.style.display = 'none';
                formatInfo.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    function openModal(modalId) {
        console.log(`Opening modal: ${modalId}`);
        closeModal();
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function closeModal() {
        console.log("Closing all modals...");
        document.querySelectorAll('.modale').forEach(modal => {
            modal.style.display = 'none';
        });
        document.getElementById('overlay').style.display = 'none';
    }
});
