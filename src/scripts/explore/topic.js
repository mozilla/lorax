define(['explore/circle'], function (Circle) {
  'use strict';

  var Topic = function (index) {
    this._index = index;

    return this;
  };

  Topic.prototype = new Circle();

  Topic.prototype._superDraw = Topic.prototype.draw;
  Topic.prototype.draw = function (radius, x, y) {
    this._superDraw(radius, x, y);
    this.elm.interactive = true;
    this.elm.buttonMode = true;
    this.elm.index = this._index;

    this.related = [Math.floor(Math.random() * 30)];
  };

  Topic.prototype._superUpdate = Topic.prototype.update;
  Topic.prototype.update = function (mousePosition) {
    this._superUpdate();

    if (this.isOver) {
      this.elm.x = mousePosition.x;
      this.elm.y = mousePosition.y;

      if (Math.abs(this.elm.x - this.x0) > 40 || Math.abs(this.elm.y - this.y0) > 40) {
        this.isOver = false;
      }
    }
    // this.elm.aplha = isOver && !circle.isOver ? 0.5 : 1;
  };

  return Topic;
});