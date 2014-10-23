define([
  'pixi',
  'stats',
  'createjs',
  'explore/issue',
  'explore/circle'
], function (
  PIXI,
  Stats,
  createjs,
  Issue,
  Circle
) {
  'use strict';

  var Explore = function () {
    return {
      setContainer: this.setContainer.bind(this),
      init: this.init.bind(this),
      setData: this.setData.bind(this),
      showTopics: this.showTopics.bind(this)
    };
  };

  Explore.prototype.init = function (isDebug) {
    // FPS count for debuggingg
    if (isDebug) {
      this._stats = new Stats();
      this._showStats();
    }

    this._issues = [];
    this._tags = [];
    this._fakes = [];
    this._issueData;
    this._tagData;
    this._lastTick = 0;
    this._mode = 'explore';
  };

  Explore.prototype.setData = function (data) {
    this._issueData = data.getIssues();
    this._tagData = data.getTags();
    this._topicsData = data.getTopics();
  };

  Explore.prototype.showTopics = function () {
    createjs.Tween.get(this._linesContainer)
      .to({alpha:0}, 500, createjs.Ease.easeOut)
      .wait(500)
      .to({alpha:1}, 500, createjs.Ease.easeIn);

    setTimeout(function () {
      this._mode = 'topics';
    }.bind(this), 500);

    var i, j;

    for (i = 0; i < this._tags.length; i ++) {
      this._tags[i].explode();
    }

    for (i = 0; i < this._fakes.length; i ++) {
      this._fakes[i].explode();
    }

    var topicRadius = 100;
    var issue, centerX, centerY;
    for(i = 0; i < this._topicsData.length; i ++) {
      centerX = (this._renderer.width - 400) / (this._topicsData.length - 1) * i;
      centerX -= ((this._renderer.width - 400) / 2);
      centerY = 150;
      for(j = 0; j < this._topicsData[i]._issues.length; j ++) {
        issue = this._getElementFromId(this._topicsData[i]._issues[j]._id);
        issue.moveTo(
          centerX + (Math.random() * topicRadius) - (topicRadius / 2),
          centerY + (Math.random() * topicRadius) - (topicRadius / 2));
      }
    }
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
    for (var i = 0; i < 200; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

      var circle = new Circle();
      circle.draw(1, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);
      circle.elm.alpha = 0.3;

      this._fakes.push(circle);
      this._issuesContainer.addChild(circle.elm);
    }
  };

  /**
  * Draw tags on canvas
  */
  Explore.prototype._drawTags = function () {
    var seed, rSeed;
    for (var i = 0; i < this._tagData.length * 8; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = this._exploreRadius + (Math.random() * 5);

      var tag = new Circle();
      tag.data = this._tagData[i];
      tag.draw(2, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);

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
        10 - rSeed / this._exploreRadius * 5,
        Math.sin(seed) * rSeed,
        Math.cos(seed) * rSeed
      );

      issue.exploreX = issue.elm.x;
      issue.exploreY = issue.elm.y;

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
    var isOver = false;
    var issue;
    var related;
    var tags;
    var relatedItem;
    var i, j;
    for (i = 0; i < this._issues.length; i ++) {
      issue = this._issues[i];
      related = this._issues[i].data.getRelated();
      tags = this._issues[i].data.getTags();

      for (j = 0; j < related.length; j ++) {
        relatedItem = this._getElementFromId(related[j]._id);

        if (this._mode === 'explore' ||
            issue.data._parent._id === relatedItem.data._parent._id) {

          isOver = (issue.isOver || relatedItem.isOver);
          this._linesContainer.lineStyle(1, 0x000000,  isOver ? 0.3 : 0.1);

          this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
          this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
        }
      }

      if (this._mode === 'explore') {
        for (j = 0; j < tags.length; j ++) {
          relatedItem = this._getElementFromId(tags[j]._id);

          isOver = (issue.isOver || relatedItem.isOver);
          this._linesContainer.lineStyle(1, 0x000000,  isOver ? 0.3 : 0.05);

          this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
          this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
        }
      }
    }
  };

  Explore.prototype._getElementFromId = function (id) {
    for (var i = 0; i < this._issues.length; i ++) {
      if (this._issues[i].data._id === id) {
        return this._issues[i];
      }
    }

    for (i = 0; i < this._tags.length; i ++) {
      if (this._tags[i].data._id === id) {
        return this._tags[i];
      }
    }
  };

  Explore.prototype._onMouseOverIssue = function (event) {
    this._issues[event.target.index].isOver = true;
  };

  Explore.prototype._onMouseOutIssue = function () {
    // this._issues[event.target.index].isOver = false;
  };

  Explore.prototype._updatePositions = function () {
    var i;

    var localPosition = this._stage.getMousePosition().clone();
    localPosition.x -= this._issuesContainer.x;
    localPosition.y -= this._issuesContainer.y;

    for (i = 0; i < this._issues.length; i ++) {
      this._issues[i].update(localPosition);
    }

    // for (i = 0; i < this._tags.length; i ++) {
    //   this._tags[i].update();
    // }

    // for (i = 0; i < this._fakes.length; i ++) {
    //   this._fakes[i].update();
    // }
  };

  Explore.prototype._animate = function (tick) {
    if (this._stats) {
      this._stats.begin();
    }

    createjs.Tween.tick(tick - this._lastTick);
    this._lastTick = tick;

    this._updatePositions();
    this._drawLines();
    this._renderer.render(this._stage);

    if (this._stats) {
      this._stats.end();
    }
    requestAnimationFrame(this._animate.bind(this));
  };

  return Explore;
});