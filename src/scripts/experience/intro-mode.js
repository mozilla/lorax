/* global define:true */
define([
    'pixi',
    'createjs',
    'experience/mode'
], function (
    PIXI,
    createjs,
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

        this._introContainer = new PIXI.DisplayObjectContainer();
        this._introContainer.x = this._canvas.canvasSize.x / 2;
        this._introContainer.y = this._canvas.canvasSize.y / 2;
        this._canvas.addChild(this._introContainer);

        var messageStyle = {font: '200 24px "Fira Sans", sans-serif', fill: '#222222'};
        this._message = new PIXI.Text('The world’s most powerful tool, is the most fragile', messageStyle);
        this._message.x = Math.round(-this._message.width / 2);
        this._message.y = -90;
        this._message.alpha = 0;
        this._introContainer.addChild(this._message);

        var internetStyle = {font: '300 12px "Fira Sans", sans-serif', fill: '#222222'};
        this._internet = new PIXI.Text('( THE INTERNET )', internetStyle);
        this._internet.x = Math.round(-this._internet.width / 2);
        this._internet.y = 25;
        this._internet.alpha = 0;
        this._introContainer.addChild(this._internet);
    };

    IntroMode.prototype._onStartShow = function () {
        createjs.Tween.get(this._message).wait(2500).to({alpha: 1}, 400, createjs.quartIn);
        createjs.Tween.get(this._internet).to({alpha: 1}, 400, createjs.quartIn);

        setTimeout(this._onShow.bind(this), 6000);
    };

    IntroMode.prototype._onStartHide = function () {
        createjs.Tween.get(this._message).to({alpha: 0}, 200, createjs.quartIn);
        createjs.Tween.get(this._internet).to({alpha: 0}, 200, createjs.quartIn);

        setTimeout(this._onHide.bind(this), 100);
    };

    return IntroMode;
});