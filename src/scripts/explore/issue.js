define(['explore/circle', 'createjs'], function (Circle, createjs) {
  'use strict';

  var Issue = function (index) {
    this._index = index;

    return this;
  };

  Issue.prototype = new Circle();

  Issue.prototype._superSetData = Issue.prototype.setData;
  Issue.prototype.setData = function (data) {
    this._superSetData.bind(this)(data);

    var colors = [0x00ff00, 0xffff00, 0xff0000];
    this.color = colors[this.data._status];
  };

  Issue.prototype._superDraw = Issue.prototype.draw;
  Issue.prototype.draw = function (radius, x, y) {
    this._superDraw.bind(this)(radius, x, y);
    this.elm.interactive = true;
    this.elm.buttonMode = true;
    this.elm.index = this._index;

    this.related = [Math.floor(Math.random() * 30)];
  };

  Issue.prototype._superMouseOver = Issue.prototype.mouseOver;
  Issue.prototype.mouseOver = function () {
    Issue.prototype._superMouseOver.bind(this)();
    this._circle.tint = this.color;
    //createjs.Tween.get(this._circle).to({tint: 0xFF0000});
  };

  Issue.prototype.update = function (mousePosition) {
    if (this.isOver) {
      this.elm.x = mousePosition.x;
      this.elm.y = mousePosition.y;

      if (Math.abs(this.elm.x - this._x0) > 50 || Math.abs(this.elm.y - this._y0) > 50) {
        this.isOver = false;
        createjs.Tween.get(this.elm, {override: true})
        .to({x: this._x0, y: this._y0}, 500, createjs.Ease.getBackOut(2.5))
        .call(this._doStaticAnimation.bind(this));
      }
    }
    // this.elm.aplha = isOver && !circle.isOver ? 0.5 : 1;
  };

  return Issue;
});