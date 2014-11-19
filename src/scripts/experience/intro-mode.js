/* global define:true */
define([
    'experience/mode'
], function (
    Mode
) {
    'use strict';

    var IntroMode = function (canvas) {
        this._canvas = canvas;

        return this;
    };

    IntroMode.prototype = new Mode();
    IntroMode.prototype.constructor = IntroMode;

    IntroMode.prototype.init = function () {
        Mode.prototype.init.call(this);
    };

    IntroMode.prototype._onStartShow = function () {
        setTimeout(this._onShow.bind(this), 500);
    };

    IntroMode.prototype._onStartHide = function () {
        setTimeout(this._onHide.bind(this), 100);
    };

    return IntroMode;
});