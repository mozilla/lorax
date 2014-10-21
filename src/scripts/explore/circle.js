define(['pixi'], function (PIXI) {
  'use strict';

  var Circle = function () {
    return this;
  };

  Circle.prototype.draw = function (radius, x, y) {
    this.elm = new PIXI.DisplayObjectContainer();

    this._circle = this._drawCircle(radius, x, y);
    this.elm.addChild(this._circle);

    this.elm.x = x;
    this.elm.y = y;

    // t = time
    // p = phase
    // a = amplitude
    this.x0 = x;
    this.y0 = y;
    this.aX = (Math.random() * 5) + 4;
    this.pX = (Math.random() * Math.PI / 2);
    this.tX = Math.random() * 100;
    this.aY = (Math.random() * 5) + 4;
    this.pY = (Math.random() * Math.PI / 2);
    this.tY = Math.random() * 100;
    this.pA = Math.random() + 0.1;
    this.tA = Math.random() * 100;
    this.x1 = x;
    this.y1 = y;
    this.x2 = x;
    this.y2 = y;
  };

  /**
  * Draws a single circle
  * @param  {number} radius circle radius
  * @param  {number} x initial position on x axis
  * @param  {number} y initial position on y axis
  * @return {DisplayObject} actual element
  */
  Circle.prototype._drawCircle = function (radius) {
    var circle = new PIXI.Graphics();
    circle.beginFill(0x000000);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    circle.hitArea = new PIXI.Rectangle(-radius, -radius, radius * 2, radius * 2);
    circle.cacheAsBitmap = true;
    return circle;
  };

  Circle.prototype.update = function () {
    this.tX += this.pX;
    this.tY += this.pY;
    this.tA += this.pA;
    this.x1 += (this.x0 + Math.sin(this.tX * Math.PI / 180) * this.aX - this.x1) / 2;
    this.y1 += (this.y0 + Math.sin(this.tY * Math.PI / 180) * this.aY - this.y1) / 2;
    this.x2 += (this.x1 - this.elm.x) * 0.2;
    this.y2 += (this.y1 - this.elm.y) * 0.2;
    this.elm.x += (this.x2 - this.elm.x) / 5;
    this.elm.y += (this.y2 - this.elm.y) / 5;
    var scaleFactor = 1.0 - (0.05 * (Math.sin(this.tA * Math.PI / 180) + Math.sin(this.tA * Math.PI / 60)));
    this._circle.scale = new PIXI.Point(scaleFactor, scaleFactor);
  };

  return Circle;
});