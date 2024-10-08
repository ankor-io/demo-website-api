import fs from 'fs'
import { DateTime } from 'luxon'

// nunununununununununununununununununununununununununununununununununununununununu
// *
// * This file is here to conceptually perform the following operation.
// *
// * 1. Given a response from the Ankor Website API
// * 2. Take the fields we are interested in searching on
// * 3. Convert them to what the search record should look like.
// *
// * In this example, we will take the sample file, run it through this process,
// *   and upload the result directly to our search provider. In reality, you
// *   will want to run this as the data is received from the API;
// *   one record at a time.
// *
// *
// * The example search index we are creating is only concerned with the following:
// *   1. The ability to search by the yacht name (free text)
// *   2. The ability to search by the yacht description (free text)
// *   3. The ability to facet by:
// *     a. the general location of the yacht
// *     b. the price of the yacht
// *     c. how many the yacht sleeps
// *     d. how many cabins the yacht has
// *     e. how many bathrooms the yacht has
// *   4. Filter based on the effecitve dates (when/where the yacht is available)
// *
// *  Further fields for faceting and filtering can be added as needed.
// *
// nunununununununununununununununununununununununununununununununununununununununu

/**
 * For a provided yacht, map it to the expected search record.
 *
 * @param {*} yacht
 * @returns an array of search records
 */
const toSearchRecords = (yacht) => {
  // The most common question is understanding the dates and the locations.
  //
  // * Every yacht will have an array of dates and locations where it is available.
  // *   For example: A yacht named 'Muchacho'
  // *     - is available in the British Virgin Islands and Bermuda, from September to March
  // *     - is available in Italy, from April to August
  //
  // Because of this yacht availability, we will emit a search record for each
  // date/location pair. If your business requirements are not this strict, then you
  // can emit a single record by rolling up the location information.
  //
  // The multiple records pattern follows this Algolia guide of variants:
  //   https://www.algolia.com/doc/guides/managing-results/refine-results/grouping/how-to/item-variations/
  //   https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/how-to/ecommerce-records/
  //

  let searchRecords = []

  //
  // To map a yacht object for all cases, need to iterate over:
  //  the pricing information
  //  within the pricing information, the inclusion zones (locations)
  //  within the pricing information, the effective dates.
  //
  // For example (continuing with the Muchacho yacht from above):
  //  - Muchacho; emits 3 records:
  //    - British Virgin Islands, September to March
  //    - Bermuda, September to March
  //    - Italy, April to August
  //

  // Start by iterating over the pricing information for the yacht.
  for (const pricingInfo of yacht.pricing.pricingInfo) {
    // for these purposes, `pricingInfo` is shaped:
    //  {
    //    effectiveDates: [ { from: '2024-01-01T00:00:00Z', to: '2024-12-31T23:59:59Z' } ],
    //    pricing: {
    //      total: 2609335,
    //      currency: 'USD',
    //      unit: 'WEEK',
    //      inclusionZones: [ { "category": [ "North America", "Caribbean", "British Virgin Islands" ] } ]
    //    }
    //  }

    //
    for (const when of pricingInfo.effectiveDates) {
      for (const zone of pricingInfo.pricing.inclusionZones) {
        //
        // "emit" a search record in the Algolia expected shape
        const record = {
          // flatten the structure returned from the Ankor API
          uri: yacht.uri,
          name: yacht.blueprint.name,
          length_m: yacht.blueprint.length,
          yachtType: yacht.yachtType,

          // map the inclusion zone to multiple fields
          geoAreas: zone.category,
          geoContinent: zone.category[0],
          geoRegion: zone.category[1],
          geoName: zone.category[2],
          geoHierarchy: {
            lvl0: `${zone.category[0]}`,
            lvl1: `${zone.category[0]} > ${zone.category[1]}`,
            lvl2: `${zone.category[0]} > ${zone.category[1]} > ${zone.category[2]}`,
          },

          // map the pricing information from the 'pricingInfo'
          // the price in the API record is in 0.01 units of the currency, $1.23 = 123
          priceCurrency: pricingInfo.pricing.currency,
          priceTotal: pricingInfo.pricing.total / 100,

          // derive a 'charter type' from the unit
          //  WEEK = TERM
          //  HOUR = DAY
          charterType: pricingInfo.pricing.unit === 'WEEK' ? 'TERM' : 'DAY',
          //
          // sleeps/cabins and static/cruising capacity are sometimes mutually exclusive.
          //  - sleeps/cabins are used for TERM (WEEK pricing) charters
          //  - static/cruising capacity are used for DAY (HOUR pricing) charters
          // sleeps: yacht.blueprint.sleeps,
          // cabins: yacht.blueprint.cabins,
          // staticCapacity: yacht.blueprint.staticCapacity,
          // cruisingCapacity: yacht.blueprint.cruisingCapacity,
          ...(pricingInfo.pricing.unit === 'WEEK' && {
            sleeps: yacht.blueprint.sleeps,
          }),
          ...(pricingInfo.pricing.unit === 'HOUR' && {
            cruisingCapacity: yacht.blueprint.cruisingCapacity,
          }),

          // map the effective dates; these are in ISO8601 format.
          //  to easily filter on these, we will convert them to epoch seconds.
          effectiveDateFrom: DateTime.fromISO(when.from).toSeconds(),
          effectiveDateTo: DateTime.fromISO(when.to).toSeconds(),

          // since this is an example, we will mock out the 'backend' by using
          // a field in the hit to store what a backend request for more information
          // would return... in this case, the 'backend' is the yacht!
          mockBackend: yacht,
        }

        // add the record to the list of records to return
        searchRecords.push(record)
      }
    }
  }

  return searchRecords
}

//
// main entry point here.
// 1. read the sample data from the file
// 2. output the search records to the console.
const yachtRecords = JSON.parse(fs.readFileSync('sample-yachts.json', 'utf8'))
let allRecords = []
for (const yacht of yachtRecords) {
  const generatedSearchRecords = toSearchRecords(yacht)
  allRecords.push(...generatedSearchRecords)
}
console.log(JSON.stringify(allRecords, null, 2))
