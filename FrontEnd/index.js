// URL de base de l'API pour effectuer les requêtes HTTP.
const API_BASE_URL = 'http://localhost:5678/api';

// Fonction pour récupérer les catégories à partir de l'API.
function fetchCategories() {
    // Envoi d'une requête HTTP GET à l'API pour obtenir les catégories.
    return fetch(`${API_BASE_URL}/categories`).then(handleResponse);
}

// Fonction pour récupérer les œuvres à partir de l'API
function fetchWorks() {
    // Envoi d'une requête HTTP GET à l'API pour obtenir les œuvres.
    return fetch(`${API_BASE_URL}/works`).then(handleResponse);
}

// Fonction pour supprimer une œuvre par son id
function deleteWork(id, token) {
    // Envoi d'une requête HTTP DELETE à l'API pour supprimer une œuvre spécifique.
    // Inclut l'en-tête Authorization pour les besoins d'authentification.
    return fetch(`${API_BASE_URL}/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }).then(handleResponse);
}

// Fonction pour uploader une nouvelle œuvre.
function uploadWork(data, token) {
    return fetch(`${API_BASE_URL}/works`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: data
    }).then(handleResponse);
}

// Fonction pour gérer la réponse HTTP retournée par les requêtes fetch.
function handleResponse(response) {
    // Vérification du statut de la réponse. Si la réponse n'est pas OK, une erreur est générée.
    if (!response.ok) {
        throw new Error('HTTP status ' + response.status + ': ' + response.statusText);
    }
    return response.json();
}

export { fetchCategories, fetchWorks, deleteWork, uploadWork };
