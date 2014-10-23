define(['explore/circle', 'createjs'], function (Circle, createjs) {
  'use strict';

  var Issue = function (index) {
    this._index = index;

    return this;
  };

  Issue.prototype = new Circle();

  Issue.prototype._superDraw = Issue.prototype.draw;
  Issue.prototype.draw = function (radius, x, y) {
    this._superDraw(radius, x, y);
    this.elm.interactive = true;
    this.elm.buttonMode = true;
    this.elm.index = this._index;

    this.related = [Math.floor(Math.random() * 30)];
  };

  Issue.prototype.update = function (mousePosition) {
    if (this.isOver) {
      this.elm.x = mousePosition.x;
      this.elm.y = mousePosition.y;

      if (Math.abs(this.elm.x - this._x0) > 50 || Math.abs(this.elm.y - this._y0) > 50) {
        this.isOver = false;
        createjs.Tween.get(this.elm, {override: true})
        .to({x: this._x0, y: this._y0}, 500, createjs.Ease.elasticOut)
        .call(this._doStaticAnimation.bind(this));
      }
    }
    // this.elm.aplha = isOver && !circle.isOver ? 0.5 : 1;
  };

  return Issue;
});