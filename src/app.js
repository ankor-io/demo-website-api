import { liteClient as algoliasearch } from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'
import { configure, hits, pagination, searchBox, stats } from 'instantsearch.js/es/widgets'


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
  // create stats area
  stats({
    container: '#stats',
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
