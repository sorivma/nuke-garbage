import {getDocumentsIndex, getFeature} from './query'
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import {Feature} from "ol";
import {getPlacesLayer} from "./layers";
import {mapToSvg} from "./icons";

let card = document.getElementById("card")
let toggle_btn = document.getElementById("toggle-card-btn")


let is_hidden = true;
let is_initialized = false;

let inner_dimension = 'garbage'

export function hide_card() {
    card.classList.add("card-hidden")
    toggle_btn.innerHTML = ''
    toggle_btn.innerHTML = '    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '        <path d="M4 4V20M8 12H20M20 12L16 8M20 12L16 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '    </svg>'
    is_hidden = true;
}

export function show_card() {
    card.classList.remove("card-hidden")
    is_hidden = false
    toggle_btn.innerHTML = ''
    toggle_btn.innerHTML = "    <svg width=\"25px\" height=\"25px\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "        <path d=\"M4 4V20M8 12H20M8 12L12 8M8 12L12 16\" stroke=\"#000000\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
        "    </svg>"
    is_hidden = false;
}

export function toggle_card() {
    if (is_initialized) {
        if (is_hidden) {
            show_card()
        } else {
            hide_card()
        }
    }
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
    if (inner_dimension === 'garbage') {
        initialize_garbage(feature)
    } else if (inner_dimension === 'documents') {
        initialize_documents()
    } else if (inner_dimension === 'places') {
        initialize_places(feature)
    } else if (inner_dimension === 'people') {
        initialize_people(feature)
    }
}

function initialize_people(feature) {
    card.innerHTML = ''
    card.innerHTML += `<h2>Ответственные лица - ${feature['department']}</h2>`
    feature['people'].forEach((employee) => {
        card.innerHTML += `<div class="card-list-item">
            <h3>${employee['position']}</h3>
            <p>${employee['fullName']}</p>
            <p>${employee['phoneNumber']}</p>
        </div>`
    })
}


function initialize_places(feature) {
    card.innerHTML = '<h2>Места формирования ТП</h2>'
    card.innerHTML += `<div class="card-list-item"><h2>${feature.get('garb_name')}</h2></div>`
    card.innerHTML += `<div class="card-list-item">
    <h2>
    Адрес
    </h2>
    <p>
    ${feature.get('place_name')}
    </p>
    </div>`
    card.innerHTML += `<div class="card-list-item">
    
    <h2>
    Ответсвенный
    </h2>
    <h4>
    ${feature.get('resp_pos')}
    </h4>
    <p>
    ${feature.get('resp_name')}
    </p>
    </div>`

    is_initialized = true
}

export function prepare_workers(search) {
    let geoJson = new GeoJSON()
    search.setSource(new VectorSource({
        features: geoJson.readFeatures(
            {
                "type": "FeatureCollection",
                "name": "build",
                "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
                "features": [
                    {
                        "type": "Feature",
                        "properties": {
                            "department": 'ЦОС',
                            "people": [
                                {
                                    'position': 'Ведущий инженер',
                                    'fullName': 'Петров Игорь Викторович',
                                    'phoneNumber': '6-71-24'
                                },
                                {
                                    'position': 'Мастер',
                                    'fullName': 'Купликов Иван Семенович',
                                    'phoneNumber': '6-73-65'
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "department": 'ОМ',
                            "people": [
                                {
                                    'position': 'Специалист',
                                    'fullName': 'Переверзева Ирина Фёдоровна',
                                    'phoneNumber': '6-73-69'
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "department": 'ЦТАИ',
                            "people": [
                                {
                                    'position': 'Инженер',
                                    'fullName': 'Николаева Елена Алексеевна',
                                    'phoneNumber': '6-73-59'
                                },
                                {
                                    'position': 'Специалист',
                                    'fullName': 'Бегляров Константин Викторович',
                                    'phoneNumber': '6-73-45'
                                },
                                {
                                    'position': 'Мастер',
                                    'fullName': 'Маркеленков Александр Фёдороич',
                                    'phoneNumber': '6-73-56'
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "department": 'ЭЦ',
                            "people": [
                                {
                                    'position': 'Специалист',
                                    'fullName': 'Игнатьев Виталий Маратович',
                                    'phoneNumber': '6-23-43'
                                },
                            ]
                        }
                    },
                ]
            }
        )
    }))

    function getString(feature) {
        return feature.get('department')
    }

    search.getTitle = getString
    search.getSearchString = getString
}

export function prepare_places(search) {
    function getString(feature) {
        return feature.get('garb_name')
    }

    search.setSource(getPlacesLayer().getSource())

    search.getTitle = getString
    search.getSearchString = getString
}

let hzzrdColorMap = {
    '1': 'red',
    '2': '#ad9a53',
    '3': '#ad9a53',
    '4': 'green',
    '5': 'green'
}

function getColor(hzzrd_lvl) {
    return hzzrdColorMap[hzzrd_lvl] ? hzzrdColorMap[hzzrd_lvl] : 'black'
}

let romanMap = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V'
}

function getRoman(hzzrd_lvl) {
    return romanMap[hzzrd_lvl] ? romanMap[hzzrd_lvl] : 'V'
}


function initialize_garbage(feature) {
    console.log()
    card.innerHTML = ''
    card.innerHTML += `
     <h2>Места временного накопления отходов</h2>
    <div class="card-list-item document-flex-container">
        <img src="${mapToSvg(feature.get('strg_type'))}" height="40px" width="40px">
        <h3>${feature.get('containmt')}</h3>
    </div>
    <div class="card-list-item">
        <h2>Код</h2>
        <p style="font-size: 20px">${feature.get('code')}</p>
    </div>
    <div class="card-list-item">
        <h2>Подразделение</h2>
        <p style="font-size: 20px">${feature.get('division')}</p>
    </div>
    <div class="card-list-item">
        <h2>Уровень опасности</h2>
        <p style="font-weight: bold; font-size: 20px; color: ${getColor(feature.get('hzzrd_lvl'))}">${getRoman(feature.get('hzzrd_lvl'))}</p>
    </div>
    `


    is_initialized = true;
}

let svgDocTypeMap = {
    'word': '<svg width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="word" x1="4.494" y1="-1712.086" x2="13.832" y2="-1695.914" gradientTransform="translate(0 1720)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2368c4"/><stop offset="0.5" stop-color="#1a5dbe"/><stop offset="1" stop-color="#1146ac"/></linearGradient></defs><title>file_type_word</title><path d="M28.806,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5l11.069,3.25L30,9.5V4.191A1.192,1.192,0,0,0,28.806,3Z" style="fill:#41a5ee"/><path d="M30,9.5H8.512V16l11.069,1.95L30,16Z" style="fill:#2b7cd3"/><path d="M8.512,16v6.5L18.93,23.8,30,22.5V16Z" style="fill:#185abd"/><path d="M9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5H8.512v5.309A1.192,1.192,0,0,0,9.705,29Z" style="fill:#103f91"/><path d="M16.434,8.2H8.512V24.45h7.922a1.2,1.2,0,0,0,1.194-1.191V9.391A1.2,1.2,0,0,0,16.434,8.2Z" style="opacity:0.10000000149011612;isolation:isolate"/><path d="M15.783,8.85H8.512V25.1h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M15.783,8.85H8.512V23.8h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M15.132,8.85H8.512V23.8h6.62a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.132,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" style="fill:url(#word)"/><path d="M6.9,17.988c.023.184.039.344.046.481h.028c.01-.13.032-.287.065-.47s.062-.338.089-.465l1.255-5.407h1.624l1.3,5.326a7.761,7.761,0,0,1,.162,1h.022a7.6,7.6,0,0,1,.135-.975l1.039-5.358h1.477l-1.824,7.748H10.591L9.354,14.742q-.054-.222-.122-.578t-.084-.52H9.127q-.021.189-.084.561c-.042.249-.075.432-.1.552L7.78,19.871H6.024L4.19,12.127h1.5l1.131,5.418A4.469,4.469,0,0,1,6.9,17.988Z" style="fill:#fff"/></svg>',
    'powerpoint': '<svg width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="powerpoint" x1="4.494" y1="-1748.086" x2="13.832" y2="-1731.914" gradientTransform="translate(0 1756)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ca4c28"/><stop offset="0.5" stop-color="#c5401e"/><stop offset="1" stop-color="#b62f14"/></linearGradient></defs><title>file_type_powerpoint</title><path d="M18.93,17.3,16.977,3h-.146A12.9,12.9,0,0,0,3.953,15.854V16Z" style="fill:#ed6c47"/><path d="M17.123,3h-.146V16l6.511,2.6L30,16v-.146A12.9,12.9,0,0,0,17.123,3Z" style="fill:#ff8f6b"/><path d="M30,16v.143A12.905,12.905,0,0,1,17.12,29h-.287A12.907,12.907,0,0,1,3.953,16.143V16Z" style="fill:#d35230"/><path d="M17.628,9.389V23.26a1.2,1.2,0,0,1-.742,1.1,1.16,1.16,0,0,1-.45.091H7.027c-.182-.208-.358-.429-.521-.65a12.735,12.735,0,0,1-2.553-7.657v-.286A12.705,12.705,0,0,1,6.05,8.85c.143-.221.293-.442.456-.65h9.93A1.2,1.2,0,0,1,17.628,9.389Z" style="opacity:0.10000000149011612;isolation:isolate"/><path d="M16.977,10.04V23.911a1.15,1.15,0,0,1-.091.448,1.2,1.2,0,0,1-1.1.741H7.62q-.309-.314-.593-.65c-.182-.208-.358-.429-.521-.65a12.735,12.735,0,0,1-2.553-7.657v-.286A12.705,12.705,0,0,1,6.05,8.85h9.735A1.2,1.2,0,0,1,16.977,10.04Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M16.977,10.04V22.611A1.2,1.2,0,0,1,15.785,23.8H6.506a12.735,12.735,0,0,1-2.553-7.657v-.286A12.705,12.705,0,0,1,6.05,8.85h9.735A1.2,1.2,0,0,1,16.977,10.04Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M16.326,10.04V22.611A1.2,1.2,0,0,1,15.134,23.8H6.506a12.735,12.735,0,0,1-2.553-7.657v-.286A12.705,12.705,0,0,1,6.05,8.85h9.084A1.2,1.2,0,0,1,16.326,10.04Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" style="fill:url(#powerpoint)"/><path d="M9.293,12.028a3.287,3.287,0,0,1,2.174.636,2.27,2.27,0,0,1,.756,1.841,2.555,2.555,0,0,1-.373,1.376,2.49,2.49,0,0,1-1.059.935A3.607,3.607,0,0,1,9.2,17.15H7.687v2.8H6.141V12.028ZM7.686,15.94H9.017a1.735,1.735,0,0,0,1.177-.351,1.3,1.3,0,0,0,.4-1.025q0-1.309-1.525-1.31H7.686V15.94Z" style="fill:#fff"/></svg>',
    'excel': '<svg width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="excel" x1="4.494" y1="-2092.086" x2="13.832" y2="-2075.914" gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"/><stop offset="0.5" stop-color="#117e43"/><stop offset="1" stop-color="#0b6631"/></linearGradient></defs><title>file_type_excel</title><path d="M19.581,15.35,8.512,13.4V27.809A1.192,1.192,0,0,0,9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5Z" style="fill:#185c37"/><path d="M19.581,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5L19.581,16l5.861,1.95L30,16V9.5Z" style="fill:#21a366"/><path d="M8.512,9.5H19.581V16H8.512Z" style="fill:#107c41"/><path d="M16.434,8.2H8.512V24.45h7.922a1.2,1.2,0,0,0,1.194-1.191V9.391A1.2,1.2,0,0,0,16.434,8.2Z" style="opacity:0.10000000149011612;isolation:isolate"/><path d="M15.783,8.85H8.512V25.1h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M15.783,8.85H8.512V23.8h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M15.132,8.85H8.512V23.8h6.62a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.132,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" style="fill:url(#excel)"/><path d="M5.7,19.873l2.511-3.884-2.3-3.862H7.758L9.013,14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359,3.84,2.419,3.905H10.821l-1.45-2.711A2.355,2.355,0,0,1,9.2,16.8H9.176a1.688,1.688,0,0,1-.168.351L7.515,19.873Z" style="fill:#fff"/><path d="M28.806,3H19.581V9.5H30V4.191A1.192,1.192,0,0,0,28.806,3Z" style="fill:#33c481"/><path d="M19.581,16H30v6.5H19.581Z" style="fill:#107c41"/></svg>'
}

function getSvgForDocType(documentType) {
    return svgDocTypeMap[documentType] ? svgDocTypeMap[documentType] : svgDocTypeMap['excel']
}

async function initialize_documents() {
    card.innerHTML = ''
    let documents = await getDocumentsIndex("/static/index")
    let header = document.createElement("h2")
    header.textContent = "Шаблоны документов"
    card.appendChild(header)

    documents['index'].forEach((docData) => {
        let documentElement = document.createElement('a');
        documentElement.classList.add('document-flex-container', 'card-list-item', 'hover-effect');

        documentElement.href = `/files/${docData['name']}`

        let parser = new DOMParser();
        let svgElement = parser.parseFromString(getSvgForDocType(docData['type']), "image/svg+xml").documentElement;
        documentElement.appendChild(svgElement);

        let h4Element = document.createElement('h4');
        h4Element.textContent = docData['code'];

        documentElement.appendChild(svgElement)
        documentElement.appendChild(h4Element)

        documentElement.addEventListener('click', function () {

        });

        card.appendChild(documentElement)
    })


    is_initialized = true
}

export function setDimension(new_dimension) {
    inner_dimension = new_dimension

    let inputElement = document.querySelector('.search input');

    inputElement.disabled = new_dimension === 'documents';

    let dimensionBtnMap = {
        'garbage': 'dimension-garbage',
        'documents': 'dimension-documents',
        'places': 'dimension-places',
        'people': 'dimension-people'
    }

    let dimensions = [
        'garbage',
        'documents',
        'places',
        'people'
    ]

    dimensions.forEach((dimension) => {
        console.log(dimension)
        let btn = document.getElementById(dimensionBtnMap[dimension])
        if (btn) {
            if (new_dimension === dimension) {
                btn.style.backgroundColor = '#e8e8e8'
            } else {
                btn.style = ['dimension-btn', 'hover-effect']
            }
        }
    })
}

export function getDimension() {
    return inner_dimension;
}
