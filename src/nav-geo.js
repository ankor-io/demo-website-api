import { liteClient as algoliasearch } from 'algoliasearch/lite'
import instantsearch from 'instantsearch.js'
import { connectHierarchicalMenu } from 'instantsearch.js/es/connectors'
import { clearRefinements, configure, pagination, stats } from 'instantsearch.js/es/widgets'
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
  // routing: true,
})

//
// Create the render function
const renderList = ({ items, createURL }, level = 0) => `
  <ul class="list-inside ${level > 0 ? 'pl-3' : ''}">
    ${items
      .map(
        (item) => `
          <li>
            <a
              href="${createURL(item.value)}"
              data-value="${item.value}"
              style="font-weight: ${item.isRefined ? 'bold' : ''}"
            >
              ${item.label} <span class="text-gray-400 text-sm">(${item.count})</span>
            </a>
            ${item.data ? renderList({ items: item.data, createURL }, level + 1) : ''}
          </li>
        `,
      )
      .join('')}
  </ul>
`

const renderHierarchicalMenu = (renderOptions, isFirstRender) => {
  const { items, isShowingMore, refine, canToggleShowMore, toggleShowMore, createURL, widgetParams } = renderOptions

  if (isFirstRender) {
    const list = document.createElement('div')
    const button = document.createElement('button')

    button.addEventListener('click', () => {
      toggleShowMore()
    })

    widgetParams.container.appendChild(list)
    widgetParams.container.appendChild(button)
    if (!canToggleShowMore) {
      button.classList = 'hidden'
    }
  }

  const children = renderList({ items, createURL })

  widgetParams.container.querySelector('div').innerHTML = children
  widgetParams.container.querySelector('button').textContent = isShowingMore ? 'Show less' : 'Show more'
  ;[...widgetParams.container.querySelectorAll('a')].forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault()
      refine(event.target.dataset.value)
    })
  })
}

// Create the custom widget
const customHierarchicalMenu = connectHierarchicalMenu(renderHierarchicalMenu)

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
  // Create the menu heirarchy
  customHierarchicalMenu({
    container: document.querySelector('#refinement-geo'),
    attributes: ['geoHierarchy.lvl0', 'geoHierarchy.lvl1', 'geoHierarchy.lvl2', 'geoHierarchy.lvl3'],
    separator: ' > ',
    sortBy: ['name:asc'],
    limit: 99,
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
        return html`<span class="text-sm text-blue-400">${hasRefinements ? '[ Reset ]' : ''}</span>`
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
