//
// these widgets hook to an existing select and predefined values to the search
// and do not render their select based on the available (facet) data.
// use an Algolia widget if the UX experience is for a dynamic facet.
//

//
// perform a filter that is within [num] inclusive
//    1. attribute >= num
//
// perform a filter that is within [min,max] inclusive
//    1. attribute >= min
//    2. attribute <= max
//
// perform a filter that is less than [,max] inclusive
//    1. attribute <= max
export const selectMinMax = (renderOptions, isFirstRender) => {
  const { widgetParams, refine } = renderOptions

  if (!isFirstRender) {
    // no need to perform anything if not the first render as it is predefined select element
    return
  }

  // add an event listener to the select element to refine when changed.
  const el = document.querySelector(widgetParams.el)
  el.addEventListener('change', (event) => {
    event.preventDefault()

    let value = event.target.value

    // if the value is empty, then refine to the default value
    if (!value) {
      refine()
      return
    }

    // strip the [ ] brackets, and split.
    value = value.replace(/[\[\]]/g, '')
    let range = value.split(',')
    //
    if (range.length < 1) {
      refine()
    }
    // only 1 item supplied, min
    else if (range.length == 1) {
      //
      refine([range[0] || undefined])
    }
    // 2 values, min and max
    else {
      refine([range[0] || undefined, range[1] || undefined])
    }
  })
}
