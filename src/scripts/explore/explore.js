define([
  'pixi',
  'stats',
  'explore/topic',
  'explore/circle'
], function (
  PIXI,
  Stats,
  Topic,
  Circle
) {
  'use strict';

  var Explore = function () {
    return {
      setContainer: this.setContainer.bind(this),
      init: this.init.bind(this)
    };
  };

  Explore.prototype.init = function (isDebug) {
    // FPS count for debugging
    if (isDebug) {
      this._stats = new Stats();
      this._showStats();
    }

    this._topics = [];
    this._tags = [];
    this._fakes = [];
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
    this._topicsContainer = new PIXI.DisplayObjectContainer();
    this._topicsContainer.interactive = true;
    this._topicsContainer.x = this._renderer.width / 2;
    this._topicsContainer.y = this._renderer.height / 2;
    this._stage.addChild(this._topicsContainer);

    // lines
    this._linesContainer = new PIXI.Graphics();
    this._linesContainer.x = this._topicsContainer.x;
    this._linesContainer.y = this._topicsContainer.y;
    this._stage.addChild(this._linesContainer);

    this._drawFakes();
    this._drawTopics();
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
      this._topicsContainer.addChild(circle.elm);
    }
  };

  /**
  * Draw tags on canvas
  */
  Explore.prototype._drawTags = function () {
    var seed, rSeed;
    for (var i = 0; i < 80; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = this._exploreRadius + (Math.random() * 10);

      var tag = new Circle();
      tag.draw(3, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);

      this._tags.push(tag);
      this._topicsContainer.addChild(tag.elm);
    }
  };

  /**
  * Draw topics on canvas
  */
  Explore.prototype._drawTopics = function () {
    var seed, rSeed;
    for (var i = 0; i < 30; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

      var topic = new Topic(i);
      topic.draw(
        15 - rSeed / this._exploreRadius * 12,
        Math.sin(seed) * rSeed,
        Math.cos(seed) * rSeed
      );

      this._topics.push(topic);
      this._topicsContainer.addChild(topic.elm);

      topic.elm.mouseover =
        topic.elm.touchstart =
        this._onMouseOverTopic.bind(this);

      topic.elm.mouseout =
        topic.elm.touchend =
        topic.elm.touchendoutside =
        this._onMouseOutTopic.bind(this);
    }
  };

  /**
  * Draw connecting lines
  */
  Explore.prototype._drawLines = function () {
    this._linesContainer.clear();
    var alpha = 0.3;
    var isOver = false;
    var topic;
    var related;
    for (var i = 0; i < this._topics.length; i ++) {
      topic = this._topics[i];

      for (var j = 0; j < topic.related.length; j ++) {
        related = this._topics[topic.related[j]];

        if (i !== j) {
          isOver = (topic.isOver || related.isOver);

          if (alpha !== 0.3 && isOver) {
            alpha = 0.3;
            this._linesContainer.lineStyle(1, 0x000000,  alpha);
          } else if (alpha === 0.3 && !isOver) {
            alpha = 0.05;
            this._linesContainer.lineStyle(1, 0x000000,  alpha);
          }

          this._linesContainer.moveTo(topic.elm.x, topic.elm.y);
          this._linesContainer.lineTo(related.elm.x, related.elm.y);
        }
      }
    }
  };

  Explore.prototype._onMouseOverTopic = function (event) {
    this._topics[event.target.index].isOver = true;
  };

  Explore.prototype._onMouseOutTopic = function (event) {
    this._topics[event.target.index].isOver = false;
  };

  Explore.prototype._updatePositions = function () {
    var i;

    for (i = 0; i < this._topics.length; i ++) {
      this._topics[i].update();
    }

    for (i = 0; i < this._tags.length; i ++) {
      this._tags[i].update();
    }
  };

  Explore.prototype._animate = function () {
    if (this._stats) {
      this._stats.begin();
    }

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