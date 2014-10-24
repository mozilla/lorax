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
    this._linesContainer.x = this._renderer.width / 2;
    this._linesContainer.y = this._renderer.height / 2;
    this._stage.addChild(this._linesContainer);

    // circles
    var dimension = Math.min(container.width(), container.height());
    this._exploreRadius = dimension / 2;
    this._issuesContainer = new PIXI.DisplayObjectContainer();
    this._issuesContainer.interactive = true;
    this._issuesContainer.x = this._renderer.width / 2;
    this._issuesContainer.y = this._renderer.height / 2;
    this._stage.addChild(this._issuesContainer);

    // topics hover areas
    this._topicsContainer = new PIXI.DisplayObjectContainer();
    this._topicsContainer.x = this._issuesContainer.x;
    this._topicsContainer.y = this._issuesContainer.y;
    this._stage.addChild(this._topicsContainer);

    this._drawFakes();
    this._drawIssues();
    this._drawTags();

    // start animation
    requestAnimationFrame(this._animate.bind(this));
  };

  Explore.prototype._clearTopics = function () {
    this._stage.removeChild(this._topicsContainer);
    this._topicsContainer = new PIXI.DisplayObjectContainer();
    this._topicsContainer.x = this._issuesContainer.x;
    this._topicsContainer.y = this._issuesContainer.y;
    this._stage.addChild(this._topicsContainer);
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
      .wait(200)
      .to({alpha:1}, 300, createjs.Ease.easeIn);

    setTimeout(function () {
      this._mode = 'explore';
    }.bind(this), 500);

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
      .to({alpha:0}, 300, createjs.Ease.easeOut)
      .wait(200)
      .to({alpha:1}, 300, createjs.Ease.easeIn);

    setTimeout(function () {
      this._mode = 'issues';
    }.bind(this), 500);

    var i;

    for (i = 0; i < this._tags.length; i ++) {
      this._tags[i].explode();
    }

    for (i = 0; i < this._fakes.length; i ++) {
      this._fakes[i].explode();
    }

    var issue;
    for(i = 0; i < this._issues.length; i ++) {
      issue = this._issues[i];
      issue.stopMoving();
      issue.setTextAlwaysVisible(true);
      issue.setIsInteractive(false);
      issue.moveTo(
        -(this._renderer.width / 2) + 150,
        -(this._renderer.height / 2) + 50 + 60 * i);
    }
  };

  /**
  * Go to topics mode
  */
  Explore.prototype.showTopics = function () {
    this._clearTopics();

    createjs.Tween.get(this._linesContainer)
      .to({alpha:0}, 300, createjs.Ease.easeOut)
      .wait(200)
      .to({alpha:1}, 300, createjs.Ease.easeIn);

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


    var topicArea;
    var radius = 70;
    var issue, centerX, centerY;
    for(i = 0; i < this._topicsData.length; i ++) {
      centerX = (this._renderer.width - 400) / (this._topicsData.length - 1) * i;
      centerX -= ((this._renderer.width - 400) / 2);
      centerY = 0;

      topicArea = new PIXI.Graphics();
      topicArea.i = i;
      topicArea.x = centerX;
      topicArea.y = centerY;
      topicArea.hitArea = new PIXI.Rectangle(-radius, -radius, radius * 2, radius * 2);
      topicArea.interactive = true;
      topicArea.buttonMode = true;
      this._topicsContainer.addChild(topicArea);
      topicArea.mouseover = topicArea.touchstart = this._onMouseOverTopic.bind(this);

      for(j = 0; j < this._topicsData[i]._issues.length; j ++) {
        issue = this._getElementFromId(this._topicsData[i]._issues[j]._id);
        issue.setTextAlwaysVisible(false);
        issue.setIsInteractive(false);
        issue.moveTo(
          centerX + (Math.random() * radius * 2) - radius,
          centerY + (Math.random() * radius * 2) - radius)
          .call(issue._resumeStaticAnimation.bind(issue));
      }
    }
  };

  /**
  * When hovering a topic
  */
  Explore.prototype._onMouseOverTopic = function (event) {
    var area = event.target;
    this._topicsContainer.removeChild(area);
    var issues = this._topicsData[area.i]._issues;

    var dist = 40;
    var issue;
    for(var i = 0; i < issues.length; i ++) {
      issue = this._getElementFromId(issues[i]._id);
      issue.moveTo(area.x, area.y + (dist * i) - (dist * issues.length / 2))
        .call(issue._resumeStaticAnimation.bind(issue));
    }

    var lineWidth = 60;
    var lineArea = new PIXI.Graphics();
    lineArea.x = area.x;
    lineArea.y = area.y;
    lineArea.interactive = true;
    lineArea.buttonMode = true;
    lineArea.hitArea = new PIXI.Rectangle(
      -lineWidth / 2,
      -dist * issues.length / 2,
      lineWidth,
      dist * issues.length);
    this._topicsContainer.addChild(lineArea);

    lineArea.mouseout = lineArea.touchend = function () {
      this._topicsContainer.removeChild(lineArea);
      this._topicsContainer.addChild(area);

      var radius = 70;
      for(var i = 0; i < issues.length; i ++) {
        issue = this._getElementFromId(issues[i]._id);
        issue.moveTo(
          area.x + (Math.random() * radius * 2) - radius,
          area.y + (Math.random() * radius * 2) - radius)
          .call(issue._resumeStaticAnimation.bind(issue));
      }
    }.bind(this);
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
    }
  };

  Explore.prototype._onIssueOver = function (event) {
    var issue = this._issues[event.target.index];
    issue.mouseOver.bind(issue)();
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
    var lineColor;
    for (i = 0; i < this._issues.length; i ++) {
      issue = this._issues[i];
      related = this._issues[i].data.getRelated();
      tags = this._issues[i].data.getTags();

      if (this._mode === 'explore' || this._mode === 'topics') {
        for (j = 0; j < related.length; j ++) {
          relatedItem = this._getElementFromId(related[j]._id);

          // only show related on same topic if on topics
          if (this._mode === 'explore' ||
            issue.data._parent._id === relatedItem.data._parent._id) {
            isOver = (issue.isOver || relatedItem.isOver);
            if (isOver) {
              lineColor = issue.isOver ? issue.color : relatedItem.color;
              this._linesContainer.lineStyle(1, lineColor,  0.3);
            } else {
              this._linesContainer.lineStyle(1, 0x000000, 0.05);
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
            this._linesContainer.lineStyle(1, lineColor,  0.3);
          } else {
            this._linesContainer.lineStyle(1, 0x000000, 0.05);
          }

          this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
          this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
        }
      }

      // connect to next in line on issues
      if (this._mode === 'issues' && i < this._issues.length - 1) {
        relatedItem = this._issues[i + 1];
        this._linesContainer.lineStyle(1, 0x000000, 0.1);
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

  /**
   * do animation cycle
   */
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