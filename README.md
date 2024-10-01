# Ankor Website API Demo

## Overview

This project is intented to provide a high level developer overview on how to integrate
the Ankor Website API to your website. As with everything, this is one way of doing it,
please adapt it to your requirements.

The Ankor APIs are always evolving:

* [api.ankor.io](https://api.ankor.io/)
* [Help Center](https://ankorradar.productfruits.help/en) - includes more examples and FAQs

There is further documenation within the code, get amongst it.

This project is deployed to [https://demo-website-api.ankor.io/](https://demo-website-api.ankor.io/)

## Technology

This demo uses 3rd parties to provide functionality; replace as needed. These include:

1. Algolia - provides search functionality and data indexing.
2. Javascript/NodeJS/(and dependencies)

Additionally, the code values readability over optimization.

## Quick Start

Requires: Node `lts/iron`

```sh
$ npm install
$ npm run start
```

Open [http://localhost:3000/](http://localhost:3000/)

## Wordpress

A frequent use is to integrate our API to an existing (or new) Wordpress site. While 
it is outside the scope of this example, the concepts herein still apply.  That is, you 
can use the API to Search Record mappings in the example code to aide in mapping to 
Wordpress structures. See [data/mapSampleToSearchRecords.mjs](data/mapSampleToSearchRecords.mjs)

The general steps to follow are:

1. Create a new `Post Type` to store the Yachts from the Ankor API.
2. Create a way to "add" Yachts from the Ankor API to the Wordpress site.
3. Routinely, refresh the Yacht data from the API. Ankor recommends to refresh once a week.
4. Build a template to render the `Post Type`
5. With a new `Post Type` in place, modify the sites search to include the new posts.

Ankor has a network of integration partners that can assist; please contact support@ankor.io
for more information.

## Data

Inside of the `data` directory are the example data files which are used throughout this example. 

For search, the data has been stripped back to only include the necessary fields for this demo project.  This table describes an API field, if it is searchable in this example and the 
intended usage. Each `pricingInfo` element can be considered a product variant, in e-commerce terms.


| Ankor API field                                                       | Search field      | Can search? | Usage                                                                      |
| --------------------------------------------------------------------- | ----------------- | ----------- | -------------------------------------------------------------------------- |
| `uri`                                                                 | uri               | N           | This is the 'primary key' of the yacht                                     |
| `blueprint.cruisingCapacity`                                          | cruisingCapacity  | Y + facet   | Capacity of guests on the yacht when it is chartered hourly or for the day |
| `blueprint.length`                                                    | length_m          | Y + facet   | The length of the yacht in meters                                          |
| `blueprint.name`                                                      | name              | Y           | The name of the yacht                                                      |
| `blueprint.sleeps`                                                    | sleeps            | Y + facet   | Capacity of the yacht when it is chartered overnight                       |
| `pricing.pricingInfo[].effectiveDates[].from`                         | effectiveDateFrom | Y + facet   | The start date for pricing and availability in ISO-8601                    |
| `pricing.pricingInfo[].effectiveDates[].to`                           | effectiveDateTo   | Y + facet   | The end date for pricing and availability in ISO-8601                      |
| `pricing.pricingInfo[].effectiveDates[].inclusionZones[].category`    | geoAreas          | Y + facet   | A list of all the geo areas combined, for faceting across all geo fields   |
| `pricing.pricingInfo[].effectiveDates[].inclusionZones[].category[0]` | geoContinent      | Y + facet   | Continent                                                                  |
| `pricing.pricingInfo[].effectiveDates[].inclusionZones[].category[1]` | geoRegion         | Y + facet   | General Region, some values overlap with Continent                         |
| `pricing.pricingInfo[].effectiveDates[].inclusionZones[].category[2]` | geoName           | Y + facet   | Most specific geographic area / destination                                |
| `pricing.pricingInfo[].effectiveDates[].pricing.currency`             | priceCurrency     | Y           | ISO currency unit of the price, i.e. 'EUR'                                 |
| `pricing.pricingInfo[].effectiveDates[].pricing.total`                | priceTotal        | Y           | Total price, in cents. i.e 31459 = $314.59                                 |
| `yachtType[]`                                                         | yachtType         | Y + facet   | The type of the yacht, e.g. "Sailing" or "Motor"                           |


Additional notes:

- `weekPricingFrom`, `weekPricingTo`, `dayPricingFrom`, `dayPricingTo`
  - These are derived from a scan of the `pricingInfo[]` fields.
  - Are only valid to use if you do not build start/end dates into your search logic.

- `effectiveDates: []`, an empty effectiveDates range
  - This implies the `pricingInfo` is always valid.

- `date` type fields
  - All date fields are stored as ISO-8601 formatted strings
  - When inserted into search records, they are converted to Unix epoch seconds to allow for easy range operations




