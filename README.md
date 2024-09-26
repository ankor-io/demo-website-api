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

