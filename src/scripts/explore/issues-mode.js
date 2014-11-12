/* global define:true */
define(['explore/mode'], function (Mode) {
    'use strict';

    var IssuesMode = function () {
        return this;
    };

    IssuesMode.prototype = new Mode();
    IssuesMode.prototype.constructor = IssuesMode;

    return IssuesMode;
});