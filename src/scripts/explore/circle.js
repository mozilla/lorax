define(['pixi', 'createjs'], function (PIXI, createjs) {
  'use strict';

  var Circle = function () {
    return this;
  };

  Circle.prototype.draw = function (radius, x, y) {
    this.elm = new PIXI.DisplayObjectContainer();
    this.radius = radius;

    this._circle = new PIXI.Graphics();
    this.elm.addChild(this._circle);
    this._drawCircle();
    this._circle.hitArea = new PIXI.Rectangle(-radius, -radius, radius * 2, radius * 2);
    this._circle.cacheAsBitmap = true;

    if (this.data) {
      this._drawTitle();
    }

    this.elm.x = x;
    this.elm.y = y;
    this._x0 = x;
    this._y0 = y;

    this._resumeStaticAnimation();
  };

  /**
   * setup data
   * @param {object} data
   */
  Circle.prototype.setData = function (data) {
    this.data = data;
  };

  /**
   * Enables static (explore) animation mode
   */
  Circle.prototype._resumeStaticAnimation = function () {
    var d = this.radius / 10; // displace quocient

    if (this._staticScaleTween) {
      this._staticScaleTween.setPaused(true);
    }
    this._staticScaleTween = createjs.Tween.get(
      this._circle.scale,
      {loop: true})
      .wait(Math.random() * 1000)
      .to({x:1 + (0.2 * d), y:1 + (0.2 * d)}, 500, createjs.Ease.bounceOut)
      .to({x:1, y:1}, 500, createjs.Ease.linear);

    if (this._staticPositionTween) {
      this._staticPositionTween.setPaused(true);
    }
    this._staticPositionTween = createjs.Tween.get(this.elm, {loop: true})
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
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
  Circle.prototype._drawCircle = function (color) {
    if (!color) {
      color = 0x000000;
    }

    this._circle.clear();
    this._circle.beginFill(color);
    this._circle.drawCircle(0, 0, this.radius);
    this._circle.endFill();
  };

  Circle.prototype._drawTitle = function () {
    var style = {
      font: '14px "fira-sans-regular", sans-serif'
    };

    this._title = new PIXI.Text(this.data.getName().toUpperCase(), style);
    this._title.x = this._title.y = 10;
  };

  /**
   * Moves elements away from center
   */
  Circle.prototype.explode = function (radius) {
    if (this.elm.alpha === 0) {
      return;
    }
    this.implodeAlpha = this.elm.alpha;

    var angle = Math.atan2(this._y0, this._x0);
    angle += (Math.random() * Math.PI / 16) - (Math.PI / 32);

    this.stopMoving();
    createjs.Tween.get(this.elm, {override: true})
      .wait(Math.random() * 200)
      .to(
        {
          alpha: 0,
          x: Math.cos(angle) * (radius + 200),
          y: Math.sin(angle) * (radius + 200)
        },
        (Math.random() * 150) + 300,
        createjs.easeOut);
  };

  /**
   * Recovers from explode()
   */
  Circle.prototype.implode = function () {
    this._staticPositionTween.setPaused(true);
    createjs.Tween.get(this.elm, {override: true})
      .to({alpha: this.implodeAlpha, x: this._x0, y: this._y0},
        (Math.random() * 100) + 200,
        createjs.easeIn)
      .call(this._resumeStaticAnimation.bind(this));
  };

  /**
   * Sets mouse over
   */
  Circle.prototype.mouseOver = function () {
    this.isOver = true;
  };

  /**
   * Sets mouse out
   */
  Circle.prototype.mouseOut = function () {
    this.isOver = false;
  };

  /**
   * Stops static animation and moves element with a bouncy effect
   * @param  {number} x desired x position
   * @param  {number} y desired y position
   * @return {object} Tween for chaining
   */
  Circle.prototype.moveTo = function (x, y) {
    this._x0 = x;
    this._y0 = y;

    this._staticPositionTween.setPaused(true);

    return createjs.Tween.get(this.elm, {override: true})
      .to({x:x, y:y}, (Math.random() * 100) + 600, createjs.Ease.getBackOut(1.5));
  };

  /**
   * Stops static movement
   */
  Circle.prototype.stopMoving = function () {
    this._staticScaleTween.setPaused(true);
    this._staticPositionTween.setPaused(true);
  };

  return Circle;
});