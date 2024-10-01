import { getAdjectives, getNouns, sentence } from '@ndaidong/txtgen'
import { capitalCase } from 'change-case'
import fs from 'fs'
import { v1 as UUID_v1 } from 'uuid'
import { DateTime } from 'luxon'

//
// Helper to read the location data.
const readLocationData = () => {
  // data is sorted, and unique.
  const allFileContents = fs.readFileSync('category-triplets.txt', 'utf-8')
  return allFileContents
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line))
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
// Generate a fake response aligning to the Ankor API, only required fields.
const generateBaseEntity = (locationTier) => ({
  uri: `test::yacht::${UUID_v1()}`,
  blueprint: {
    name: fakeName(),
    cruisingCapacity: between(100, 200),
    length: between(1, 100),
    sleeps: between(1, 100),
  },
  yachtType: [_randomElement(['MOTOR', 'SAILING', 'CATAMARAN', 'GULET', 'POWER CATAMARAN', 'SPORT FISHING'])],
  pricing: {
    pricingInfo: [
      {
        effectiveDates: [{ from: '2024-01-01T00:00:00Z', to: '2024-12-31T23:59:59Z' }],
        pricing: {
          total: between(1000000, 100000000), // 10k to 1M
          currency: 'USD',
          unit: 'WEEK',
          inclusionZones: [{ category: locationTier }],
          exclusionZones: [],
        },
      },
    ],
  },
})

//
// Generate a pricing info for "DAY" charter
const generateDayPricing = (locationTier) => ({
  effectiveDates: [
    { from: '2024-01-01T00:00:00Z', to: '2024-03-31T23:59:59Z' },
    { from: '2024-09-01T00:00:00Z', to: '2024-12-31T23:59:59Z' },
  ],
  pricing: {
    total: between(10000, 1000000), // 100 to 10k
    currency: 'USD',
    unit: 'HOUR',
    inclusionZones: [{ category: locationTier }],
    exclusionZones: [],
  },
})

//
// main
//
const main = () => {
  const locationTiers = readLocationData()

  // generate yachts
  const entities = []
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < locationTiers.length; i++) {
      const entity = generateBaseEntity(locationTiers[i])
      if (i % 3 == 0) {
        entity.pricing.pricingInfo.push(generateDayPricing(locationTiers[i]))
      }
      entities.push(entity)
    }
  }

  console.log(JSON.stringify(entities, null, 2))
}

main()
