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
        if (Responsive.IS_MEDIUM()) {
            TopicsMode.DISTANCE_BETWEEN_TOPICS /= 2;
        }

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
            topic.setCurrent(i === this._currentTopic);

            if (Responsive.IS_LARGE()) {
                topic.elm.x = (this._canvas.canvasSize.x - 400) /
                    (this._topicsData.length - 1) * i;
                topic.elm.x -= ((this._canvas.canvasSize.x - 400) / 2);
            } else {
                topic.elm.x = TopicsMode.DISTANCE_BETWEEN_TOPICS * i;
            }

            topic.elm.x = Math.round(topic.elm.x);
            topic.elm.y = -40;

            topic.setup();
        }
    };

    TopicsMode.prototype._onResize = function() {
        var position = new PIXI.Point();

        this._topicsContainer.x = Math.round(this._canvas.canvasSize.x / 2);
        this._topicsContainer.y = Math.round(this._canvas.canvasSize.y / 2);
        TopicsMode.DISTANCE_BETWEEN_TOPICS = this._canvas.canvasSize.x * 0.6;
        if (Responsive.IS_MEDIUM()) {
            TopicsMode.DISTANCE_BETWEEN_TOPICS /= 2;
        }

        for (var k = 0; k < this._topics.length; k++) {
            if (Responsive.IS_LARGE()) {
                position.x = ((this._canvas.canvasSize.x - 400) /
                              (this._topics.length - 1) * k);
                position.x -= ((this._canvas.canvasSize.x - 400) / 2);
            } else {
                position.x = TopicsMode.DISTANCE_BETWEEN_TOPICS * (k - this._currentTopic);
            }
            position.y = -40;
            this._topics[k].moveTo(position.clone());
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
        // there can be only one
        if (this.selectedTopic && this.selectedTopic._index !== selectedTopic._index) {
            this.selectedTopic._mouseOut();
        }

        this.selectedTopic = selectedTopic;
    };

    TopicsMode.prototype._onMouseOut = function (selectedTopic) {
        this.selectedTopic = null;
    };

    TopicsMode.prototype._focusIssue = function(issue) {
        issue.topic._mouseOver(true);
    };

    TopicsMode.prototype._blurIssue = function(issue) {
        issue.topic._mouseOut(true);
    };

    TopicsMode.prototype._onStartShow = function () {
        this._canvas.addChild(this._topicsContainer, this._canvas._stage.getChildIndex(this._canvas._particlesContainer));

        var i, k;

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            this._canvas.fakes[i].explode();
        }

        for (i = 0; i < this._topics.length; i ++) {
            var topic = this._topics[i];
            topic.show();
            topic.mouseOverS.add(this.mouseOverB);
            topic.mouseOutS.add(this.mouseOutB);

            for (k = 0; k < topic._issues.length; k++) {
                var issue = topic._issues[k];

                // Append issue to DOM for keyboard navigation.
                this._canvas.appendDomIssue(issue);

                // Bind signal handlers.
                issue.topicsFocus = this._focusIssue.bind(this);
                issue.topicsBlur = this._blurIssue.bind(this);
                issue.focusS.add(issue.topicsFocus);
                issue.blurS.add(issue.topicsBlur);
            }
        }

        this._drawLinesBind = this._drawLines.bind(this);
        this._updateTopicsBind = this._updateTopics.bind(this);
        this._swipeToNextTopicBind = this._swipeToNextTopic.bind(this);
        this._swipeToPrevTopicBind = this._swipeToPrevTopic.bind(this);
        this._onTouchStartBind = this._onTouchStart.bind(this);
        this._onResizeBind = this._onResize.bind(this);
        this._canvas.renderStartS.add(this._drawLinesBind);
        this._canvas.renderStartS.add(this._updateTopicsBind);
        this._canvas.touchStartS.add(this._onTouchStartBind);
        this._canvas.resizeS.add(this._onResizeBind);
        if (Responsive.IS_SMALL() || Responsive.IS_MEDIUM()) {
            this._canvas.swipeLeftS.add(this._swipeToNextTopicBind);
            this._canvas.swipeRightS.add(this._swipeToPrevTopicBind);
        }

        setTimeout(this._onShow.bind(this), 500);
    };

    TopicsMode.prototype._onStartHide = function () {
        this._canvas.removeChild(this._topicsContainer);

        var i, k;
        for (i = 0; i < this._topics.length; i ++) {
            var topic = this._topics[i];
            topic.hide();
            topic.mouseOverS.remove(this.mouseOverB);
            topic.mouseOutS.remove(this.mouseOutB);

            for (k = 0; k < topic._issues.length; k++) {
                var issue = topic._issues[k];

                // Remove signal handlers.
                issue.focusS.remove(issue.topicsFocus);
                issue.blurS.remove(issue.topicsBlur);
            }
        }

        this._canvas.clearLines();
        this._canvas.renderStartS.remove(this._drawLinesBind);
        this._canvas.renderStartS.remove(this._updateTopicsBind);
        this._canvas.swipeLeftS.remove(this._swipeToNextTopicBind);
        this._canvas.swipeRightS.remove(this._swipeToPrevTopicBind);
        this._canvas.resizeS.remove(this._onResizeBind);

        setTimeout(this._onHide.bind(this), 100);

        this._canvas.clearDomIssues();
    };

    TopicsMode.prototype._swipeToNextTopic = function () {
        if (Responsive.IS_SMALL()) {
            var position = new PIXI.Point();
            this._currentTopic = Math.min(this._currentTopic + 1, 3);
            this._topics[this._currentTopic].setCurrent();

            var mouseOutTopic = function (topic) {
                topic._mouseOut(true);
            };

            for(var i = 0; i < this._topics.length; i ++) {
                position.x = TopicsMode.DISTANCE_BETWEEN_TOPICS * (i - this._currentTopic);
                position.y = -40;
                this._topics[i].moveTo(position.clone());
                setTimeout(mouseOutTopic, 300, this._topics[i]);
                this._topics[i].setCurrent(i === this._currentTopic);
            }
        }
    };

    TopicsMode.prototype._swipeToPrevTopic = function () {
        if (Responsive.IS_SMALL()) {
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
                this._topics[i].setCurrent(i === this._currentTopic);
            }
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
