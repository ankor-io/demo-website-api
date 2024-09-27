//
// Render a hit.
//
import { DateTime } from 'luxon'

const getSpecifiedCharterType = (uiState) => {
  return uiState?.yachts?.menu?.charterType
}

const charterTypeItems = (hit, apiRecord, { uiState, html, components }) => {
  //
  // Some yachts offer both day and term charters, because of the way hits are returned from algolia (distinct),
  // when no 'DAY' or 'TERM' is part of the search, Algolia may return any of the yacht records as the hit.
  const charterTypeSpecified = getSpecifiedCharterType(uiState)

  const items = []
  if (!charterTypeSpecified) {
    // show all the attributes available.
    if (apiRecord.blueprint.staticCapacity) {
      items.push(`Has a static capacity of ${apiRecord.blueprint.staticCapacity}`)
    }
    if (apiRecord.blueprint.crusingCapacity) {
      items.push(`Has cruising capacity for ${apiRecord.blueprint.crusingCapacity} guests`)
    }
    if (apiRecord.blueprint.sleeps) {
      items.push(
        `Can accommodate overnight charters up to ${apiRecord.blueprint.sleeps} guests in ${apiRecord.blueprint.cabins || '?'} cabins`,
      )
    }
  }
  //
  // show the attributes available from the hit.
  else {
    if (hit.staticCapacity) {
      items.push(`Has a static capacity of ${apiRecord.blueprint.staticCapacity}`)
    }
    if (hit.crusingCapacity) {
      items.push(`Has cruising capacity for ${apiRecord.blueprint.crusingCapacity} guests`)
    }
    if (hit.sleeps) {
      items.push(
        `Can accommodate overnight charters up to ${apiRecord.blueprint.sleeps} guests in ${apiRecord.blueprint.cabins || '?'} cabins`,
      )
    }
  }
  return items
}

export const pricingInfoItems = (hit, apiRecord, { uiState, html, components }) => {
  // For this example UI, the same logic for DAY / TERM / DAY+TERM applies as noted above in charterTypeItems.
  const charterTypeSpecified = getSpecifiedCharterType(uiState)
  const unit = charterTypeSpecified === 'DAY' ? 'HOUR' : 'WEEK'

  //
  // filter for the specified charter type (or all if not specified)
  const relevantPricingInfo = apiRecord.pricing.pricingInfo.filter(
    (pricingInfo) => !charterTypeSpecified || pricingInfo.pricing.unit === unit,
  )

  return relevantPricingInfo.map(
    (pricingInfo) => html`
      <li class="pt-2">
        <div class="grid grid-cols-1">
          <div>
            This pricing is available for <span class="font-semibold">${pricingInfo.pricing.unit == 'HOUR' ? 'DAY' : 'TERM'}</span> charters.
          </div>
          <div class="pl-8">
            <ul>
              <!-- date ranges this pricing is available -->
              ${pricingInfo.effectiveDates.map(
                (effectiveDate) =>
                  html`<li>
                    <span> From ${DateTime.fromISO(effectiveDate.from).toISODate()}</span>
                    <span> to </span>
                    <span>${DateTime.fromISO(effectiveDate.to).toISODate()}</span>
                  </li>`,
              )}
              <!-- the price -->
              <li>Price: ${pricingInfo.pricing.currency} ${pricingInfo.pricing.total / 100}</li>
              <!-- where -->
              <li>Locations:
                <ul class="pl-4">
                  ${pricingInfo.pricing.inclusionZones.map((zone) => html`<li>${zone.category.join(' > ')}</li>`)}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </li>
    `,
  )
  //   <ul class="list-disc pl-8">
  //     <li>
  //       Locations:
  //       <ol class="list-decimal pl-4">
  //         ${pricingInfo.pricing.inclusionZones.map((zone) => html`<li>${zone.category.join(' > ')}</li>`)}
  //       </ol>
  //     </li>
  //   </ul>
  // </li>`
  //  )

  // ${hit.mockBackend.pricing.pricingInfo.map((pricingInfo) => {
  // return pricingInfo.effectiveDates.map((effectiveDate) => {
  // return html(blocks.join(''))
}

export const renderHit = (hit, { uiState, html, components }) => {
  const apiRecord = hit.mockBackend
  return html`
    <div class="flex flex-col pb-4">
      <div class="text-sky-700 text-lg">
        ${components.Highlight({ hit, attribute: 'name' })}
        <span class="text-gray-300 pl-8 text-sm">${hit.uri}</span>
      </div>
      <div class="text-gray-300 text-sm">${components.Highlight({ hit, attribute: 'description' })}</div>
      <div class="hidden">
        Hit:
        <pre>${JSON.stringify(hit, null, 2)}</pre>
      </div>
      <div class="pl-4 border-l">
        <div class="py-4">
          <span>This yacht ...</span>
          <ul class="list-disc pl-8">
            ${charterTypeItems(hit, apiRecord, { uiState, html, components }).map((item) => html`<li>${item}</li>`)}
          </ul>
        </div>
        <div>
          <!-- render information from our mock backend; the note above about day/term also applies here. -->
          <div>and is available for charter on these dates and in these locations:</div>
          <ol class="pl-4">
            ${pricingInfoItems(hit, apiRecord, { uiState, html, components })}
          </ol>
        </div>
      </div>
    </div>
  `
}
