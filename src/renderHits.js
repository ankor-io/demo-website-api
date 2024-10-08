import { connectHits } from 'instantsearch.js/es/connectors'

// Create the render function that customizes the hits.
// See: https://www.algolia.com/doc/api-reference/widgets/hits/js/
const renderHits = (renderOptions, isFirstRender) => {
  const { items, widgetParams } = renderOptions

  const defaultClass = 'grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8'
  const ulClass = widgetParams.container.getAttribute('data-ul-class')

  // <dd class="text-gray-700"><time datetime="2022-12-13">December 13, 2022</time></dd>
  widgetParams.container.innerHTML = `
    <ul role="list" class="${ulClass || defaultClass}">
    ${items
      .map(
        (hit) => `
        <!-- 
          objectID: ${hit.objectID} 
          uri: ${hit.uri} 
        -->
      <li class="overflow-hidden rounded-xl border border-gray-200">
        <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4">
          <svg class="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10" id="template" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title/><path d="M30.316,20.846a.336.336,0,0,0-.338-.194l-13.7.867v-1.4h6.6a4.49,4.49,0,0,0,4.785-3.935c.6-4.158-3.193-9.876-11.385-12.387V2.573a.355.355,0,0,0-.709,0V5.354a.339.339,0,0,0-.1.146C11.57,17.3,4.221,19.4,4.147,19.418a.355.355,0,0,0,.092.7h11.33v1.449l-8.215.519a.355.355,0,0,0-.332.354v3.487a.355.355,0,0,0,.709,0V22.77L29.2,21.411,25.615,25.7a.355.355,0,0,0,.544.455l4.113-4.918A.353.353,0,0,0,30.316,20.846ZM16.278,5.729c1.065,2.677,2.745,8.3,0,11.932Zm0,13.034c4.2-4.335,1.385-11.754.315-14.134C24.052,7.1,27.507,12.3,26.961,16.079a3.777,3.777,0,0,1-4.083,3.327h-6.6Zm-.709.643H6C8.34,18.179,12.637,15,15.569,7.328Z"/><path d="M29.819,29.072A3.643,3.643,0,0,1,26.682,26.9a.369.369,0,0,0-.029-.04.3.3,0,0,0-.048-.069.306.306,0,0,0-.047-.033.314.314,0,0,0-.059-.042l-.009,0a.22.22,0,0,0-.043-.009.326.326,0,0,0-.092-.018.185.185,0,0,0-.023,0,.343.343,0,0,0-.11.023h-.006c-.014.006-.024.018-.037.025a.357.357,0,0,0-.072.05.366.366,0,0,0-.04.057.274.274,0,0,0-.035.049,3.7,3.7,0,0,1-3.167,2.175A3.643,3.643,0,0,1,19.727,26.9c-.008-.016-.021-.027-.03-.042a.379.379,0,0,0-.046-.067.44.44,0,0,0-.052-.036.344.344,0,0,0-.055-.039l-.008,0a.431.431,0,0,0-.049-.011.38.38,0,0,0-.087-.016l-.016,0a.345.345,0,0,0-.118.024h0a.307.307,0,0,0-.035.024.375.375,0,0,0-.074.051.324.324,0,0,0-.04.057.274.274,0,0,0-.035.049,3.7,3.7,0,0,1-3.167,2.175A3.643,3.643,0,0,1,12.772,26.9c-.007-.015-.02-.026-.028-.04a.37.37,0,0,0-.048-.069.33.33,0,0,0-.049-.034.3.3,0,0,0-.058-.041l-.009,0a.348.348,0,0,0-.044-.01.357.357,0,0,0-.09-.017.155.155,0,0,0-.021,0,.335.335,0,0,0-.113.023h0a.33.33,0,0,0-.039.026.228.228,0,0,0-.111.107.348.348,0,0,0-.035.048,3.7,3.7,0,0,1-3.167,2.175A3.643,3.643,0,0,1,5.817,26.9c-.007-.015-.02-.026-.028-.04a.333.333,0,0,0-.049-.069.4.4,0,0,0-.047-.034.31.31,0,0,0-.059-.041l-.009,0a.348.348,0,0,0-.044-.01.365.365,0,0,0-.091-.017c-.006,0-.012,0-.019,0a.368.368,0,0,0-.114.024h0c-.014.006-.023.017-.036.024a.375.375,0,0,0-.074.051.388.388,0,0,0-.04.057.434.434,0,0,0-.035.049A3.7,3.7,0,0,1,2,29.072a.355.355,0,0,0,0,.709,4.182,4.182,0,0,0,3.488-2.018,4.128,4.128,0,0,0,3.467,2.018,4.18,4.18,0,0,0,3.488-2.018,4.125,4.125,0,0,0,3.467,2.018A4.183,4.183,0,0,0,19.4,27.763a4.127,4.127,0,0,0,3.467,2.018,4.183,4.183,0,0,0,3.488-2.018,4.124,4.124,0,0,0,3.466,2.018.355.355,0,1,0,0-.709Z"/></svg>
          <div class="text-sm font-medium leading-6 text-gray-900">${hit.name}</div>
          <div class="ml-auto flex flex-col flex-nowrap gap-2">
            <div class="text-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10 truncate">${hit.yachtType}</div>
            <div class="ml-auto flex flex-row flex-nowrap gap-x-2">
              <div class="text-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/10 ${hit.cruisingCapacity ?? 'hidden'}">DAY</div>
              <div class="text-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10 ${hit.sleeps ?? 'hidden'}">WEEK</div>
            </div>
          </div>
        </div>
        <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Length</dt>
            <dd class="text-gray-700">${hit.length_m} m</dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3 ${hit.sleeps ?? 'hidden'}">
            <dt class="text-gray-500">Sleeps</dt>
            <dd class="text-gray-700">${hit.sleeps}</dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3 ${hit.cruisingCapacity ?? 'hidden'}">
            <dt class="text-gray-500">Guest Capacity</dt>
            <dd class="text-gray-700">${hit.cruisingCapacity}</dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">From</dt>
            <!-- this price is already div 100 prior to sending to the search provider -->
            <dd class="text-gray-700">${Intl.NumberFormat('en-US', { style: 'currency', currency: hit.priceCurrency }).format(hit.priceTotal)}</dd>
          </div>
        </dl>
      </li>
      `,
      )
      .join('')}
    </ul>
  `
}

export const customHits = connectHits(renderHits)
