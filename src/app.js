import Map from 'ol/Map';
import Select from 'ol/interaction/Select';
import View from 'ol/View';
import {getGarbageLayer, getLayers} from "./layers"

import './public/style/style.css'
import 'ol-ext/dist/ol-ext.min.css'
import SearchFeature from "ol-ext/control/SearchFeature";
import {hide_card, initialize_card, show_card} from "./card";
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
    placeholder: 'Поиск',
    source: getGarbageLayer().getSource(),
    maxItems: 20,
    getTitle: getTitleString,
    getSearchString: getSearchString
})

let select = new Select({
    layers: [getGarbageLayer()]
})
map.addInteraction(select)



select.on('select', function (e) {
    if (select.getFeatures().getLength() > 0) {
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
});

map.addControl(search)
await getLayers().at(0);
log(getLayers().at(0).getFeatures())