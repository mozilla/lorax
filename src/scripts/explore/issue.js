define(['explore/circle', 'pixi', 'createjs'], function (Circle, PIXI, createjs) {
  'use strict';

  var Issue = function (index, canvasSize) {
    this._index = index;
    this._canvasSize = canvasSize;
    this.elm = new PIXI.DisplayObjectContainer();

    return this;
  };

  Issue.prototype = new Circle();

  Issue.MODE_EXPLORE = 'explore';
  Issue.MODE_TOPICS = 'topics';
  Issue.MODE_ISSUES = 'issues';
  Issue.MODES = [Issue.MODE_EXPLORE, Issue.MODE_TOPICS, Issue.MODE_ISSUES];

  Issue.prototype._superSetData = Issue.prototype.setData;
  Issue.prototype.setData = function (data) {
    this.mode = Issue.MODE_EXPLORE;
    this._superSetData.bind(this)(data);

    var colors = [0x6bb94e, 0xf6c925, 0xdb3f33];
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
    x = Math.round(x);
    y = Math.round(y);

    this._superDraw.bind(this)(radius, x, y);
    this.elm.interactive = true;
    this.elm.buttonMode = true;
    this.isInteractive = true;
    this.elm.index = this._index;

    this._overCircle = new PIXI.Graphics();
    this._overCircle.cacheAsBitmap = true;
    this._overCircle.lineStyle(2, this.color);
    this._overCircle.drawCircle(0, 0, radius + 5);
    this._overCircle.scale = {x:0, y:0};
    this.elm.addChildAt(this._overCircle, 0);

    // create issue mode specific code
    // bigger, rectangular mask
    this._issueModeMask = new PIXI.Graphics();
    this._issueModeMask.beginFill(0x000000);
    this._issueModeMask.alpha = 0.1;
    this._issueModeMask.drawRect(0, 0, this.elm.stage.width, 60);
    this._issueModeMask.y = -30;

    // container for whats masked by _issueModeMask
    this._issueModeContainer = new PIXI.DisplayObjectContainer();
    this._issueModeContainer.mask = this._issueModeMask;

    // circular mask
    this._issueModeFillMask = new PIXI.Graphics();
    this._issueModeFillMask.beginFill(0xFF0000);
    this._issueModeFillMask.alpha = 0.1;
    this._issueModeFillMask.drawCircle(0, 0, this._canvasSize.x);
    this._issueModeFillMask.endFill();
    this._issueModeFillMask.scale = {x:0, y:0};
    this._issueModeContainer.addChild(this._issueModeFillMask);

    // container for whats masked by _issueModeFillMask
    this._issueModeOverContainer = new PIXI.DisplayObjectContainer();
    this._issueModeOverContainer.mask = this._issueModeFillMask;
    this._issueModeContainer.addChild(this._issueModeOverContainer);

    // color fill
    this._issueModeFiller = new PIXI.Graphics();
    this._issueModeFiller.beginFill(this.color);
    this._issueModeFiller.drawRect(0, 0, this._canvasSize.x, this._canvasSize.y);
    this._issueModeFiller.endFill();
    this._issueModeOverContainer.addChild(this._issueModeFiller);

    // white title
    var style = {font: '20px "fira-sans-regular", sans-serif', fill: '#FFFFFF'};
    this._issueModeTitle = new PIXI.Text(this.data.getName().toUpperCase(), style);
    this._issueModeTitle.x = this._title.x;
    this._issueModeTitle.y = -this._issueModeTitle.height / 2;
    this._issueModeOverContainer.addChild(this._issueModeTitle);
  };

  Issue.prototype.setMode = function (mode) {
    var lastMode = this.mode;
    this.mode = mode;

    if (mode === Issue.MODE_EXPLORE) {
      this.setTextAlwaysVisible(false);
      this.setIsInteractive(true);
    } else if (mode === Issue.MODE_TOPICS) {
      this.setTextAlwaysVisible(false);
      this.setIsInteractive(false);
    } else if (mode === Issue.MODE_ISSUES) {
      this.stopMoving();
      this.setTextAlwaysVisible(true);
      this.setIsInteractive(false);
      this._title.setStyle({font: '20px "fira-sans-regular", sans-serif'});
      this._title.y = -this._title.height / 2;
    }

    if (lastMode === Issue.MODE_ISSUES) {
      this._title.setStyle({font: '14px "fira-sans-regular", sans-serif'});
      this._title.y = -this._title.height / 2;
    }
  };

  Issue.prototype.setTextAlwaysVisible = function (isVisible) {
    this._textAlwaysVisible = isVisible;

    if (isVisible && this._title.alpha !== 1) {
      this.elm.addChild(this._title);
      this._title.alpha = 0;
      createjs.Tween.get(this._title, {override: true})
        .to({alpha: 1}, 200, createjs.Ease.easeIn);
    } else if(!this.isOver) {
      createjs.Tween.get(this._title, {override: true})
        .to({alpha: 0}, 200, createjs.Ease.easeOut)
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
      createjs.Tween.get(this._title, {override: true})
        .to({alpha: 1}, 200, createjs.Ease.easeIn);
    }

    this.lightDown();

    createjs.Tween.get(this._overCircle.scale).to(
      {x:1, y:1},
      300,
      createjs.Ease.getBackOut(2.5)
    );
  };

  Issue.prototype.issueModeMouseOver = function () {
    Issue.prototype._superMouseOver.bind(this)();

    var globalOrigin = {
      x:-this.elm.x - this.elm.parent.x,
      y:-this.elm.y - this.elm.parent.y
    };

    this._issueModeMask.x = globalOrigin.x;
    this._issueModeMask.width = this._canvasSize.x - this._issueModeMask.x;
    this._issueModeFiller.x = globalOrigin.x;
    this._issueModeFiller.y = globalOrigin.y;
    this._issueModeFiller.width = this._canvasSize.x - this._issueModeFiller.x;
    this._issueModeFiller.height = this._canvasSize.y - this._issueModeFiller.y;

    this.elm.addChild(this._issueModeContainer);
    this.elm.addChild(this._issueModeMask);

    createjs.Tween.get(this._issueModeFillMask.scale, {override: true}).to(
      {x:1, y:1},
      500,
      createjs.Ease.EaseIn
    );
  };

  Issue.prototype._superMouseOut = Issue.prototype.mouseOut;
  /**
   * Sets mouse out
   */
  Issue.prototype.mouseOut = function () {
    Issue.prototype._superMouseOut.bind(this)();

    if (!this._textAlwaysVisible) {
    createjs.Tween.get(this._title, {override: true})
      .to({alpha: 0}, 200, createjs.Ease.easeOut)
      .call(function () {
        if (this._title.parent) {
          this.elm.removeChild(this._title);
        }
      }.bind(this));
    }

    this.lightUp();

    createjs.Tween.get(this._overCircle.scale).to(
      {x:0, y:0},
      300,
      createjs.Ease.easeOut
    );
  };

  Issue.prototype.issueModeMouseOut = function () {
    Issue.prototype._superMouseOut.bind(this)();

    createjs.Tween.get(this._issueModeFillMask.scale, {override: true}).to(
      {x:0, y:0},
      400,
      createjs.Ease.EaseOut)
      .call(function () {
        this.elm.removeChild(this._issueModeContainer);
        this.elm.removeChild(this._issueModeMask);
      }.bind(this));
  };

  /**
   * animation tick
   * @param  {Point} mousePosition current mouse position
   */
  Issue.prototype.update = function (mousePosition) {
    if (this.isOver && this.isInteractive) {
      this.elm.x = Math.round(mousePosition.x);
      this.elm.y = Math.round(mousePosition.y);

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