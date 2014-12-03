/* global define:true */
define([
    'pixi',
    'gs',
    'experience/mode',
    'experience/responsive'
], function (
    PIXI,
    gs,
    Mode,
    Responsive
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

        this._introContainer = new PIXI.DisplayObjectContainer();
        this._introContainer.x = Math.round(this._canvas.canvasSize.x / 2);
        this._introContainer.y = Math.round(this._canvas.canvasSize.y / 2);
        this._canvas.addChild(this._introContainer);

        this._clickArea = new PIXI.Graphics();
        this._clickArea.hitArea = new PIXI.Rectangle(0, 0, this._canvas.canvasSize.x, this._canvas.canvasSize.y);
        this._clickArea.x = -this._introContainer.x;
        this._clickArea.y = -this._introContainer.y;
        this._clickArea.interactive = true;
        this._clickArea.interactive = true;
        this._clickArea.buttonMode = true;
        this._clickArea.mousedown = this._onPressClose.bind(this);

        var messageStyle = {font: '200 24px "Fira Sans", sans-serif', fill: '#222222'};
        this._message = new PIXI.Text(this._introData.message, messageStyle);
        this._message.resolution = Responsive.RATIO;
        this._message.x = Math.round(-(this._message.width / Responsive.RATIO) / 2);
        this._message.y = -90;
        this._message.alpha = 0;
        this._introContainer.addChild(this._message);

        var internetStyle = {font: '300 12px "Fira Sans", sans-serif', fill: '#222222'};
        this._internet = new PIXI.Text(this._introData.internet, internetStyle);
        this._internet.resolution = Responsive.RATIO;
        this._internet.x = Math.round(-(this._internet.width / Responsive.RATIO) / 2);
        this._internet.y = 25;
        this._internet.alpha = 0;
        this._introContainer.addChild(this._internet);
    };

    IntroMode.prototype.setData = function (data) {
        this._introData = data;
    };

    IntroMode.prototype._onPressClose = function () {
        this.hide();
    };

    IntroMode.prototype._onStartShow = function () {
        var issue;
        var i;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.elm.interactive = false;
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            issue = this._canvas.tags[i];
            issue.elm.interactive = false;
        }

        gs.TweenMax.to(this._message, 0.4, {alpha: 1, overwrite: true, delay: 2.5});
        gs.TweenMax.to(this._internet, 0.4, {alpha: 1, overwrite: true});
        this._introContainer.addChild(this._clickArea);

        setTimeout(this._onShow.bind(this), 500);
    };

    IntroMode.prototype._onStartHide = function () {
        var issue;
        var i;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.elm.interactive = true;
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            issue = this._canvas.tags[i];
            issue.elm.interactive = true;
        }

        gs.TweenMax.to(this._message, 0.2, {alpha: 0, overwrite: true});
        gs.TweenMax.to(this._internet, 0.2, {alpha: 0, overwrite: true});
        this._introContainer.removeChild(this._clickArea);

        setTimeout(this._onHide.bind(this), 100);
    };

    return IntroMode;
});
