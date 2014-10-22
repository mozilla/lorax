define(['pixi', 'createjs'], function (PIXI, createjs) {
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
    this._x0 = x;
    this._y0 = y;

    this._scaleStaticTween = createjs.Tween.get(this.elm.scale, {loop: true})
      .wait(Math.random() * 1000)
      .to({x:1.2, y:1.2}, 500, createjs.Ease.bounceOut)
      .to({x:1, y:1}, 500, createjs.Ease.linear);

    this._posStaticTween = createjs.Tween.get(this.elm, {loop: true})
      .to({x: x - 10 + Math.random() * 20, y: y - 10 + Math.random() * 20}, 1000 + Math.random() * 500, createjs.sineInOut)
      .to({x: x - 10 + Math.random() * 20, y: y - 10 + Math.random() * 20}, 1000 + Math.random() * 500, createjs.sineInOut)
      .to({x: x - 10 + Math.random() * 20, y: y - 10 + Math.random() * 20}, 1000 + Math.random() * 500, createjs.sineInOut)
      .to({x: x - 10 + Math.random() * 20, y: y - 10 + Math.random() * 20}, 1000 + Math.random() * 500, createjs.sineInOut)
      .to({x: x, y: y}, 1000 + Math.random() * 500, createjs.sineInOut);
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

  return Circle;
});