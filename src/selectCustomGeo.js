//
//
// import the geojson files -- there are more elegant ways to do this, but this is straightforward method for this technology stack
import asiaGeoJSON from '../data/geo/asia.json'
import asiaHongKongGeoJSON from '../data/geo/asia.hong-kong.json'
import asiaIndonesiaGeoJSON from '../data/geo/asia.indonesia.json'
import asiaMalaysiaGeoJSON from '../data/geo/asia.malaysia.json'
import asiaThailandGeoJSON from '../data/geo/asia.thailand.json'
//
import bahamasGeoJSON from '../data/geo/bahamas.json'
//
import canadaGeoJSON from '../data/geo/canada.json'
import canadaBritishColumbiaGeoJSON from '../data/geo/canada.british-columbia.json'
import canadaNovaScotiaGeoJSON from '../data/geo/canada.nova-scotia.json'
//
import centralSouthAmerGeoJSON from '../data/geo/central-south-america.json'
import centralSouthAmerAntarticaGeoJSON from '../data/geo/central-south-america.antarctica.json'
import centralSouthAmerBelizeGeoJSON from '../data/geo/central-south-america.belize.json'
import centralSouthAmerCostaRicaGeoJSON from '../data/geo/central-south-america.costa-rica.json'
import centralSouthAmerEcuadorGeoJSON from '../data/geo/central-south-america.ecuador.json'
import centralSouthAmerGalapagosGeoJSON from '../data/geo/central-south-america.galapagos.json'
import centralSouthAmerMexicoGeoJSON from '../data/geo/central-south-america.mexico.json'
import centralSouthAmerPanamaGeoJSON from '../data/geo/central-south-america.panama.json'
import centralSouthAmerPatagoniaGeoJSON from '../data/geo/central-south-america.patagonia.json'
//
import eastMedCroatiaGeoJSON from '../data/geo/east-mediterranean.croatia.json'
import eastMedGeoJSON from '../data/geo/east-mediterranean.json'
import eastMedGreeceGeoJSON from '../data/geo/east-mediterranean.greece.json'
import eastMedMontenegroGeoJSON from '../data/geo/east-mediterranean.montenegro.json'
import eastMedTurkeyGeoJSON from '../data/geo/east-mediterranean.turkey.json'
//
import indianOceanGeoJSON from '../data/geo/indian-ocean.json'
import indianOceanIndiaGeoJSON from '../data/geo/indian-ocean.india.json'
import indianOceanMaldivesGeoJSON from '../data/geo/indian-ocean.maldives.json'
import indianOceanSeychellesGeoJSON from '../data/geo/indian-ocean.seychelles.json'
//
import midEastAbuDhabiGeoJSON from '../data/geo/middle-east.abu-dhabi.json'
import midEastDubaiGeoJSON from '../data/geo/middle-east.dubai.json'
import midEastGeoJSON from '../data/geo/middle-east.json'
import midEastRedSeaGeoJSON from '../data/geo/middle-east.red-sea.json'
//
import northernEuropeGeoJSON from '../data/geo/northern-europe.json'
import northernEuropeIcelandGeoJSON from '../data/geo/northern-europe.iceland.json'
import northernEuropeNorwayGeoJSON from '../data/geo/northern-europe.norway.json'
import northernEuropeSwedenGeoJSON from '../data/geo/northern-europe.sweden.json'
import northernEuropeUKNIrelandGeoJSON from '../data/geo/northern-europe.uk-northern-ireland.json'
//
import oceaniaGeoJSON from '../data/geo/oceania.json'
import oceaniaAustraliaGeoJSON from '../data/geo/oceania.australia.json'
import oceaniaFijiGeoJSON from '../data/geo/oceania.fiji.json'
import oceaniaNewCaledoniaGeoJSON from '../data/geo/oceania.new-caledonia.json'
import oceaniaNewZealandGeoJSON from '../data/geo/oceania.new-zealand.json'
import oceaniaPapuaNewGuineaGeoJSON from '../data/geo/oceania.papua-new-guinea.json'
//
import usGeoJSON from '../data/geo/united-states.json'
import usAlaskaGeoJSON from '../data/geo/united-states.alaska.json'
import usFloridaGeoJSON from '../data/geo/united-states.florida.json'
import usNewEnglandGeoJSON from '../data/geo/united-states.new-england.json'
//
import westMedFranceGeoJSON from '../data/geo/west-mediterranean.france.json'
import westMedGeoJSON from '../data/geo/west-mediterranean.json'
import westMedItalyGeoJSON from '../data/geo/west-mediterranean.italy.json'
import westMedMaltaGeoJSON from '../data/geo/west-mediterranean.malta.json'
import westMedSpainGeoJSON from '../data/geo/west-mediterranean.spain.json'

//
// for these examples it is ok to assume we have a single polygon.
// in the shape of [ [ [long, lat], [long, lat], ... ] ]
// which needs to be mapped to
// [ lat, long, lat, long, ... ]
const toLatLongStr = (geoJSON) => {
  const coordinates = []
  for (const coord of geoJSON.features[0].geometry.coordinates[0]) {
    coordinates.push(coord[1], coord[0])
  }
  return JSON.stringify(coordinates)
}

//
// create an array of label / value pairs
const customGeoPolygonsGrouped = () => {
  return [
    [
      { label: 'Asia', value: toLatLongStr(asiaGeoJSON) },
      { label: 'Hong Kong', value: toLatLongStr(asiaHongKongGeoJSON) },
      { label: 'Indonesia', value: toLatLongStr(asiaIndonesiaGeoJSON) },
      { label: 'Malaysia', value: toLatLongStr(asiaMalaysiaGeoJSON) },
      { label: 'Thailand', value: toLatLongStr(asiaThailandGeoJSON) },
    ],
    [
      //
      { label: 'Bahamas', value: toLatLongStr(bahamasGeoJSON) },
    ],
    [
      //
      { label: 'Canada', value: toLatLongStr(canadaGeoJSON) },
      { label: 'British Columbia', value: toLatLongStr(canadaBritishColumbiaGeoJSON) },
      { label: 'Nova Scotia', value: toLatLongStr(canadaNovaScotiaGeoJSON) },
    ],
    [
      //
      { label: 'Central/South America', value: toLatLongStr(centralSouthAmerGeoJSON) },
      { label: 'Antartica', value: toLatLongStr(centralSouthAmerAntarticaGeoJSON) },
      { label: 'Belize', value: toLatLongStr(centralSouthAmerBelizeGeoJSON) },
      { label: 'Costa Rica', value: toLatLongStr(centralSouthAmerCostaRicaGeoJSON) },
      { label: 'Ecuador', value: toLatLongStr(centralSouthAmerEcuadorGeoJSON) },
      { label: 'Galapagos', value: toLatLongStr(centralSouthAmerGalapagosGeoJSON) },
      { label: 'Mexico', value: toLatLongStr(centralSouthAmerMexicoGeoJSON) },
      { label: 'Panama', value: toLatLongStr(centralSouthAmerPanamaGeoJSON) },
      { label: 'Patagonia', value: toLatLongStr(centralSouthAmerPatagoniaGeoJSON) },
    ],
    [
      //
      { label: 'East Mediterranean', value: toLatLongStr(eastMedGeoJSON) },
      { label: 'Croatia', value: toLatLongStr(eastMedCroatiaGeoJSON) },
      { label: 'Greece', value: toLatLongStr(eastMedGreeceGeoJSON) },
      { label: 'Montenegro', value: toLatLongStr(eastMedMontenegroGeoJSON) },
      { label: 'Turkey', value: toLatLongStr(eastMedTurkeyGeoJSON) },
    ],
    [
      //
      { label: 'Indian Ocean', value: toLatLongStr(indianOceanGeoJSON) },
      { label: 'India', value: toLatLongStr(indianOceanIndiaGeoJSON) },
      { label: 'Maldives', value: toLatLongStr(indianOceanMaldivesGeoJSON) },
      { label: 'Seychelles', value: toLatLongStr(indianOceanSeychellesGeoJSON) },
    ],
    [
      //
      { label: 'Middle East', value: toLatLongStr(midEastGeoJSON) },
      { label: 'Abu Dhabi', value: toLatLongStr(midEastAbuDhabiGeoJSON) },
      { label: 'Dubai', value: toLatLongStr(midEastDubaiGeoJSON) },
      { label: 'Red Sea', value: toLatLongStr(midEastRedSeaGeoJSON) },
    ],
    [
      //
      { label: 'Northern Europe', value: toLatLongStr(northernEuropeGeoJSON) },
      { label: 'Iceland', value: toLatLongStr(northernEuropeIcelandGeoJSON) },
      { label: 'Norway', value: toLatLongStr(northernEuropeNorwayGeoJSON) },
      { label: 'Sweden', value: toLatLongStr(northernEuropeSwedenGeoJSON) },
      { label: 'UK and N. Ireland', value: toLatLongStr(northernEuropeUKNIrelandGeoJSON) },
    ],
    [
      //
      { label: 'Oceania', value: toLatLongStr(oceaniaGeoJSON) },
      { label: 'Australia', value: toLatLongStr(oceaniaAustraliaGeoJSON) },
      { label: 'Fiji', value: toLatLongStr(oceaniaFijiGeoJSON) },
      { label: 'New Caledonia', value: toLatLongStr(oceaniaNewCaledoniaGeoJSON) },
      { label: 'New Zealand', value: toLatLongStr(oceaniaNewZealandGeoJSON) },
      { label: 'Papua New Guinea', value: toLatLongStr(oceaniaPapuaNewGuineaGeoJSON) },
    ],
    [
      //
      { label: 'United States', value: toLatLongStr(usGeoJSON) },
      { label: 'Alaska', value: toLatLongStr(usAlaskaGeoJSON) },
      { label: 'Florida', value: toLatLongStr(usFloridaGeoJSON) },
      { label: 'New England', value: toLatLongStr(usNewEnglandGeoJSON) },
    ],
    [
      //
      { label: 'West Mediterranean', value: toLatLongStr(westMedGeoJSON) },
      { label: 'France', value: toLatLongStr(westMedFranceGeoJSON) },
      { label: 'Italy', value: toLatLongStr(westMedItalyGeoJSON) },
      { label: 'Malta', value: toLatLongStr(westMedMaltaGeoJSON) },
      { label: 'Spain', value: toLatLongStr(westMedSpainGeoJSON) },
    ],
  ]
}

//
// This is the Algolia widget which modifies the query to include the polygon.
export const customGeoSelect = (renderOptions, isFirstRender) => {
  const { refine, widgetParams } = renderOptions
  if (!isFirstRender) {
    // nothing to do.
    return
  }

  // grab the select element
  const el = document.querySelector(widgetParams.el)

  // create the <option> elements
  customGeoPolygonsGrouped().forEach((option) => {
    // create an optgroup if there are 2 or more.
    if (Array.isArray(option) && option.length > 1) {
      const optgroup = document.createElement('optgroup')
      optgroup.label = option[0].label

      option.forEach((item) => {
        const opt = document.createElement('option')
        opt.value = item.value
        opt.innerHTML = item.label
        optgroup.appendChild(opt)
      })
      el.appendChild(optgroup)
    }
    // just a single item.
    else {
      const opt = document.createElement('option')
      opt.value = option[0].value
      opt.innerHTML = option[0].label
      el.appendChild(opt)
    }
  })

  // when the select changes ...
  el.addEventListener('change', (event) => {
    const value = event.target.value
    if (value && value !== '') {
      // refine with the select value!
      refine({ insidePolygon: [JSON.parse(value)] })
    } else {
      // if there is no value or it is empty, clear the refine.
      refine({})
    }
  })
}
