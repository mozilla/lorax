Lorax
=====

## Get LESS
```sh
npm install -g less
```

## Initialize App

```sh
bower install
npm install
grunt server
```

## Data Structure

In the data/ folder there are two subfolders: base/ and i18n/.

### Base

The base/ folder contains all data that is consistent across languages. None of the data in this folder will be changed as a result of localization. 

##### main.json
Contains all issues, grouped by topic. Data for styling, type of infographic, tags, etc.

##### countries.topo.json
Contains the SVG data for drawing the world map.

### i18N

i18n is the localization folder. In it are subfolders which represent each language. Each language folder contains several files:

##### main.json
This file has four main sections: **topics**, **tags**, **modals**, and **misc**. <br>

* The **topics** section contains text for each issue on the detail page (name, title, copy, links, etc.)

* The **tags** section contains the display name for each issue tag.

* The **modals** section is organized by the type of modal (about, legend, etc.) and contains all copy and relevant information for that modal.

* The **misc** section contains just that: miscellaneous information that doesn't warrant its own category. Example data includes the site header, labels for the nav, and text for the intro.

##### country-data.json

Contains a list of all countries their data for the world map infographics.

##### infographics.json

This file is organized by issue. Each issue has a header, subheader, and source, as well as data that pertains to its specific infographic.