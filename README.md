# Shape of the Web

Shape of the Web (codenamed "Lorax") is a micro-site encouraging the Mozilla
audience to educate themselves about the state of the Web, learn more about
Mozilla and show their support.

- [Project Lorax on wiki.mozilla.org](https://wiki.mozilla.org/Engagement/Campaigns/Project_Lorax)

## Contributing

If you're interested in contributing, or are looking for instructions on how
to set up a local development copy of Lorax, check out the
[CONTRIBUTING.md](https://github.com/mozilla/lorax/blob/master/CONTRIBUTING.md)
file.

## Map Data

Map data is handled in a seperate process. It is inputed into a spreadsheet, then exported out using a script.

World Map Data Conversion Instructions

1. Select and copy all the data (including the header row) from the [Data Source](https://docs.google.com/spreadsheets/d/1jN7RGMeA3-fofx5IGu1KWodRLRVl324kQj9r_7Kc6yg/edit#gid=0).
2. Visit 'Mr Data Convertor' - http://shancarter.github.io/mr-data-converter/
3. Paste into input CSV space
4. Ensure out put is set to 'JSON Properties'
5. Paste content of JSON Properties into development environment.

## Data Structure

The JSON data is stored on [bedrock](https://github.com/mozilla/bedrock/tree/master/bedrock/shapeoftheweb/templates/shapeoftheweb).

### main.json

Contains all issues, grouped by topic. Data for styling, type of infographic, tags, etc.

This file has three main sections: **topics**, **modals**, and **misc**. <br>

* The **topics** section contains text for each issue on the detail page (name, title, copy, links, etc.). This is also where you'll find the data for **shareUrl**, which controls each issue's links for Twitter, Facebook, and email.

* The **modals** section is organized by the type of modal (about, legend, etc.) and contains all copy and relevant information for that modal.

* The **misc** section contains just that: miscellaneous information that doesn't warrant its own category. Example data includes the site header, labels for the nav, and text for the intro.

### country-data.json

Contains a list of all countries and their data for the world map infographics.

### infographics.json

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

## License

This software is licensed under the
[Mozilla Public License 2.0](https://www.mozilla.org/MPL/). For more
information, read the
[LICENSE](https://github.com/mozilla/lorax/blob/master/LICENSE) file.
