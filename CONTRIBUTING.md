# How to Contribute

Welcome, and thanks for considering contributing! In order to make our
review/development process easier, we have some guidelines to help you figure
out how to contribute to Project Lorax.


## Getting Started

If you're new to contributing to Mozilla, you may want to read through the
[Mozilla Webdev Bootcamp](http://mozweb.readthedocs.org/en/latest/), a tutorial
and reference guide to contributing as a web developer to Mozilla.


## Reporting Issues

We use [Bugzilla][] to track issues and bugs for Project Lorax. Any issues
with the website should be filed under the Shape of the Web component in the
Websites product.

[Bugzilla]: https://bugzilla.mozilla.org/buglist.cgi?product=Websites&component=Shape%20of%20the%20Web&resolution=---


## Developer Setup

This section describes how to set up an instance of the site on your local
computer for you to develop with.

The following steps assume you have [Git](http://git-scm.com/) and
[Node.js](http://nodejs.org/) installed.

1. Clone the repo:

   ```sh
   git clone https://github.com/mozilla/lorax.git
   ```

2. Download and install dependencies via bower and npm.

    ```sh
    npm install && bower install
    ```

3. Start the development server.

   ```sh
   grunt server
   ```

4. Open http://127.0.0.1:9000 in your browser.


## Development Guidelines

* Servers pull code from `master`. Development should happen in feature branches
  and pull requests should merge back to `master` except in special cases.
* JavaScript code should follow Mozilla's [JavaScript guidelines](js-bootcamp),
  and CSS code should follow our [CSS guidelines](css-bootcamp).

[js-bootcamp]: http://mozweb.readthedocs.org/en/latest/reference/js-style.html
[css-bootcamp]: http://mozweb.readthedocs.org/en/latest/reference/css-style.html


## Additional Resources

* IRC: #webprod on [irc.mozilla.org](https://wiki.mozilla.org/IRC).
* Planning/roadmap/meetings: [Lorax on MozillaWiki](https://wiki.mozilla.org/Engagement/Campaigns/Project_Lorax)
