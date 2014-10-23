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

    this._doStaticAnimation();
  };

  Circle.prototype.setData = function (data) {
    this.data = data;
  };

  Circle.prototype._doStaticAnimation = function () {
    createjs.Tween.get(this.elm.scale, {loop: true, override: true})
      .wait(Math.random() * 1000)
      .to({x:1.2, y:1.2}, 500, createjs.Ease.bounceOut)
      .to({x:1, y:1}, 500, createjs.Ease.linear);

    this._tween = createjs.Tween.get(this.elm, {loop: true, override: true})
      .to({x: this._x0 - 10 + Math.random() * 20, y: this._y0 - 10 + Math.random() * 20},
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({x: this._x0 - 10 + Math.random() * 20, y: this._y0 - 10 + Math.random() * 20},
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({x: this._x0 - 10 + Math.random() * 20, y: this._y0 - 10 + Math.random() * 20},
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({x: this._x0 - 10 + Math.random() * 20, y: this._y0 - 10 + Math.random() * 20},
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({x: this._x0, y: this._y0}, 1000 + Math.random() * 500, createjs.sineInOut);
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
    // var circle = PIXI.Sprite.fromImage('images/circle.png');
    // circle.width = circle.height = radius * 2;
    // circle.x = circle.y = -radius;
    // return circle;
  };

  Circle.prototype.explode = function () {
    var angle = Math.atan2(this.elm.y, this.elm.x);
    angle += (Math.random() * Math.PI / 16) - (Math.PI / 32);

    createjs.Tween.get(this.elm, {override: true})
      .wait(Math.random() * 200)
      .to({alpha: 0, x: Math.cos(angle) * 500, y: Math.sin(angle) * 500},
        (Math.random() * 500) + 500,
        createjs.easeOut);
  };

  Circle.prototype.mouseOver = function () {
    this.isOver = true;
  };

  Circle.prototype.mouseOut = function () {
    this.isOver = false;
  };

  Circle.prototype.moveTo = function (x, y) {
    this._x0 = x;
    this._y0 = y;

    this._tween.setPaused(true);

    createjs.Tween.get(this.elm, {override: true})
      .to({x:x, y:y}, (Math.random() * 300) + 500, createjs.Ease.getBackOut(1.5))
      .call(this._doStaticAnimation.bind(this));
  };

  return Circle;
});