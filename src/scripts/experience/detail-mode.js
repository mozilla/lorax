/* global define:true */
define([
    'pixi',
    'experience/mode',
    'experience/issue'
], function (
    PIXI,
    Mode,
    Issue
) {
    'use strict';

    var DetailMode = function (canvas) {
        this._canvas = canvas;
        Mode.MODES.push(this);

        this._detailContainer = new PIXI.DisplayObjectContainer();

        return this;
    };

    DetailMode.prototype = new Mode();
    DetailMode.prototype.constructor = DetailMode;

    DetailMode.prototype.init = function () {
        Mode.prototype.init.call(this);
        var i;
        var issue;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.detailOffset = Math.random() * (this._canvas.canvasSize.x / 30);
            issue.detailOffset -= this._canvas.canvasSize.x / 60;
        }

        this._detailContainer.x = Math.round(this._canvas.canvasSize.x / 2);
        this._detailContainer.y = Math.round(this._canvas.canvasSize.y / 2);
    };

    DetailMode.prototype.onScroll = function (offset) {
        var i;
        var issue;
        var position;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            position = this._getIssuePosition(issue, offset);
            issue.elm.x = position.x;
            issue.elm.y = position.y;
            issue.elm.alpha = 1;
        }

        var topic;
        var before;
        var after;
        for (var item in this._topicElms) {
            if (this._topicElms.hasOwnProperty(item)) {
                topic = this._topicElms[item];
                before = offset < topic._startY;
                after = topic._endY !== undefined && offset >= topic._endY;
                topic.alpha = (before || after) ? 0 : 1;
            }
        }
    };

    DetailMode.prototype.setTopics = function (data) {
        this._topics = data;
    };

    DetailMode.prototype.setTopicMenuPositions = function (positions) {
        var lastTopic;
        var topic;
        var position;

        this._topicElms = {};

        // draw elements
        for (var i = 0; i < this._topics.length; i ++) {
            topic = new PIXI.Graphics();
            topic.data = this._topics[i];
            topic.elm = topic;
            this._topicElms[this._topics[i].getId()] = topic;
            this._detailContainer.addChild(topic);
        }

        // var topicOffset;
        // set elements position
        for (var item in positions) {
            if (positions.hasOwnProperty(item)) {
                position = positions[item];
                topic = this._topicElms[item];
                topic.x = topic._x0 = position.x;
                topic.y = topic._y0 = position.y;
                // topicOffset = topic._y0 - this._topics[0].getIssues()[0].offset.top;
                if (topic.data.getIssues()[0].offset) {
                    topic._startY = topic.data.getIssues()[0].offset.top - 138;
                    if (lastTopic) {
                        lastTopic._endY = topic._startY;
                    }
                    lastTopic = topic;
                }
            }
        }
    };

    DetailMode.prototype._getIssuePosition = function (issue, offset) {
        if (!offset) {
            offset = 0;
        }

        var position = {x: 0, y: 0};
        // relative vertical position
        position.y = issue.data.titleOffset.top - offset;
        position.y -= this._canvas.canvasSize.y / 2;

        // 0 -> 1
        var offsetPercent = (position.y + (this._canvas.canvasSize.y / 2)) / this._canvas.canvasSize.y;
        // 1 -> 0 -> 1
        offsetPercent = (6 * Math.pow(offsetPercent, 2)) - (6 * offsetPercent) + 1;
        //offsetPercent = Math.max(Math.min(offsetPercent, 1), 0);
        offsetPercent = Math.max(offsetPercent, 0);

        // relative horizontal position based on offset
        position.x = issue.detailOffset * offsetPercent;
        position.x += issue.data.titleOffset.left - (this._canvas.canvasSize.x / 2);

        // align text
        // position.x -= 20;
        // position.y += 10;

        // round it
        position.x = Math.round(position.x);
        position.y = Math.round(position.y);

        return position;
    };

    DetailMode.prototype._drawLines = function () {
        this._canvas.clearLines();

        var i;
        var j;
        var issue;
        var topic;
        var topicElm;

        this._canvas.clearLines();

        if (this._topicElms) {
            for (i = 0; i < this._topics.length; i ++) {
                topic = this._topics[i];
                topicElm = this._topicElms[topic.getId()];

                if (topicElm.alpha > 0) {
                    for (j = 0; j < topic._issues.length; j ++) {
                        issue = this._canvas.getElementByData(topic._issues[j]);
                        this._canvas.drawLine(issue, topicElm, 0xFFFFFF, 0.2);
                    }
                }
            }
        }
    };

    DetailMode.prototype._onStartShow = function () {
        var i;
        var issue;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.setMode(Issue.MODE_DETAIL);
            issue.elm.alpha = 0;
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            issue = this._canvas.tags[i];
            issue.explode();
        }

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            issue = this._canvas.fakes[i];
            issue.explode();
        }

        this._drawLinesBind = this._drawLines.bind(this);
        this._canvas.renderStartS.add(this._drawLinesBind);
        this._canvas.addChild(this._detailContainer);

        setTimeout(this._onShow.bind(this), 500);
    };

    DetailMode.prototype._onStartHide = function () {
        this._canvas.renderStartS.remove(this._drawLinesBind);
        this._canvas.removeChild(this._detailContainer);

        setTimeout(this._onHide.bind(this), 100);
    };

    return DetailMode;
});