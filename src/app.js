import { liteClient as algoliasearch } from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'
import {
  configure,
  clearRefinements,
  hits,
  menuSelect,
  pagination,
  rangeInput,
  refinementList,
  searchBox,
  stats,
} from 'instantsearch.js/es/widgets'

//
const ALGOLIA_APP_ID = 'XS4X4GJGA8'
const ALGOLIA_API_KEY = '1b6bee0488dc899e58e57f748383e757'
const ALGOLIA_INDEX_NAME = 'yachts'

//
// setup some templates to use for rendering the search results.
const TEMPLATE_EMPTY_RESULTS = '<div class="text-center">No results found.</div>'
const TEMPLATE_HIT = (hit, html, components) => html`
  <div class="flex flex-col pb-4">
    <div class="text-sky-700">${components.Highlight({ hit, attribute: 'name' })}</div>
    <div>${components.Highlight({ hit, attribute: 'description' })}</div>
    <div>Sleeps: ${hit.sleeps} | Cabins: ${hit.cabins} | Bathrooms: ${hit.bathrooms}</div>
    <p class="text-gray-300">${hit.uri}</p>
  </div>
`

// setup the search client.
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const search = instantsearch({
  searchClient,
  appId: ALGOLIA_APP_ID,
  indexName: ALGOLIA_INDEX_NAME,
  apiKey: ALGOLIA_API_KEY,
  urlSync: true,
  insights: false,
  routing: true,
})

//
const widgets = [
  // setup base configuration
  configure({
    hitsPerPage: 10,
    facetingAfterDistinct: true,
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
        return html`<span>Country</span>`
      },
    },
    cssClasses: {
      select: 'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
    }
  }),
  menuSelect({
    container: '#refinement-geoRegion',
    attribute: 'geoRegion',
    sortBy: ['name:asc'],
    templates: {
      defaultOption(data, { html }) {
        return html`<span>Region</span>`
      },
    },
    cssClasses: {
      select: 'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
    }
  }),
  menuSelect({
    container: '#refinement-geoName',
    attribute: 'geoName',
    sortBy: ['name:asc'],
    templates: {
      defaultOption(data, { html }) {
        return html`<span>Area</span>`
      },
    },
    cssClasses: {
      select: 'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
    }
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
        return html`<span>${hasRefinements ? '[ Reset All ]' : ''}</span>`;
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
