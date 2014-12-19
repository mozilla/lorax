/* global define:true */
define([
    'pixi',
    'experience/mode',
    'experience/topic',
    'experience/responsive'
], function (
    PIXI,
    Mode,
    Topic,
    Responsive
) {
    'use strict';

    var TopicsMode = function (canvas) {
        this._canvas = canvas;
        Mode.MODES.push(this);

        TopicsMode.FAKES_PER_TOPIC = 20;

        this.mouseOverB = this._onMouseOver.bind(this);
        this.mouseOutB = this._onMouseOut.bind(this);

        return this;
    };

    TopicsMode.prototype = new Mode();
    TopicsMode.prototype.constructor = TopicsMode;

    TopicsMode.prototype.setData = function (data) {
        this._topicsData = data;
    };

    TopicsMode.prototype.init = function () {
        Mode.prototype.init.call(this);
        this._topics = [];
        this._currentTopic = 0;

        this._topicsContainer = new PIXI.DisplayObjectContainer();
        this._topicsContainer.x = Math.round(this._canvas.canvasSize.x / 2);
        this._topicsContainer.y = Math.round(this._canvas.canvasSize.y / 2);

        TopicsMode.DISTANCE_BETWEEN_TOPICS = this._canvas.canvasSize.x * 0.6;

        var i;
        var j;
        var issue;
        var topic;

        for(i = 0; i < this._topicsData.length; i ++) {
            // get all issues for this topic
            var issues = [];
            for(j = 0; j < this._topicsData[i]._issues.length; j ++) {
                issue = this._canvas.getElementByData(this._topicsData[i]._issues[j]);
                issues.push(issue);
            }

            // get some random fakes for this topic
            var fakes = [];
            for(j = 0; j < TopicsMode.FAKES_PER_TOPIC; j ++) {
                issue = this._getRandomFake();
                fakes.push(issue);
            }

            // create a new topic
            topic = this._topics[i] = new Topic(this._topicsData[i], i, issues, fakes);
            this._topicsContainer.addChild(topic.elm);

            if (Responsive.IS_LARGE()) {
                topic.elm.x = (this._canvas.canvasSize.x - 400) /
                    (this._topicsData.length - 1) * i;
                topic.elm.x -= ((this._canvas.canvasSize.x - 400) / 2);
                topic.elm.y = -40;
            } else if (Responsive.IS_MEDIUM()) {
                topic.elm.x = (this._canvas.canvasSize.x - 500) * (i % 2);
                topic.elm.x -= ((this._canvas.canvasSize.x - 500) / 2);
                topic.elm.y =  (350 * Math.floor(i / 2)) - 350;
            } else {
                topic.elm.x = TopicsMode.DISTANCE_BETWEEN_TOPICS * i;
                topic.elm.y = -40;
            }

            topic.elm.x = Math.round(topic.elm.x);
            topic.elm.y = Math.round(topic.elm.y);

            topic.setup();
        }
    };

    TopicsMode.prototype._getRandomFake = function () {
        return this._canvas.fakes[Math.floor(Math.random() * this._canvas.fakes.length)];
    };

    TopicsMode.prototype._drawLines = function () {
        var i;
        var j;
        var k;
        var issue;
        var relatedItem;
        var topic;

        this._canvas.clearLines();

        for (i = 0; i < this._topics.length; i ++) {
            topic = this._topics[i];

            if (topic === this.selectedTopic) {
                for (j = 0; j < topic._issues.length - 1; j ++) {
                    issue = topic._issues[j];
                    relatedItem = topic._issues[j + 1];
                    this._canvas.drawLine(issue, relatedItem, 0x0, 0.1);
                }
            } else {
                for (j = 0; j < topic._issues.length; j ++) {
                    issue = topic._issues[j];

                    for (k = 0; k < topic._issues.length; k ++) {
                        if (j !== k) {
                            relatedItem = topic._issues[k];
                            this._canvas.drawLine(issue, relatedItem, 0x0, 0.02);
                        }
                    }
                }
            }
        }
    };

    TopicsMode.prototype._updateTopics = function () {
        for (var i = 0; i < this._topics.length; i ++) {
            this._topics[i].update(this._canvas.mousePosition);
        }
    };

    TopicsMode.prototype._onMouseOver = function (selectedTopic) {
        this.selectedTopic = selectedTopic;
        var i;
        var topic;

        // tone down other topics
        for(i = 0; i < Topic.TOPICS.length; i ++) {
            topic = Topic.TOPICS[i];
            if (topic._index !== selectedTopic._index) {
                topic.toneDown();
            }
        }
    };

    TopicsMode.prototype._onMouseOut = function (selectedTopic) {
        var i;
        var topic;

        // set other issues alpha back to 1
        for(i = 0; i < Topic.TOPICS.length; i ++) {
            topic = Topic.TOPICS[i];
            if (topic._index !== selectedTopic._index) {
                topic.endToneDown();
            }
        }

        this.selectedTopic = null;
    };

    TopicsMode.prototype._onStartShow = function () {
        this._canvas.addChild(this._topicsContainer, this._canvas._stage.getChildIndex(this._canvas._particlesContainer));

        var i;

        for (i = 0; i < this._canvas.tags.length; i ++) {
            this._canvas.tags[i].explode();
        }

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            this._canvas.fakes[i].explode();
        }

        for (i = 0; i < this._topics.length; i ++) {
            this._topics[i].show();
            this._topics[i].mouseOverS.add(this.mouseOverB);
            this._topics[i].mouseOutS.add(this.mouseOutB);
        }

        this._drawLinesBind = this._drawLines.bind(this);
        this._updateTopicsBind = this._updateTopics.bind(this);
        this._swipeToNextTopicBind = this._swipeToNextTopic.bind(this);
        this._swipeToPrevTopicBind = this._swipeToPrevTopic.bind(this);
        this._onTouchStartBind = this._onTouchStart.bind(this);
        this._canvas.renderStartS.add(this._drawLinesBind);
        this._canvas.renderStartS.add(this._updateTopicsBind);
        this._canvas.touchStartS.add(this._onTouchStartBind);
        if (Responsive.IS_SMALL()) {
            this._canvas.swipeLeftS.add(this._swipeToNextTopicBind);
            this._canvas.swipeRightS.add(this._swipeToPrevTopicBind);
        }

         setTimeout(this._onShow.bind(this), 500);
    };

    TopicsMode.prototype._onStartHide = function () {
        this._canvas.removeChild(this._topicsContainer);

        var i;
        for (i = 0; i < this._topics.length; i ++) {
            this._topics[i].hide();
            this._topics[i].mouseOverS.remove(this.mouseOverB);
            this._topics[i].mouseOutS.remove(this.mouseOutB);
        }

        this._canvas.clearLines();
        this._canvas.renderStartS.remove(this._drawLinesBind);
        this._canvas.renderStartS.remove(this._updateTopicsBind);
        this._canvas.swipeLeftS.remove(this._swipeToNextTopicBind);
        this._canvas.swipeRightS.remove(this._swipeToPrevTopicBind);

        setTimeout(this._onHide.bind(this), 100);
    };

    TopicsMode.prototype._swipeToNextTopic = function () {
        var position = new PIXI.Point();
        this._currentTopic = Math.min(this._currentTopic + 1, 3);

        var mouseOutTopic = function (topic) {
            topic._mouseOut(true);
        };

        for(var i = 0; i < this._topics.length; i ++) {
            position.x = TopicsMode.DISTANCE_BETWEEN_TOPICS * (i - this._currentTopic);
            position.y = -40;
            this._topics[i].moveTo(position.clone());
            setTimeout(mouseOutTopic, 300, this._topics[i]);
        }
    };

    TopicsMode.prototype._swipeToPrevTopic = function () {
        var position = new PIXI.Point();
        this._currentTopic = Math.max(this._currentTopic - 1, 0);

        var mouseOutTopic = function (topic) {
            topic._mouseOut(true);
        };

        for(var i = 0; i < this._topics.length; i ++) {
            position.x = TopicsMode.DISTANCE_BETWEEN_TOPICS * (i - this._currentTopic);
            position.y = -40;
            this._topics[i].moveTo(position.clone());
            setTimeout(mouseOutTopic, 300, this._topics[i]);
        }
    };

    TopicsMode.prototype._onTouchStart = function () {
        if (this.selectedTopic) {
            setTimeout(function (topic) {
                if (!topic._isMouseOver()) {
                    topic._mouseOut();
                }
            }.bind(this), 100, this.selectedTopic);
        }
    };

    return TopicsMode;
});