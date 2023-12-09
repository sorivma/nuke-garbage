
let iconMap = new Map([
    ["smw", "https://www.svgrepo.com/show/390653/bin-cancel-delete-remove-trash-garbage.svg"],
    ["mw", "https://www.svgrepo.com/show/532515/scrubber.svg"],
    ["mg", "https://www.svgrepo.com/show/321113/metal-bar.svg"],
    ["pol_fltr", "https://www.svgrepo.com/show/419682/car-engine-filter.svg"],
    ["bad_oil", "https://www.svgrepo.com/show/347239/oil.svg"],
    ["gel", "https://www.svgrepo.com/show/214318/gel.svg"],
    ["paper", "https://www.svgrepo.com/show/112645/metal-paper-clip.svg"],
    ["lamp", "https://www.svgrepo.com/show/510861/bulb.svg"],
    ["term", "https://www.svgrepo.com/show/487895/thermometer-low-2.svg"],
    ["gidr", "https://www.svgrepo.com/show/2269/hydraulic-energy.svg"],
    ["lab", "https://www.svgrepo.com/show/419692/bike-car-engine.svg"],
    ["oil", "https://www.svgrepo.com/show/533527/oil-well.svg"],
    ["glass", "https://www.svgrepo.com/show/320585/cracked-glass.svg"],
    ["chem", "https://www.svgrepo.com/show/455735/chemical-container.svg"],
    ["fltr", "https://www.svgrepo.com/show/1679/hexagonal-molecule.svg"],
    ["coke", "https://www.svgrepo.com/show/322061/coal-pile.svg"]
]);

let defaultIcon = "https://www.svgrepo.com/show/533023/trash-xmark-alt.svg"

export function mapToSvg(name) {
    if (iconMap.get(name) == null) {
        return defaultIcon
    }
    return iconMap.get(name)
}


