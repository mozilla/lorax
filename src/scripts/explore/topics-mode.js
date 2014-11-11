/* global define:true */
define(['explore/mode'], function (Mode) {
    'use strict';

    var TopicsMode = function () {

        return {
            show: this.show.bind(this),
            hide: this.hide.bind(this)
        }
    };

    TopicsMode.prototype = new Mode();

    return TopicsMode;
});