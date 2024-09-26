import { liteClient as algoliasearch } from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'
import { connectRange } from 'instantsearch.js/es/connectors'
import {
  clearRefinements,
  configure,
  hits,
  menuSelect,
  pagination,
  rangeInput,
  refinementList,
  searchBox,
  stats,
} from 'instantsearch.js/es/widgets'
import { renderDateBeforeInput, renderDateAfterInput } from './dateInput'
import { DateTime } from 'luxon'

//
const ALGOLIA_APP_ID = 'XS4X4GJGA8'
const ALGOLIA_API_KEY = '1b6bee0488dc899e58e57f748383e757'
const ALGOLIA_INDEX_NAME = 'yachts'

//
// setup some templates to use for rendering the search results.
const TEMPLATE_EMPTY_RESULTS = '<div class="text-center">No results found.</div>'
// render the hit information (sorry for the messy code here)
const TEMPLATE_HIT = (hit, html, components) => html`
  <div class="flex flex-col pb-4">
    <div class="text-sky-700 text-lg">
      ${components.Highlight({ hit, attribute: 'name' })}
      <span class="text-gray-300 pl-8 text-sm">${hit.uri}</span>
    </div>
    <div>${components.Highlight({ hit, attribute: 'description' })}</div>
    <div class="hidden">Hit: <pre>${JSON.stringify(hit, null, 2)}</pre></div>
    <div>Sleeps: ${hit.sleeps} | Cabins: ${hit.cabins} | Bathrooms: ${hit.bathrooms}</div>
    <div>
      <!-- render information from our mock backend -->
      <ol class="pl-4">
        ${hit.mockBackend.pricing.pricingInfo.map((pricingInfo) => {
          return pricingInfo.effectiveDates.map((effectiveDate) => {
            return html`<li class="pt-2">
              →
              <span> From ${DateTime.fromISO(effectiveDate.from).toISODate()}</span>
              <span> to </span>
              <span>${DateTime.fromISO(effectiveDate.to).toISODate()}</span>
              <ul class="list-disc pl-8">
                <li>Charter Type: ${pricingInfo.pricing.unit == 'HOUR' ? 'DAY' : 'TERM'}</li>
                <li>Price: ${pricingInfo.pricing.currency} ${pricingInfo.pricing.total / 100}</li>
                <li>
                  Locations:
                  <ol class="list-decimal pl-4">
                    ${pricingInfo.pricing.inclusionZones.map((zone) => html`<li>${zone.category.join(' > ')}</li>`)}
                  </ol>
                </li>
              </ul>
            </li>`
          })
        })}
      </ol>
    </div>
  </div>
`

// setup the search client.
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const search = instantsearch({
  searchClient,
  appId: ALGOLIA_APP_ID,
  indexName: ALGOLIA_INDEX_NAME,
  apiKey: ALGOLIA_API_KEY,
  insights: false,
  routing: true,
})

//
const widgets = [
  // setup base configuration
  configure({
    hitsPerPage: 10,
    distinct: true,
    // attributeForDistinct: 'uri',
  }),

  //
  // create a text search box
  searchBox({
    container: '#search-box',
    placeholder: 'Search for ... ',
    showReset: false,
    showLoadingIndicator: false,
    cssClasses: {
      root: 'w-full',
      form: 'w-full',
      input: 'w-full border border-gray-300 rounded p-2',
      submitIcon: 'hidden',
    },
  }),

  //
  // refinement - charter type
  refinementList({
    container: '#refinement-charterType',
    attribute: 'charterType',
    sortBy: ['name:asc'],
    operator: 'or',
    showMore: false,
    searchable: false,
    cssClasses: {
      root: 'w-full',
      list: 'flex justify-center gap-x-2',
    },
    templates: {
      item(item, { html }) {
        const { url, label, count, isRefined } = item
        return html`
          <button
            class="inline-flex items-center justify-center rounded-full w-24 ${isRefined
              ? 'bg-sky-300'
              : 'bg-gray-100'}"
          >
            <span>${label}</span><span class="pl-1 text-sm text-gray-400">(${count})</span>
          </button>
        `
      },
    },
  }),

  //
  // refinement - sleeps
  refinementList({
    container: '#refinement-sleeps',
    attribute: 'sleeps',
    // these are number values, so need a 'special' sort.
    sortBy: (a, b) => parseInt(a.name) - parseInt(b.name),
    operator: 'or',
    showMore: false,
    searchable: false,
    cssClasses: {
      root: 'w-full',
      list: 'flex justify-center gap-x-2',
    },
    templates: {
      item(item, { html }) {
        const { url, label, count, isRefined } = item
        return html`
          <button
            class="inline-flex items-center justify-center rounded-full w-16 ${isRefined
              ? 'bg-sky-300'
              : 'bg-gray-100'}"
          >
            <span>${label}</span><span class="pl-1 text-sm text-gray-400">(${count})</span>
          </button>
        `
      },
    },
  }),

  //
  // refinements - cabins
  refinementList({
    container: '#refinement-cabins',
    attribute: 'cabins',
    // these are number values, so need a 'special' sort.
    sortBy: (a, b) => parseInt(a.name) - parseInt(b.name),
    operator: 'or',
    showMore: false,
    searchable: false,
    cssClasses: {
      root: 'w-full',
      list: 'flex justify-center gap-x-2',
    },
    templates: {
      item(item, { html }) {
        const { url, label, count, isRefined } = item
        return html`
          <button
            class="inline-flex items-center justify-center rounded-full w-16 ${isRefined
              ? 'bg-sky-300'
              : 'bg-gray-100'}"
          >
            <span>${label}</span><span class="pl-1 text-sm text-gray-400">(${count})</span>
          </button>
        `
      },
    },
  }),

  //
  // refinements - bathrooms
  refinementList({
    container: '#refinement-bathrooms',
    attribute: 'bathrooms',
    // these are number values, so need a 'special' sort.
    sortBy: (a, b) => parseInt(a.name) - parseInt(b.name),
    operator: 'or',
    showMore: false,
    searchable: false,
    cssClasses: {
      root: 'w-full',
      list: 'flex justify-center gap-x-2',
    },
    templates: {
      item(item, { html }) {
        const { url, label, count, isRefined } = item
        return html`
          <button
            class="inline-flex items-center justify-center rounded-full w-16 ${isRefined
              ? 'bg-sky-300'
              : 'bg-gray-100'}"
          >
            <span>${label}</span><span class="pl-1 text-sm text-gray-400">(${count})</span>
          </button>
        `
      },
    },
  }),

  //
  // refinements - price
  rangeInput({
    container: '#refinement-price',
    attribute: 'price',
    precision: 0,
    cssClasses: {
      root: 'w-full px-2',
      form: 'w-full',
      input: 'w-28 border border-gray-300 rounded p-2 text-center ',
      separator: 'px-2',
      submit: 'hidden',
    },
  }),

  //
  // refinements - geo
  menuSelect({
    container: '#refinement-geoContinent',
    attribute: 'geoContinent',
    sortBy: ['name:asc'],
    templates: {
      defaultOption(data, { html }) {
        return html`<span>Continent</span>`
      },
    },
    cssClasses: {
      select:
        'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
    },
  }),
  menuSelect({
    container: '#refinement-geoRegion',
    attribute: 'geoRegion',
    sortBy: ['name:asc'],
    limit: 99,
    templates: {
      defaultOption(data, { html }) {
        return html`<span>Region</span>`
      },
    },
    cssClasses: {
      select:
        'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
    },
  }),
  menuSelect({
    container: '#refinement-geoName',
    attribute: 'geoName',
    sortBy: ['name:asc'],
    limit: 99,
    templates: {
      defaultOption(data, { html }) {
        return html`<span>Area</span>`
      },
    },
    cssClasses: {
      select:
        'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
    },
  }),

  //
  // refinements - dates
  connectRange(renderDateAfterInput)({
    container: '#refinement-startDate',
    attribute: 'startDate',
    cssClasses: {
      input: 'w-28 border border-gray-300 rounded p-2 text-center placeholder:text-sm',
    },
  }),
  connectRange(renderDateBeforeInput)({
    container: '#refinement-endDate',
    attribute: 'endDate',
    cssClasses: {
      input: 'w-28 border border-gray-300 rounded p-2 text-center placeholder:text-sm',
    },
  }),

  //
  // create stats area
  stats({
    container: '#stats',
  }),

  //
  // allow refinements to be cleared
  clearRefinements({
    container: '#clear-refinements',
    templates: {
      resetLabel({ hasRefinements }, { html }) {
        return html`<span>${hasRefinements ? '[ Reset All ]' : ''}</span>`
      },
    },
  }),

  //
  // this example will use pagination.
  pagination({
    container: '#pagination',
    cssClasses: {
      root: 'w-full',
      list: 'flex justify-center',
      item: 'mx-2',
      selectedItem: 'font-bold underline',
      link: 'text-blue-700',
    },
  }),

  //
  // the hits!
  hits({
    container: '#hits',
    templates: {
      empty: TEMPLATE_EMPTY_RESULTS,
      item: (hit, { html, components }) => TEMPLATE_HIT(hit, html, components),
    },
  }),
]

search.addWidgets(widgets)
search.start()
