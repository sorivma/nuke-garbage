let card = document.getElementById("card")

export function hide_card() {
    card.classList.add("card-hidden")
}

export function show_card() {
    card.classList.remove("card-hidden")
}

function get_data_tags(feature) {
    return {
        garbage_name: feature.get("containmt"),
        hazard_lvl: feature.get("hzzrd_lvl"),
        division: feature.get("division"),
        code: feature.get("code")
    }
}

export function initialize_card(feature) {

    let data_tags = get_data_tags(feature)

    for (let key in data_tags) {
        let paragraph = document.getElementById(key);
        if (paragraph) {
            paragraph.textContent = data_tags[key]
        }
    }
}

