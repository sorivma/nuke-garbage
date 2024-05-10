import Map from 'ol/Map';
import Select from 'ol/interaction/Select';
import View from 'ol/View';
import {getGarbageLayer, getLayers} from "./layers"

import './public/style/style.css'
import 'ol-ext/dist/ol-ext.min.css'
import SearchFeature from "ol-ext/control/SearchFeature";
import {
    getDimension,
    hide_card,
    initialize_card,
    prepare_places,
    prepare_workers,
    setDimension,
    show_card,
    toggle_card
} from "./card";
import {log} from "ol/console";

const map = new Map({
    layers: getLayers(),
    target: 'map',
    view: new View({
        center: [2000, -1000],
        zoom: 0.5,
        maxResolution: 2.0412021106780145,
        minResolution: 0.10125644930531218,
    }),
    controls: []
});

function getTitleString(feature) {
    let searched = feature.get("division") + " " + feature.get("containmt")
    return (searched)
}

function getSearchString(feature) {
    let searched = +feature.get("code") + " " + feature.get("division") + " " + feature.get("containmt")
    return (searched)
}

let search = new SearchFeature({
    maxHistory: -1,
    target: document.getElementById("search-container"),
    className: "search",
    placeholder: 'Поиск',
    source: getGarbageLayer().getSource(),
    maxItems: 5,
    getTitle: getTitleString,
    getSearchString: getSearchString
})


let select = new Select({
    layers: [getGarbageLayer()]
})
map.addInteraction(select)

select.on('select', function (e) {
    if (select.getFeatures().getLength() > 0) {
        setDimension('garbage')
        let selected_feature = select.getFeatures().item(0)
        initialize_card(selected_feature)

        map.getView().animate({center: selected_feature.getGeometry().getFirstCoordinate()})
        const zoom = map.getView().getZoom()
        if (zoom < 3) {
            map.getView().animate({zoom: 3})
        }
        show_card()
        return
    }
    hide_card()
})

search.on('select', function (e) {
    if (getDimension() === 'garbage') {
        search.clearHistory()
        select.getFeatures().clear();
        select.getFeatures().push(e.search);
        initialize_card(select.getFeatures().item(0))
        show_card()
        let p = e.search.getGeometry().getFirstCoordinate();
        map.getView().animate({center: p})
        const zoom = map.getView().getZoom()
        if (zoom < 3) {
            map.getView().animate({zoom: 3})
        }
    } else if (getDimension() === 'places') {
        search.clearHistory()
        initialize_card(e.search.getProperties())
        show_card()
    } else if (getDimension() === 'people') {
        search.clearHistory()
        initialize_card(e.search.getProperties())
        show_card()
    }
});

map.addControl(search)

const searches = document.getElementsByClassName("ol-search");

for (let i = 0; i < searches.length; i++) {
    // Remove the "ol-search" class from each element
    searches[i].classList.remove("ol-search");
}

let toggle_btn = document.getElementById("toggle-card-btn")

toggle_btn.addEventListener('click', () => {
    toggle_card(toggle_btn)
})



let garbage_btn = document.getElementById("dimension-garbage")

function prepare_garbage() {
    search.setSource(getGarbageLayer().getSource())
    search.getTitle = getTitleString
    search.getSearchString = getSearchString
}

garbage_btn.addEventListener('click', () => {
    setDimension('garbage')
    prepare_garbage()
    hide_card()
})

let document_btn = document.getElementById('dimension-documents');
document_btn.addEventListener('click', () => {
    setDimension('documents')
    initialize_card()
    show_card()
})

let places_btn = document.getElementById('dimension-places');

places_btn.addEventListener('click', () => {
    setDimension('places')
    prepare_places(search)
    hide_card()
})

let people_btn = document.getElementById('dimension-people');

people_btn.addEventListener('click', () => {
    setDimension('people')
    prepare_workers(search)
    hide_card()
})

await getLayers().at(0);
log(getLayers().at(0).getFeatures())