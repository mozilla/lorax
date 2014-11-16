/* global define:true */
define([
    'pixi',
    'explore/mode',
    'explore/issue'
], function (
    PIXI,
    Mode,
    Issue
) {
    'use strict';

    var DetailMode = function (canvas) {
        this._canvas = canvas;

        return this;
    };

    DetailMode.prototype = new Mode();
    DetailMode.prototype.constructor = DetailMode;

    DetailMode.prototype.init = function () {
        var i;
        var issue;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.detailOffset = Math.random() * (this._canvas.canvasSize.x / 30);
            issue.detailOffset -= this._canvas.canvasSize.x / 60;
        }
    };

    DetailMode.prototype.onScroll = function (offset) {
        var i;
        var issue;
        var offsetPercent;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];

            issue.elm.y = issue.data.offset.top - offset;
            issue.elm.y -= this._canvas.canvasSize.y / 2;

            // 0 -> 1
            offsetPercent = (issue.elm.y + (this._canvas.canvasSize.y / 2)) / this._canvas.canvasSize.y;
            // 1 -> 0 -> 1
            offsetPercent = (6 * Math.pow(offsetPercent, 2)) - (6 * offsetPercent) + 1;
            //offsetPercent = Math.max(Math.min(offsetPercent, 1), 0);
            offsetPercent = Math.max(offsetPercent, 0);

            issue.elm.x = issue.detailOffset * offsetPercent;
            issue.elm.x += issue.data.offset.left - (this._canvas.canvasSize.x / 2);
        }
    };

    DetailMode.prototype._drawLines = function () {
        var i;
        var j;
        var issue;
        var related;
        var relatedItem;
        var isSameTopic;

        this._canvas.clearLines();

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            related = issue.data.getRelated();

            // draw lines connecting related issues
            for (j = 0; j < related.length; j ++) {
                relatedItem = this._canvas.getElementById(related[j]._id);
                isSameTopic = issue.data.getParent().getId() === related[j].getParent().getId();
                if (isSameTopic) {
                    this._canvas.drawLine(issue, relatedItem, 0xFFFFFF, 0.1);
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

        setTimeout(this._onShow.bind(this), 500);
    };

    DetailMode.prototype._onStartHide = function () {
        var i;
        var issue;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.implode();
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            issue = this._canvas.tags[i];
            issue.implode();
        }

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            issue = this._canvas.fakes[i];
            issue.implode();
        }

        this._canvas.renderStartS.remove(this._drawLinesBind);

        setTimeout(this._onHide.bind(this), 0);
    };

    return DetailMode;
});