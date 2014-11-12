/* global define:true */
define(['explore/mode'], function (Mode) {
    'use strict';

    var IssuesMode = function (canvas) {
        this._canvas = canvas;

        return this;
    };

    IssuesMode.prototype = new Mode();
    IssuesMode.prototype.constructor = IssuesMode;

    return IssuesMode;
});