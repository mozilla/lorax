Lorax
=====

The Lorax is interested in your proposal.

![skeptical lorax](http://i.imgur.com/NqMpLxC.jpg)

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

* The **topics** section contains text for each issue on the detail page (name, title, copy, links, etc.). This is also where you'll find the data for **shareUrl**, which controls each issue's links for Twitter, Facebook, and email.

* The **tags** section contains the display name for each issue tag.

* The **modals** section is organized by the type of modal (about, legend, etc.) and contains all copy and relevant information for that modal.

* The **misc** section contains just that: miscellaneous information that doesn't warrant its own category. Example data includes the site header, labels for the nav, and text for the intro.

##### country-data.json

Contains a list of all countries and their data for the world map infographics.

##### infographics.json

This file is organized by issue. Each issue has a header, subheader, and source, as well as data that pertains to its specific infographic.

## Email Sign-Up Feature

Code for the email sign-up page is located at:

**/app/lorax/directives/modal-email.js**<br>
and <br>
**/app/lorax/directives/modal-email.tpl.html**<br/>

You can find the inputs for email, country, and ToS in the HTML file. They are all under the form tag with the class "keep-informed__form"

### Success / Fail Buttons
The styling and basic functionality for these buttons is implemented. There are variables for each button, **showFailedBtn** and **showSuccessBtn**. If there are set to true, the buttons will appear.<br>

The functions **onSubmitFail()** and **onSubmitSuccess()** provide functionality to turn these variables to true and set the other buttons to false. For example, running **onSubmitFail()** will show the "Failed" button and hide the "Submit" and "Success" buttons. Feel free to change the functionality as needed.
