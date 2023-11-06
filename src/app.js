import Map from 'ol/Map';
import Select from 'ol/interaction/Select';
import View from 'ol/View';
import {Fill, Stroke, Style} from 'ol/style';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';
import {getLayers} from "./layers"

import './style.css'


const map = new Map({
    layers: getLayers(),
    target: 'map',
    view: new View({
        center: [1471.537389, -1155.5016903],
        zoom: 15,
    }),
});

let select = null; // ref to currently selected interaction

const selected = new Style({
    fill: new Fill({
        color: '#382e2e',
    }),
    stroke: new Stroke({
        color: '#e57d7d',
        width: 2,
    }),
});

function selectStyle(feature) {
    const color = feature.get('COLOR') || '#ffffff';
    selected.getFill().setColor(color);
    return selected;
}

// select interaction working on "singleclick"
const selectSingleClick = new Select({style: selectStyle});

// select interaction working on "click"
const selectClick = new Select({
    condition: click,
    style: selectStyle,
});

// select interaction working on "pointermove"
const selectPointerMove = new Select({
    condition: pointerMove,
    style: selectStyle,
});

const selectAltClick = new Select({
    style: selectStyle,
    condition: function (mapBrowserEvent) {
        return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
    },
});

const selectElement = document.getElementById('type');

const changeInteraction = function () {
    if (select !== null) {
        map.removeInteraction(select);
    }
    const value = selectElement.value;
    if (value === 'singleclick') {
        select = selectSingleClick;
    } else if (value === 'click') {
        select = selectClick;
    } else if (value === 'pointermove') {
        select = selectPointerMove;
    } else if (value === 'altclick') {
        select = selectAltClick;
    } else {
        select = null;
    }
    if (select !== null) {
        map.addInteraction(select);
        select.on('select', function (e) {
            document.getElementById('status').innerHTML =
                '&nbsp;' +
                e.target.getFeatures().getLength() +
                ' selected features (last operation selected ' +
                e.selected.length +
                ' and deselected ' +
                e.deselected.length +
                ' features)';
            console.log(e.selected.length)
        });
    }
};

/**
 * onchange callback on the select element.
 */
selectElement.onchange = changeInteraction;
changeInteraction();
