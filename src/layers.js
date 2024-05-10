import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import {Fill, Icon, Stroke, Style, Text} from "ol/style";
import {mapToSvg} from "./icons";
import {getFeature} from "./query";

const buildingsGeoJson = {
    "type": "FeatureCollection",
    "name": "build",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": await getFeature("/buildings")
}

const channelGeoJson = {
    "type": "FeatureCollection",
    "name": "channel_layer",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": await getFeature("/channel")
}

const roadGeoJson = {
    "type": "FeatureCollection",
    "name": "road_layer",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": await getFeature("/roads")
}

const garbageGeoJson = {
    "type": "FeatureCollection",
    "name": "garbage",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": await getFeature("/garbage")
}

const geoJson = new GeoJSON();

function buildingsStyleFunction(feature) {
    return new Style({
        fill: new Fill({
            color: "#d1d1d1"
        }),
        stroke: new Stroke({
            color: "#646464"
        }),
        text: new Text({
            text: feature.get("name"),
            font: '15px sans-serif',
            fill: new Fill({
                color: 'black'
            }),
        })
    })
}

const buildings_layer = new VectorLayer({
    source: new VectorSource({
        features: geoJson.readFeatures(buildingsGeoJson)
    }),
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    style : buildingsStyleFunction
});

const channel_layer = new VectorLayer({
    source: new VectorSource({
        features: geoJson.readFeatures(channelGeoJson)
    }),
    style: new Style({
        fill: new Fill({
            color: "rgba(104,213,217,0.66)"
        }),
        stroke: new Stroke({
            color: "rgba(104,213,217,0.66)"
        })
    }),
    updateWhileAnimating: true,
    updateWhileInteracting: true,
});

const road_layer = new VectorLayer({
    source: new VectorSource({
        features: geoJson.readFeatures(roadGeoJson)
    }),
    style: new Style({
        fill: new Fill({
            color: "#edf5f5"
        }),
        stroke: new Stroke({
            color: "#eef6f6"
        }),
    }),
    updateWhileAnimating: true,
    updateWhileInteracting: true,
});


function garbageStyleFunction(feature, resolution) {
    return new Style({
        image: new Icon({
            opacity: 1,
            src: mapToSvg(feature.get("strg_type")),
            scale: 1 / (resolution * 100)
        })
    });
}

const garbage_layer = new VectorLayer({
    source: new VectorSource({
        features: geoJson.readFeatures(garbageGeoJson)
    }),
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    style: garbageStyleFunction
})



export function getLayers() {
    return [buildings_layer, channel_layer, road_layer, garbage_layer]
}

export function getGarbageLayer() {
    return garbage_layer;
}

