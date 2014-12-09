/* global define:true */
define(['signals'], function (signals) {
    'use strict';

    var Mode = function () {
    };

    if (!Mode.MODES) {
        Mode.MODES = [];
        Mode.OPEN_MODE = null;
        Mode.LAST_MODE = null;
        Mode.DEFAULT_MODE = null;
    }

    Mode.prototype.init = function () {
        this.showS = new signals.Signal();
        this.hideS = new signals.Signal();
    };

    Mode.prototype.show = function () {
        // close previous mode and call _onStartShow
        if (Mode.OPEN_MODE) {
            if (Mode.OPEN_MODE !== this) {
                Mode.LAST_MODE = Mode.OPEN_MODE;
                Mode.OPEN_MODE.hide(this._onStartShow.bind(this));
            }
        } else {
            this._onStartShow();
        }
    };

    Mode.prototype._onStartShow = function () {
        this._onShow();
    };

    Mode.prototype._onShow = function () {
        Mode.OPEN_MODE = this;
        this.isOpen = true;
        this.showS.dispatch();
    };

    Mode.prototype.hide = function (callback) {
        this._hideCallback = callback;
        this._onStartHide();
    };

    Mode.prototype._onStartHide = function () {
        this._onHide();
    };

    Mode.prototype._onHide = function () {
        Mode.OPEN_MODE = null;
        this.isOpen = false;
        if (this._hideCallback) {
            this._hideCallback();
            this._hideCallback = null;
        }
        this.hideS.dispatch();
        // } else {
        //     // open last mode if no callback was provided
        //     if (!Mode.LAST_MODE) {
        //         Mode.LAST_MODE = Mode.DEFAULT_MODE;
        //     }
        //     Mode.LAST_MODE.show();
        // }
    };

    return Mode;
});