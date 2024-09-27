import { getAdjectives, getNouns, sentence } from '@ndaidong/txtgen'
import { capitalCase } from 'change-case'
import fs from 'fs'
import { v1 as UUID_v1 } from 'uuid'
import { DateTime } from 'luxon'

//
// Helper to read the location data.
var locationTiers = []
const readLocationData = () => {
  // data is sorted, and unique.
  const allFileContents = fs.readFileSync('category-triplets.txt', 'utf-8')
  let locationTiers = {}
  allFileContents
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .forEach((line) => {
      // console.log(`Line from file: ${line}`)
      const spots = JSON.parse(line)
      // console.log(spots)
      // one
      if (locationTiers[spots[0]] === undefined) {
        locationTiers[spots[0]] = {}
      }
      // two
      if (locationTiers[spots[0]][spots[1]] === undefined) {
        locationTiers[spots[0]][spots[1]] = []
      }
      // three
      // console.log(`Adding ${spots[2]} to ${spots[0]} ${spots[1]}`)
      locationTiers[spots[0]][spots[1]].push(spots[2])
    })

  return locationTiers
}

// Select a random property from an object.
const _randomProperty = function (obj) {
  var keys = Object.keys(obj)
  return keys[(keys.length * Math.random()) << 0]
}

// Select a random element from an array.
const _randomElement = function (arr) {
  return arr[(arr.length * Math.random()) << 0]
}

// Generate a random number between min and max.
const between = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

//
// Get lists of adjectives and nouns.
const adjectives = getAdjectives()
const nouns = getNouns()

//
// Generate a fake name.
const fakeName = () => {
  return capitalCase(`${_randomElement(adjectives)} ${_randomElement(nouns)}`)
}

//
// Stomp on the Array prototype to add a shuffle method.
Object.defineProperty(Array.prototype, 'shuffle', {
  value: function () {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this[i], this[j]] = [this[j], this[i]]
    }
    return this
  },
})

//
// Generate a yacht entity with the required minimum fields.
const generateEntity = () => {
  //
  let price = between(10000, 5000000)

  // if the price is % 3, then we:
  //  - generate 2 quarters for dates
  //    - one has pricing for day and week
  //      - one continent, one region, all locations
  //    - one has pricing for week
  //      - different continent, one region, 1-3 locations
  // if price is % 2, then we:
  //  - generate 2 quarters for dates
  //    - pricing for week
  //      - one continent, two regions, 1-3 locations
  //    - pricing for week
  //      - different continent, one region, 1-3 locations
  // else
  //  - generate 1 period (3-9months) for dates
  //    - pricing for day
  //      - one continent, one region, all locations
  //
  // Note:
  //  - Yachts with "DAY"/"HOUR" pricing may have a static capacity and a cruising capacity
  //    to denote how many passengers they can take onboard + staff.
  //

  //
  // DAY + TERM pricing.
  //
  if (price % 3 == 0) {
    const continent1 = _randomProperty(locationTiers)
    const region1 = _randomProperty(locationTiers[continent1])
    const locations1 = locationTiers[continent1][region1].map((n) => ({ category: [continent1, region1, n] }))
    //
    const continent2 = _randomProperty(locationTiers)
    const region2 = _randomProperty(locationTiers[continent2])
    const locations2 = locationTiers[continent2][region2]
      .map((n) => ({ category: [continent2, region2, n] }))
      .shuffle()
      .slice(0, between(1, 3))
    const datesA = [{ from: '2024-01-01T00:00:00Z', to: '2024-06-15T23:59:59Z' }]
    const datesB = [{ from: '2024-07-01T00:00:00Z', to: '2024-12-31T23:59:59Z' }]
    const staticCapacity = between(100, 300)
    const crusingCapacity = Math.floor(staticCapacity - staticCapacity / 10)
    const p = {
      uri: `test::yacht::${UUID_v1()}`,
      blueprint: {
        name: fakeName(),
        images: ['https://picsum.photos/192'],
        sleeps: between(1, 10),
        cabins: between(1, 5),
        bathrooms: between(1, 7),
        staticCapacity,
        crusingCapacity,
      },
      description: `${sentence(true)} ${between(1, 10) % 2 == 0 ? sentence(true) : ''}`,
      pricing: {
        pricingInfo: [
          {
            effectiveDates: price % 2 == 0 ? datesA : datesB,
            pricing: {
              total: Math.floor(price / 6),
              currency: 'USD', // EUR, GBP, AUD, CAD, NZD
              unit: 'HOUR',
              inclusionZones: locations1,
            },
          },
          {
            effectiveDates: price % 2 == 0 ? datesA : datesB,
            pricing: {
              total: price,
              currency: 'USD', // EUR, GBP, AUD, CAD, NZD
              unit: 'WEEK',
              inclusionZones: locations1,
            },
          },
          {
            effectiveDates: price % 2 != 0 ? datesA : datesB,
            pricing: {
              total: price,
              currency: 'USD', // EUR, GBP, AUD, CAD, NZD
              unit: 'WEEK',
              inclusionZones: locations2,
            },
          },
        ],
      },
    }
    // console.log(JSON.stringify(p, null, 2))
    return p
  }
  //
  // Only TERM pricing.
  //
  else if (price % 2 == 0) {
    //
    const continent1 = _randomProperty(locationTiers)
    const region1a = _randomProperty(locationTiers[continent1])
    const locations1a = locationTiers[continent1][region1a]
      .map((n) => ({ category: [continent1, region1a, n] }))
      .shuffle()
      .slice(0, between(1, 3))
    const region1b = _randomProperty(locationTiers[continent1])
    const locations1b = locationTiers[continent1][region1b]
      .map((n) => ({ category: [continent1, region1b, n] }))
      .shuffle()
      .slice(0, between(1, 3))
    //
    const continent2 = _randomProperty(locationTiers)
    const region2 = _randomProperty(locationTiers[continent2])
    const locations2 = locationTiers[continent2][region2]
      .map((n) => ({ category: [continent2, region2, n] }))
      .shuffle()
      .slice(0, between(1, 3))
    const dates = [
      [{ from: '2024-01-01T00:00:00Z', to: '2024-06-15T23:59:59Z' }],
      [{ from: '2024-07-01T00:00:00Z', to: '2024-12-31T23:59:59Z' }],
    ].shuffle()
    const p = {
      uri: `test::yacht::${UUID_v1()}`,
      blueprint: {
        name: fakeName(),
        images: ['https://picsum.photos/192'],
        sleeps: between(1, 10),
        cabins: between(1, 5),
        bathrooms: between(1, 7),
        // no staticCapacity
        // no crusingCapacity
      },
      description: `${sentence(true)} ${between(1, 10) % 2 == 0 ? sentence(true) : ''}`,
      pricing: {
        pricingInfo: [
          {
            effectiveDates: dates[0],
            pricing: {
              total: price,
              currency: 'USD', // EUR, GBP, AUD, CAD, NZD
              unit: 'WEEK',
              inclusionZones: [...locations1a, ...locations1b],
            },
          },
          {
            effectiveDates: dates[1],
            pricing: {
              total: price,
              currency: 'USD', // EUR, GBP, AUD, CAD, NZD
              unit: 'WEEK',
              inclusionZones: locations2,
            },
          },
        ],
      },
    }
    // console.log(JSON.stringify(p, null, 2))
    return p
  }
  //
  // Only DAY pricing.
  //
  else {
    // console.log('default')
    const continent1 = _randomProperty(locationTiers)
    const region1 = _randomProperty(locationTiers[continent1])
    const locations1 = locationTiers[continent1][region1].map((n) => ({ category: [continent1, region1, n] }))
    const startWeek = between(2, 24)
    const until = between(2, 24)
    const from = DateTime.fromISO('2024-01-01T00:00:00Z').plus({ weeks: startWeek }).toISO()
    const to = DateTime.fromISO('2024-01-01T00:00:00Z')
      .plus({ weeks: startWeek + until })
      .toISO()
    const staticCapacity = between(100, 300)
    const crusingCapacity = Math.floor(staticCapacity - staticCapacity / 10)
    const p = {
      uri: `test::yacht::${UUID_v1()}`,
      blueprint: {
        name: fakeName(),
        images: ['https://picsum.photos/192'],
        // no sleeps
        // no cabins
        bathrooms: between(1, 7),
        staticCapacity,
        crusingCapacity,
      },
      description: `${sentence(true)} ${between(1, 10) % 2 == 0 ? sentence(true) : ''}`,
      pricing: {
        pricingInfo: [
          {
            effectiveDates: [{ from, to }],
            pricing: {
              total: Math.floor(price / 6),
              currency: 'USD', // EUR, GBP, AUD, CAD, NZD
              unit: 'HOUR',
              inclusionZones: locations1,
            },
          },
        ],
      },
    }
    // console.log(JSON.stringify(p, null, 2))
    return p
  }
}

//
// main
//
const main = () => {
  locationTiers = readLocationData()

  // generate 500 yachts
  const entities = []
  for (let i = 0; i < 500; i++) {
    entities.push(generateEntity())
  }

  console.log(JSON.stringify(entities, null, 2))
}

main()
