const {error} = require("ol/console");

async function getFeature(endpoint) {
    return fetch(endpoint)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
}

async function getDocumentsIndex(endpoint) {
    return fetch(endpoint)
        .then(response => response.json())
        .catch(error => console.error('Error'), error)
}

module.exports = {getFeature, getDocumentsIndex}