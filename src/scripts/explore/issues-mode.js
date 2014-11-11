/* global define:true */
define(['explore/mode'], function (Mode) {
    'use strict';

    var IssuesMode = function () {

        return {
            show: this.show.bind(this),
            hide: this.hide.bind(this)
        }
    };

    IssuesMode.prototype = new Mode();

    return IssuesMode;
});