define([
  'pixi',
  'stats',
  'explore/issue',
  'explore/circle'
], function (
  PIXI,
  Stats,
  Issue,
  Circle
) {
  'use strict';

  var Explore = function () {
    return {
      setContainer: this.setContainer.bind(this),
      init: this.init.bind(this),
      setIssues: this.setIssues.bind(this),
      setTags: this.setTags.bind(this)
    };
  };

  Explore.prototype.init = function (isDebug) {
    // FPS count for debugging
    if (isDebug) {
      this._stats = new Stats();
      this._showStats();
    }

    this._issues = [];
    this._tags = [];
    this._fakes = [];
    this._issueData;
    this._tagData;
  };

  Explore.prototype.setIssues = function (data) {
    this._issueData = data;
  };

  Explore.prototype.setTags = function (data) {
    this._tagData = data;
  };

  /**
  * Sets HTML element for PIXI container
  * @param  {object} DOM object
  */
  Explore.prototype.setContainer = function (container) {
    // create pixijs renderer and stage
    this._renderer = new PIXI.CanvasRenderer(
      container.width(),
      container.height(),
      null, true, true);
    this._stage = new PIXI.Stage();
    this._stage.interactive = true;
    container.append(this._renderer.view);

    // circles
    var smallerDimension = Math.min(container.width(), container.height());
    this._exploreRadius = smallerDimension / 1.8;
    this._issuesContainer = new PIXI.DisplayObjectContainer();
    this._issuesContainer.interactive = true;
    this._issuesContainer.x = this._renderer.width / 2;
    this._issuesContainer.y = this._renderer.height / 2;
    this._stage.addChild(this._issuesContainer);

    // lines
    this._linesContainer = new PIXI.Graphics();
    this._linesContainer.x = this._issuesContainer.x;
    this._linesContainer.y = this._issuesContainer.y;
    this._stage.addChild(this._linesContainer);

    this._drawFakes();
    this._drawIssues();
    this._drawTags();

    // start animation
    requestAnimationFrame(this._animate.bind(this));
  };

  /**
  * Shows FPS count
  */
  Explore.prototype._showStats = function () {
    this._stats.setMode(0);
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left = '0px';
    this._stats.domElement.style.top = '0px';
    document.body.appendChild(this._stats.domElement);
  };

  /**
  * Draw dull circles on canvas
  */
  Explore.prototype._drawFakes = function () {
    var seed, rSeed;
    for (var i = 0; i < 80; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

      var circle = new Circle();
      circle.draw(3, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);
      circle.elm.alpha = 0.5;

      this._fakes.push(circle);
      this._issuesContainer.addChild(circle.elm);
    }
  };

  /**
  * Draw tags on canvas
  */
  Explore.prototype._drawTags = function () {
    var seed, rSeed;
    for (var i = 0; i < this._tagData.length; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = this._exploreRadius + (Math.random() * 10);

      var tag = new Circle();
      tag.data = this._tagData[i];
      tag.draw(3, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);

      this._tags.push(tag);
      this._issuesContainer.addChild(tag.elm);
    }
  };

  /**
  * Draw issues on canvas
  */
  Explore.prototype._drawIssues = function () {
    var seed, rSeed;
    for (var i = 0; i < this._issueData.length; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

      var issue = new Issue(i);
      issue.data = this._issueData[i];
      issue.draw(
        15 - rSeed / this._exploreRadius * 12,
        Math.sin(seed) * rSeed,
        Math.cos(seed) * rSeed
      );

      this._issues.push(issue);
      this._issuesContainer.addChild(issue.elm);

      issue.elm.mouseover =
        issue.elm.touchstart =
        this._onMouseOverIssue.bind(this);

      issue.elm.mouseout =
        issue.elm.touchend =
        issue.elm.touchendoutside =
        this._onMouseOutIssue.bind(this);
    }
  };

  /**
  * Draw connecting lines
  */
  Explore.prototype._drawLines = function () {
    this._linesContainer.clear();
    var alpha = 0.3;
    var isOver = false;
    var issue;
    var related;
    for (var i = 0; i < this._issues.length; i ++) {
      issue = this._issues[i];

      for (var j = 0; j < issue.related.length; j ++) {
        related = this._issues[issue.related[j]];

        if (i !== j) {
          isOver = (issue.isOver || related.isOver);

          if (alpha !== 0.3 && isOver) {
            alpha = 0.3;
            this._linesContainer.lineStyle(1, 0x000000,  alpha);
          } else if (alpha === 0.3 && !isOver) {
            alpha = 0.05;
            this._linesContainer.lineStyle(1, 0x000000,  alpha);
          }

          this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
          this._linesContainer.lineTo(related.elm.x, related.elm.y);
        }
      }
    }
  };

  Explore.prototype._onMouseOverIssue = function (event) {
    this._issues[event.target.index].isOver = true;
  };

  Explore.prototype._onMouseOutIssue = function (event) {
    this._issues[event.target.index].isOver = false;
  };

  Explore.prototype._updatePositions = function () {
    var i;

    var localPosition = this._stage.getMousePosition().clone();
    localPosition.x -= this._issuesContainer.x;
    localPosition.y -= this._issuesContainer.y;
    for (i = 0; i < this._issues.length; i ++) {
      this._issues[i].update(localPosition);
    }

    for (i = 0; i < this._tags.length; i ++) {
      //this._tags[i].update();
    }

    for (i = 0; i < this._fakes.length; i ++) {
      //this._fakes[i].update();
    }
  };

  Explore.prototype._animate = function () {
    if (this._stats) {
      this._stats.begin();
    }

    this._updatePositions();
    // this._drawLines();
    this._renderer.render(this._stage);

    if (this._stats) {
      this._stats.end();
    }
    requestAnimationFrame(this._animate.bind(this));
  };

  return Explore;
});