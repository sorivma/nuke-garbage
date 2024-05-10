import {getDocumentsIndex, getFeature} from './query'
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

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
    card.innerHTML += `<h3>${feature['name']}</h3>`
    feature['places'].forEach((place) => {
        card.innerHTML += `<div class="card-list-item">
            <p>${place['place']}</p>
            <p>${place['responsible']}</p>
        </div>`
    })

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
                            "id": 50000,
                            "name": "Всплывшие нефтепродукты",
                            "places": [
                                {
                                    place: "Площадка №3 УПТК здание 7",
                                    responsible: "Мастер Звягинцев Игорь Петрович, тел. 6-98-53"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50010,
                            "name": "Отходы минеральных масел моторных.",
                            "places": [
                                {
                                    "place": "Склад нефтепродуктов",
                                    "responsible": "Петров Владимир Сергеевич, тел. 8-800-555-33-33"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50001,
                            "name": "Лом и отходы стальные несортированные",
                            "places": [
                                {
                                    "place": "Склад металлолома",
                                    "responsible": "Сидоров Алексей Владимирович, тел. 8-800-555-25-25"
                                },
                                {
                                    "place": "Заводская территория",
                                    "responsible": "Петров Василий Иванович, тел. 8-800-555-15-15"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50002,
                            "name": "Отходы минеральных масел турбинных.",
                            "places": [
                                {
                                    "place": "Цех №5",
                                    "responsible": "Николаев Андрей Александрович, тел. 8-800-555-45-45"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50003,
                            "name": "Отходы картона и бумаги от канцелярской деятельности и делопроизводства, отходы пленки полипропилена и изделий из нее, незагрязненные",
                            "places": [
                                {
                                    "place": "Склад отходов",
                                    "responsible": "Кузнецова Ольга Владимировна, тел. 8-800-555-55-55"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50004,
                            "name": "Отходы синтетических гидравлических жидкостей",
                            "places": [
                                {
                                    "place": "Цех №7",
                                    "responsible": "Смирнов Дмитрий Игоревич, тел. 8-800-555-75-75"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50005,
                            "name": "Отходы хлороформа при технических испытаниях и измерениях",
                            "places": [
                                {
                                    "place": "Лаборатория №3",
                                    "responsible": "Федоров Александр Васильевич, тел. 8-800-555-65-65"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50006,
                            "name": "Всплывшие нефтепродукты из нефтеловушек и аналогичных сооружений",
                            "places": [
                                {
                                    "place": "Нефтеловушка №5",
                                    "responsible": "Попов Сергей Михайлович, тел. 8-800-555-85-85"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50007,
                            "name": "Детали приборов лабораторных, содержащие ртуть, утратившие потребительские свойства",
                            "places": [
                                {
                                    "place": "Лаборатория №7",
                                    "responsible": "Игнатьева Екатерина Павловна, тел. 8-800-555-95-95"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50008,
                            "name": "Фильтры очистки масла, фильтры с загрузкой из полимерных матриалов, загрязненные нефтепродуктами.",
                            "places": [
                                {
                                    "place": "Цех по обработке масла",
                                    "responsible": "Гусев Владимир Николаевич, тел. 8-800-555-99-99"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50009,
                            "name": "Мусор от офисных и бытовых помещений организаций несортированный (исключая крупногабаритный)",
                            "places": [
                                {
                                    "place": "Офисное здание",
                                    "responsible": "Сергеева Анна Владимировна, тел. 8-800-555-88-88"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 50010,
                            "name": "Отходы минеральных масел моторных.",
                            "places": [
                                {
                                    "place": "Склад нефтепродуктов",
                                    "responsible": "Петров Владимир Сергеевич, тел. 8-800-555-33-33"
                                }
                            ]
                        }
                    }
                ]
            }
        )
    }))

    function getString(feature) {
        return feature.get('name')
    }

    search.getTitle = getString
    search.getSearchString = getString
}


function initialize_garbage(feature) {
    card.innerHTML = ''
    card.innerHTML = '    <h2>Наименование</h2>\n' +
        '    <p id="garbage_name"></p>\n' +
        '    <h2>Класс опасности</h2>\n' +
        '    <p id="hazard_lvl"></p>\n' +
        '    <h2>Ответственное подразделение</h2>\n' +
        '    <p id="division"></p>\n' +
        '    <h2>Код</h2>\n' +
        '    <p id="code"></p>'

    let data_tags = get_data_tags(feature)

    for (let key in data_tags) {
        let paragraph = document.getElementById(key);
        if (paragraph) {
            paragraph.textContent = data_tags[key]
        }
    }
    is_initialized = true;
}

let svgDocTypeMap = {
    'word': '<svg width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="a" x1="4.494" y1="-1712.086" x2="13.832" y2="-1695.914" gradientTransform="translate(0 1720)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2368c4"/><stop offset="0.5" stop-color="#1a5dbe"/><stop offset="1" stop-color="#1146ac"/></linearGradient></defs><title>file_type_word</title><path d="M28.806,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5l11.069,3.25L30,9.5V4.191A1.192,1.192,0,0,0,28.806,3Z" style="fill:#41a5ee"/><path d="M30,9.5H8.512V16l11.069,1.95L30,16Z" style="fill:#2b7cd3"/><path d="M8.512,16v6.5L18.93,23.8,30,22.5V16Z" style="fill:#185abd"/><path d="M9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5H8.512v5.309A1.192,1.192,0,0,0,9.705,29Z" style="fill:#103f91"/><path d="M16.434,8.2H8.512V24.45h7.922a1.2,1.2,0,0,0,1.194-1.191V9.391A1.2,1.2,0,0,0,16.434,8.2Z" style="opacity:0.10000000149011612;isolation:isolate"/><path d="M15.783,8.85H8.512V25.1h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M15.783,8.85H8.512V23.8h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M15.132,8.85H8.512V23.8h6.62a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.132,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"/><path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" style="fill:url(#a)"/><path d="M6.9,17.988c.023.184.039.344.046.481h.028c.01-.13.032-.287.065-.47s.062-.338.089-.465l1.255-5.407h1.624l1.3,5.326a7.761,7.761,0,0,1,.162,1h.022a7.6,7.6,0,0,1,.135-.975l1.039-5.358h1.477l-1.824,7.748H10.591L9.354,14.742q-.054-.222-.122-.578t-.084-.52H9.127q-.021.189-.084.561c-.042.249-.075.432-.1.552L7.78,19.871H6.024L4.19,12.127h1.5l1.131,5.418A4.469,4.469,0,0,1,6.9,17.988Z" style="fill:#fff"/></svg>'
}

function getSvgForDocType(documentType) {
    return svgDocTypeMap[documentType]
}

async function initialize_documents() {
    card.innerHTML = ''
    let documents = await getDocumentsIndex("/static/index")
    let header = document.createElement("h2")
    header.textContent = "Шаблоны документов"
    card.appendChild(header)

    documents['index'].forEach((docData) => {
        let documentElement = document.createElement('a');
        documentElement.classList.add('document-flex-container');

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
                btn.style.backgroundColor = 'white'
            }
        }
    })
}

export function getDimension() {
    return inner_dimension;
}
