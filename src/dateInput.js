import { DateTime } from 'luxon'

export const renderDateAfterInput = (renderOptions, isFirstRender) => {
  const { widgetParams, start, refine } = renderOptions
  const container = document.querySelector(widgetParams.container)
  if (isFirstRender) {
    const form = document.createElement('form')

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const [input] = event.target.elements
      const epochSec = DateTime.fromISO(input.value).toSeconds()
      refine([undefined, epochSec])
    })

    container.appendChild(form)
  }

  container.querySelector('form').innerHTML = `
    <input
      name="afterVal"
      type="text"
      class="${widgetParams.cssClasses?.input || ''}"
      value="${DateTime.fromSeconds(start[1]).toISODate() || ''}"
      placeholder="YYYY-MM-DD"
    />
  `
}

export const renderDateBeforeInput = (renderOptions, isFirstRender) => {
  const { widgetParams, start, refine } = renderOptions
  const container = document.querySelector(widgetParams.container)
  if (isFirstRender) {
    const form = document.createElement('form')

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const [input] = event.target.elements
      const epochSec = DateTime.fromISO(input.value).toSeconds()
      refine([epochSec])
    })

    container.appendChild(form)
  }

  container.querySelector('form').innerHTML = `
    <input
      name="beforeVal"
      type="text"
      class="${widgetParams.cssClasses?.input || ''}"
      value="${DateTime.fromSeconds(start[0]).toISODate() || ''}"
      placeholder="YYYY-MM-DD"
    />
  `
}
