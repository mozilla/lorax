/* global define:true */
define([
    'pixi',
    'gs',
    'jquery'
], function (
    PIXI,
    gs,
    $
) {
    'use strict';

    var Circle = function () {
        this.elm = new PIXI.DisplayObjectContainer();
        this._titleStyle = {font: '400 10px "Fira Sans", sans-serif', fill: '#222222'};
        this._subtitleStyle = {font: '600 10px "Fira Sans", sans-serif', fill: '#AAAAAA'};

        return this;
    };

    Circle.prototype.draw = function (radius) {
        this.radius = radius;

        this._circle = new PIXI.Graphics();
        this.elm.addChild(this._circle);
        this._drawCircle();
        var hitRadius = Math.min(radius, 5);
        this._circle.hitArea = new PIXI.Rectangle(-hitRadius, -hitRadius, hitRadius * 2, hitRadius * 2);

        if (this.data) {
            this._drawTitle();
        }
    };

    /**
     * setup data
     * @param {object} data
     */
    Circle.prototype.setData = function (data) {
        this.data = data;
    };

    Circle.prototype._setStaticAnimation = function () {
        var d = this.radius / 10; // displace quocient

        gs.TweenMax.fromTo(
            this._circle.scale,
            0.6 + Math.random() * 0.5,
            {x: 1, y: 1},
            {x:1.2 + (0.2 * d), y:1.2 + (0.2 * d), repeat: -1, yoyo: true}
        );

        this._positionTween = new gs.TimelineMax({repeat:-1})
        .fromTo(
            this.elm,
            1 + Math.random() * 0.5,
            {x: this._x0, y: this._y0},
            {
                x: this._x0 + (-10 + Math.random() * 20) * d,
                y: this._y0 + (-10 + Math.random() * 20) * d,
                ease:gs.Linear.easeNone
            }
        ).to(
            this.elm,
            1 + Math.random() * 0.5,
            {
                x: this._x0 + (-10 + Math.random() * 20) * d,
                y: this._y0 + (-10 + Math.random() * 20) * d,
                ease:gs.Linear.easeNone
            }
        ).to(
            this.elm,
            1 + Math.random() * 0.5,
            {
                x: this._x0 + (-10 + Math.random() * 20) * d,
                y: this._y0 + (-10 + Math.random() * 20) * d,
                ease:gs.Linear.easeNone
            })
        .to(
            this.elm,
            1 + Math.random() * 0.5,
            {
                x: this._x0 + (-10 + Math.random() * 20) * d,
                y: this._y0 + (-10 + Math.random() * 20) * d,
                ease:gs.Linear.easeNone
            })
        .to(
            this.elm,
            1 + Math.random() * 0.5,
            {
                x: this._x0,
                y: this._y0,
                ease:gs.Linear.easeNone
            });
    };

    /**
     * Enables static (explore) animation mode
     */
    Circle.prototype._resumeStaticAnimation = function () {
        this.stopMoving();
        this._setStaticAnimation();
    };

    /**
    * Draws a single circle
    * @param  {number} radius circle radius
    * @param  {number} x initial position on x axis
    * @param  {number} y initial position on y axis
    * @return {DisplayObject} actual element
    */
    Circle.prototype._drawCircle = function (color) {
        if (!color) {
            color = 0x222222;
        }

        this._circle.clear();
        this._circle.beginFill(color);
        this._circle.drawCircle(0, 0, this.radius);
        this._circle.endFill();
    };

    Circle.prototype._drawTitle = function () {
        //.split('').join(String.fromCharCode(8202))
        this._title = new PIXI.Text(this.data.getName().toUpperCase(), this._titleStyle);
        this._title.x = 20;
        this._title.y = -this._title.height / 2;
        this._title.alpha = 0;

        if (this.data.getParent) {
            this._subtitle = new PIXI.Text(
                this.data.getParent().getName().toUpperCase(),
                this._subtitleStyle
            );
            this._subtitle.x = this._title.x;
            this._subtitle.y = -this._subtitle.height / 2;
            this._subtitle.alpha = 0;
        }

        this._tagTitle = new PIXI.Text(' ', {font: '200 12px "Fira Sans", sans-serif', fill: '#999999'});
        this._tagTitle.x = 10;
        this._tagTitle.y = -this._tagTitle.height - 15;
    };

    /**
     * Moves elements away from center
     */
    Circle.prototype.explode = function (radius, center) {
        if (this.elm.alpha === 0) {
            return;
        }
        center = center || {x:0, y:0};
        radius = radius || 500;

        this.implodeAlpha = this.elm.alpha;

        var angle = Math.atan2(this._y0, this._x0);
        angle += (Math.random() * Math.PI / 16) - (Math.PI / 32);

        gs.TweenMax.to(
            this.elm,
            0.2 + Math.random() * 0.15,
            {
                alpha: 0,
                x: center.x + Math.cos(angle) * (radius + 200),
                y: center.y + Math.sin(angle) * (radius + 200),
                delay: Math.random() * 0.1
            }
        );
    };

    /**
     * Recovers from explode()
     */
    Circle.prototype.implode = function () {
        gs.TweenMax.to(
            this.elm,
            0.2 + Math.random() * 0.15,
            {
                alpha: this.implodeAlpha,
                x: this._x0,
                y: this._y0,
                delay: Math.random() * 0.1,
                onComplete: this._resumeStaticAnimation.bind(this)
            }
        );
    };

    /**
     * Sets mouse over
     */
    Circle.prototype.mouseOver = function () {
        this.isOver = true;
        if (this.mouseOverCallback) {
            this.mouseOverCallback(this);
        }
    };

    /**
     * Sets mouse out
     */
    Circle.prototype.mouseOut = function () {
        this.isOver = false;
        if (this.mouseOutCallback) {
            this.mouseOutCallback(this);
        }
    };

    Circle.prototype.lightUp = function () {
        this._drawCircle(this.color);

        this.elm.addChild(this._title);
        gs.TweenMax.to(this._title, 0.2, {alpha: 1});
    };

    Circle.prototype.lightDown = function () {
        this._drawCircle();

        if (!this._textAlwaysVisible) {
            var onLightDown = function () {
                if (this._title.parent) {
                    this.elm.removeChild(this._title);
                }
            }.bind(this);
            gs.TweenMax.to(this._title, 0.2, {alpha: 0, onComplete: onLightDown});
        }
    };

    /**
     * Stops static animation and moves element with a bouncy effect
     * @param  {number} x desired x position
     * @param  {number} y desired y position
     * @return {object} Tween for chaining
     */
    Circle.prototype.moveTo = function (x, y, onComplete, extraParams) {
        this._x0 = x;
        this._y0 = y;

        var params = {x: x, y: y, overwrite: true};

        if (extraParams) {
            $.extend(params, extraParams);
        }

        if (onComplete) {
            params.onComplete = onComplete;
        }

        gs.TweenMax.to(this.elm, 0.3 + Math.random() * 0.1, params);
    };

    /**
     * Stops static movement
     */
    Circle.prototype.stopMoving = function () {
        gs.TweenMax.killTweensOf(this.elm);
        gs.TweenMax.killTweensOf(this._circle.scale);
        this.elm.x = Math.round(this.elm.x);
        this.elm.y = Math.round(this.elm.y);
    };

    return Circle;
});
