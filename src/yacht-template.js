// import the sample data and expose it to the global scope to be
// used by the template page.
import ankorAPIResponse from '../data/bigsky.json'
global.ankorAPIResponse = ankorAPIResponse

// Convert the path provided by the API to a full URL
global.toImageUrl = function (loc, imageVariant) {
  const _loc = loc.replace('{imageVariant}', imageVariant)
  return `https://api.ankor.io${_loc}`
}

// format a price
global.formatPrice = function (p) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    notation: 'compact',
    currency: p.currency,
  }).format(p.price / 100)
}

// format a date
global.formatDate = function (d) {
  console.log(d)
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
