import { DateTime } from 'luxon'

//
// This is a quick UI component to allow date input by text.
// Replace the use of these with your favorite date picker.
//

//
// Apply supplied value as "after this date" to the search.
// It converts to a Unix epoch timestamp (seconds).
export const textDateAfter = (renderOptions, isFirstRender) => {
  const { widgetParams, refine } = renderOptions

  if (isFirstRender) {
    // define a method to handle the event
    const a = (event) => {
      event.preventDefault()
      const input = event.target.value
      const epochSec = DateTime.fromISO(input).toSeconds()
      refine([undefined, epochSec])
    }

    //
    const el = document.querySelector(widgetParams.el)
    el.addEventListener('change', a)
    // el.addEventListener('keyup', a)  // or debounce this.
  }
}

//
// Apply supplied value as "after this date" to the search.
// It converts to a Unix epoch timestamp (seconds).
export const textDateBefore = (renderOptions, isFirstRender) => {
  const { widgetParams, refine } = renderOptions

  if (isFirstRender) {
    // define a method to handle the event
    const a = (event) => {
      event.preventDefault()
      const input = event.target.value
      const epochSec = DateTime.fromISO(input).toSeconds()
      refine([epochSec])
    }

    //
    const el = document.querySelector(widgetParams.el)
    el.addEventListener('change', a)
    // el.addEventListener('keyup', a)  // or debounce this.
  }
}
