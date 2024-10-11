import { liteClient as algoliasearch } from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'
import { connectConfigure, connectRange } from 'instantsearch.js/es/connectors'
import { clearRefinements, configure, menuSelect, pagination, stats } from 'instantsearch.js/es/widgets'
import { customGeoSelect } from './selectCustomGeo'
import { textDateAfter, textDateBefore } from './dateInput'
import { selectMinMax } from './filterSelect'
import { customHits } from './renderHits'

//
const ALGOLIA_APP_ID = 'XS4X4GJGA8'
const ALGOLIA_API_KEY = '1b6bee0488dc899e58e57f748383e757'
const ALGOLIA_INDEX_NAME = 'api_data_idx'

// setup the search client.
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const search = instantsearch({
  searchClient,
  appId: ALGOLIA_APP_ID,
  indexName: ALGOLIA_INDEX_NAME,
  apiKey: ALGOLIA_API_KEY,
  insights: false,
})

// *
// * Define the search widgets
// *   See: https://www.algolia.com/doc/api-reference/widgets/js/
// *
const widgets = [
  // setup base configuration
  configure({
    hitsPerPage: 51,
    distinct: true,
  }),

  //
  // Create the Custom GEO "Destination" select box
  connectConfigure(customGeoSelect, () => {})({
    el: '#refinement-destination',
    searchParameters: {},
  }),

  //
  // Create the "Yacht Type" select box
  menuSelect({
    container: '#refinement-yachtType',
    attribute: 'yachtType',
    sortBy: ['name:asc'],
    limit: 99,
    templates: {
      defaultOption(data, { html }) {
        return html`<span>Any</span>`
      },
    },
    cssClasses: {
      select: 'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
    },
  }),

  //
  // Create the "Yacht Length" select box
  connectRange(selectMinMax)({
    el: '#refinement-length',
    attribute: 'length_m',
  }),

  //
  // Create the "Number of Guests" select box
  //  Note: * for "TERM" charters, this is the "sleeps" field.
  //        * for "DAY" charters, this is the "cruisingCapacity" field.
  //        * these fields are ~mutually exclusive (that is, they will
  //        * only be set in the index if that charter type is available)
  connectRange(selectMinMax)({
    el: '#refinement-sleeps',
    attribute: 'sleeps',
  }),

  //
  // refinements - dates
  connectRange(textDateAfter)({
    el: '#refinement-embarkation',
    attribute: 'effectiveDateFrom',
  }),
  connectRange(textDateBefore)({
    el: '#refinement-disembarkation',
    attribute: 'effectiveDateTo',
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
        return html`<span>${hasRefinements ? '[ Reset ]' : ''}</span>`
      },
    },
  }),

  //
  // the hits!
  //  https://www.algolia.com/doc/api-reference/widgets/hits/js/
  customHits({
    container: document.querySelector('#hits'),
  }),

  //
  // this example will use pagination.
  pagination({
    container: '#pagination',
    cssClasses: {
      root: 'w-full',
      list: 'flex justify-center',
      item: 'mx-2 px-2',
      selectedItem: 'bg-gray-200 underline',
      link: 'text-blue-800',
    },
  }),
]

search.addWidgets(widgets)
search.start()
