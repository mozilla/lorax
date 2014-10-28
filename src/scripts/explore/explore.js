define([
  'pixi',
  'stats',
  'createjs',
  'explore/issue',
  'explore/circle',
  'explore/topic'
], function (
  PIXI,
  Stats,
  createjs,
  Issue,
  Circle,
  Topic
) {
  'use strict';

  var Explore = function () {
    return {
      setContainer: this.setContainer.bind(this),
      init: this.init.bind(this),
      setData: this.setData.bind(this),
      showExplore: this.showExplore.bind(this),
      showTopics: this.showTopics.bind(this),
      showIssues: this.showIssues.bind(this)
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
    this._topics = [];

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

  /**
  * Sets HTML element for PIXI container
  * @param  {object} DOM object
  */
  Explore.prototype.setContainer = function (container) {
    // create pixijs renderer and stage
    this._renderer = new PIXI.CanvasRenderer(
      container.width(),
      container.height(),
      null, true, false);
    this._stage = new PIXI.Stage();
    this._stage.interactive = true;
    container.append(this._renderer.view);

    // lines
    this._linesContainer = new PIXI.Graphics();
    this._linesContainer.x = Math.round(this._renderer.width / 2);
    this._linesContainer.y = Math.round(this._renderer.height / 2);
    this._stage.addChild(this._linesContainer);

    // circles
    var dimension = Math.min(container.width(), container.height());
    this._exploreRadius = dimension / 2;
    this._issuesContainer = new PIXI.DisplayObjectContainer();
    this._issuesContainer.interactive = true;
    this._issuesContainer.x = this._linesContainer.x;
    this._issuesContainer.y = this._linesContainer.y;
    this._stage.addChild(this._issuesContainer);

    // topics hover areas
    this._topicsContainer = new PIXI.DisplayObjectContainer();
    this._topicsContainer.x = this._linesContainer.x;
    this._topicsContainer.y = this._linesContainer.y;
    this._stage.addChild(this._topicsContainer);

    this._drawFakes();
    this._drawIssues();
    this._drawTags();

    // start animation
    requestAnimationFrame(this._animate.bind(this));
  };

  Explore.prototype._clearTopics = function () {
    this._stage.removeChild(this._topicsContainer);

    for(var i = 0; i < this._issues.length; i ++) {
      createjs.Tween.get(this._issues[i].elm, {override: true})
        .to({alpha: 1}, 300, createjs.Ease.easeIn);
    }
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
  * Go to explore mode
  */
  Explore.prototype.showExplore = function () {
    this._clearTopics();

    createjs.Tween.get(this._linesContainer)
      .to({alpha:0}, 300, createjs.Ease.easeOut)
      .to({alpha:1}, 300, createjs.Ease.easeIn);

    setTimeout(function () {
      this._mode = 'explore';
    }.bind(this), 300);

    var i, issue;
    for (i = 0; i < this._issues.length; i ++) {
      issue = this._issues[i];
      issue.setTextAlwaysVisible(false);
      issue.setIsInteractive(true);
      issue.moveTo(issue.exploreX, issue.exploreY)
        .call(issue._resumeStaticAnimation.bind(issue));
    }

    for (i = 0; i < this._tags.length; i ++) {
      this._tags[i].implode();
    }

    for (i = 0; i < this._fakes.length; i ++) {
      this._fakes[i].implode();
    }
  };

  /**
  * Go to issues mode
  */
  Explore.prototype.showIssues = function () {
    this._clearTopics();

    createjs.Tween.get(this._linesContainer)
      .to({alpha:0}, 400, createjs.Ease.easeOut)
      .to({alpha:1}, 400, createjs.Ease.easeIn);

    setTimeout(function () {
      this._mode = 'issues';
    }.bind(this), 400);

    var i;
    for (i = 0; i < this._tags.length; i ++) {
      this._tags[i].explode(this._exploreRadius);
    }

    for (i = 0; i < this._fakes.length; i ++) {
      this._fakes[i].explode(this._exploreRadius);
    }

    var issue;
    for(i = 0; i < this._issues.length; i ++) {
      issue = this._issues[i];
      issue.stopMoving();
      issue.setTextAlwaysVisible(true);
      issue.setIsInteractive(false);
      issue.moveTo(
        -(this._renderer.width / 2) + 150,
        -(this._renderer.height / 2) + 150 + 60 * i);
    }
  };

  /**
  * Go to topics mode
  */
  Explore.prototype.showTopics = function () {
    createjs.Tween.get(this._linesContainer)
      .to({alpha:0}, 400, createjs.Ease.easeOut)
      .to({alpha:1}, 400, createjs.Ease.easeIn);

    setTimeout(function () {
      this._mode = 'topics';
    }.bind(this), 400);

    this._stage.addChild(this._topicsContainer);

    var i, j, issue;

    for (i = 0; i < this._tags.length; i ++) {
      this._tags[i].explode(this._exploreRadius);
    }

    for (i = 0; i < this._fakes.length; i ++) {
      this._fakes[i].explode(this._exploreRadius);
    }

    for(i = 0; i < this._topicsData.length; i ++) {
      if (!this._topics[i]) {
        // get issue elements for topic
        var issues = [];
        for(j = 0; j < this._topicsData[i]._issues.length; j ++) {
          issue = this._getElementFromId(this._topicsData[i]._issues[j]._id);
          issues.push(issue);
        }

        this._topics[i] = new Topic(this._topicsData[i], i, issues);
        this._topicsContainer.addChild(this._topics[i].elm);
        this._topics[i].elm.x = (this._renderer.width - 400);
        this._topics[i].elm.x /= (this._topicsData.length - 1) / i;
        this._topics[i].elm.x -= ((this._renderer.width - 400) / 2);
        this._topics[i].elm.y = 0;

        this._topics[i].elm.x = Math.round(this._topics[i].elm.x);

        this._topics[i].setup();
      }

      this._topics[i].show();
    }
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
    for (var i = 0; i < this._tagData.length; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = this._exploreRadius + (Math.random() * 5);

      var tag = new Circle();
      tag.setData(this._tagData[i]);
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
      issue.setData(this._issueData[i]);
      issue.draw(
        10 - rSeed / this._exploreRadius * 5,
        Math.sin(seed) * rSeed,
        Math.cos(seed) * rSeed
      );

      issue.exploreX = issue.elm.x;
      issue.exploreY = issue.elm.y;

      this._issues.push(issue);
      this._issuesContainer.addChild(issue.elm);

      issue.elm.mouseover = issue.elm.touchstart = this._onIssueOver.bind(this);
      issue.elm.mouseout = issue.elm.touchend = this._onIssueOut.bind(this);
    }
  };

  Explore.prototype._onIssueOver = function (event) {
    var issue = this._issues[event.target.index];
    var related, relatedIssue;

    if (this._mode !== 'issues') {
      issue.mouseOver.bind(issue)();

      related = issue.data.getRelated();
      for(var i = 0; i < related.length; i ++) {
        relatedIssue = this._getElementFromId(related[i]._id);
        if (issue.data.getStatus() === relatedIssue.data.getStatus()) {
          relatedIssue.lightUp();
        } else {
          relatedIssue.lightDown();
        }
      }
    } else {
      issue.issueModeMouseOver.bind(issue)();
    }
  };

  Explore.prototype._onIssueOut = function (event) {
    var issue = this._issues[event.target.index];
    var related, relatedIssue;

    if (this._mode !== 'issues') {
      if (!issue.isInteractive) {
        issue.mouseOut.bind(issue)();
      }

      related = issue.data.getRelated();
      for(var i = 0; i < related.length; i ++) {
        relatedIssue = this._getElementFromId(related[i]._id);
        relatedIssue.lightDown();
      }
    } else {
      issue.issueModeMouseOut.bind(issue)();
    }
  };

  /**
  * Draw connecting lines
  */
  Explore.prototype._drawLines = function () {
    this._linesContainer.clear();
    var isOver, isSameTopic, isSameStatus, isTopicOver;
    var issue;
    var related;
    var tags;
    var relatedItem;
    var i, j;
    var lineColor;
    for (i = 0; i < this._issues.length; i ++) {
      issue = this._issues[i];
      related = this._issues[i].data.getRelated();
      tags = this._issues[i].data.getTags();

      if (this._mode === 'explore' || this._mode === 'topics') {
        for (j = 0; j < related.length; j ++) {
          relatedItem = this._getElementFromId(related[j]._id);

          isOver = (issue.isOver || relatedItem.isOver);
          isSameTopic = issue.data._parent._id === relatedItem.data._parent._id;
          isSameStatus = issue.data.getStatus() === relatedItem.data.getStatus();
          isTopicOver = (this._mode === 'topics' && isOver);
          // only show related on same topic if on topics
          if (this._mode === 'explore' || isSameTopic || isTopicOver) {
            if (isOver) {
              lineColor = issue.isOver ? issue.color : relatedItem.color;
              if (!isSameStatus) {
                lineColor = 0x000000;
              }
              this._linesContainer.lineStyle(1, lineColor,  0.15);
            } else {
              this._linesContainer.lineStyle(1, 0x000000, 0.03);
            }

            this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
            this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
          }
        }
      }

      // connect to tags on explore
      if (this._mode === 'explore') {
        for (j = 0; j < tags.length; j ++) {
          relatedItem = this._getElementFromId(tags[j]._id);

          isOver = (issue.isOver || relatedItem.isOver);
          if (isOver) {
            lineColor = issue.isOver ? issue.color : relatedItem.color;
            this._linesContainer.lineStyle(1, lineColor,  0.15);
          } else {
            this._linesContainer.lineStyle(1, 0x000000, 0.03);
          }

          this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
          this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
        }
      }

      // connect to next in line on issues
      if (this._mode === 'issues' && i < this._issues.length - 1) {
        relatedItem = this._issues[i + 1];
        this._linesContainer.lineStyle(1, 0x000000, 0.15);
        this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
        this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
      }
    }
  };

  /**
  * Get visual element from id
  */
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

  /**
   * update issue positions
   */
  Explore.prototype._updatePositions = function (mousePosition) {
    for (var i = 0; i < this._issues.length; i ++) {
      this._issues[i].update(mousePosition);
    }
  };

  Explore.prototype._updateTopics = function (mousePosition) {
    for (var i = 0; i < this._topics.length; i ++) {
      this._topics[i].update(mousePosition);
    }
  };

  /**
   * do animation cycle
   */
  Explore.prototype._animate = function (tick) {
    if (this._stats) {
      this._stats.begin();
    }

    createjs.Tween.tick(tick - this._lastTick);
    this._lastTick = tick;

    // mouse position relative to issues container
    var mousePosition = this._stage.getMousePosition().clone();
    mousePosition.x -= this._issuesContainer.x;
    mousePosition.y -= this._issuesContainer.y;

    this._updatePositions(mousePosition);

    if (this._mode === 'topics') {
      this._updateTopics(mousePosition);
    }

    this._drawLines();
    this._renderer.render(this._stage);

    if (this._stats) {
      this._stats.end();
    }
    requestAnimationFrame(this._animate.bind(this));
  };

  return Explore;
});