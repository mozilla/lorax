/* global define:true */
define(['explore/mode'], function (Mode) {
    'use strict';

    var TopicsMode = function () {
        return this;
    };

    TopicsMode.prototype = new Mode();
    TopicsMode.prototype.constructor = TopicsMode;

    return TopicsMode;
});