async function getFeature(endpoint) {
    let buildings;
    return buildings = fetch(endpoint)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
}

module.exports = {getFeature}