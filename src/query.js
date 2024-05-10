const {error} = require("ol/console");

async function getFeature(endpoint) {
    let buildings;
    return buildings = fetch(endpoint)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
}

async function getDocumentsIndex(endpoint) {
    let documents;
    return documents = fetch(endpoint)
        .then(response => response.json())
        .catch(error => console.error('Error') , error)
}

module.exports = {getFeature, getDocumentsIndex}