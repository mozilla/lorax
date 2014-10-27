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

    var colors = [0x00ae52, 0xffcc00, 0xe11313];
    this.color = colors[this.data._status];

    this._textAlwaysVisible = false;
  };

  Issue.prototype._superDraw = Issue.prototype.draw;
  /**
   * Draws an issue circle
   * @param  {number} radius desired radius
   * @param  {number} x x position
   * @param  {number} y y position
   */
  Issue.prototype.draw = function (radius, x, y) {
    this._superDraw.bind(this)(radius, x, y);
    this.elm.interactive = true;
    this.elm.buttonMode = true;
    this.isInteractive = true;
    this.elm.index = this._index;

    this.related = [Math.floor(Math.random() * 30)];
  };

  Issue.prototype.setTextAlwaysVisible = function (isVisible) {
    this._textAlwaysVisible = isVisible;

    if (isVisible && this._title.alpha !== 1) {
      this.elm.addChild(this._title);
      this._title.alpha = 0;
      createjs.Tween.get(this._title).to({alpha: 1}, 200, createjs.Ease.easeIn);
    } else if(!this.isOver) {
      createjs.Tween.get(this._title).to({alpha: 0}, 200, createjs.Ease.easeOut)
        .call(function () {
          if (this._title.parent) {
            this.elm.removeChild(this._title);
          }
        }.bind(this));
    }
  };

  Issue.prototype.setIsInteractive = function (value) {
    this.isInteractive = value;
  };

  Issue.prototype._superMouseOver = Issue.prototype.mouseOver;
  /**
   * Sets mouse over
   */
  Issue.prototype.mouseOver = function () {
    Issue.prototype._superMouseOver.bind(this)();

    this.stopMoving();
    if (!this._textAlwaysVisible) {
      this.elm.addChild(this._title);
      this._title.alpha = 0;
      createjs.Tween.get(this._title).to({alpha: 1}, 200, createjs.Ease.easeIn);
    }

    this._circle.tint = this.color;
    createjs.Tween.get(this._circle).to({tint: 0xFF0000});
  };

  Issue.prototype._superMouseOut = Issue.prototype.mouseOut;
  /**
   * Sets mouse out
   */
  Issue.prototype.mouseOut = function () {
    Issue.prototype._superMouseOut.bind(this)();

    if (!this._textAlwaysVisible) {
    createjs.Tween.get(this._title).to({alpha: 0}, 200, createjs.Ease.easeOut)
      .call(function () {
        if (this._title.parent) {
          this.elm.removeChild(this._title);
        }
      }.bind(this));
    }
  };

  /**
   * animation tick
   * @param  {Point} mousePosition current mouse position
   */
  Issue.prototype.update = function (mousePosition) {
    if (this.isOver && this.isInteractive) {
      this.elm.x = mousePosition.x;
      this.elm.y = mousePosition.y;

      var stickyRadius = 30;
      if (Math.abs(this.elm.x - this._x0) > stickyRadius ||
          Math.abs(this.elm.y - this._y0) > stickyRadius) {
        this.mouseOut();

        createjs.Tween.get(this.elm, {override: true})
        .to({x: this._x0, y: this._y0}, 500, createjs.Ease.getBackOut(2.5))
        .call(this._resumeStaticAnimation.bind(this));
      }
    }
    // this.elm.aplha = isOver && !circle.isOver ? 0.5 : 1;
  };

  return Issue;
});