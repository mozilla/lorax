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
            issue.detailOffset = Math.random() * this._canvas.canvasSize.x;
            issue.detailOffset -= this._canvas.canvasSize.x / 2;
        }
    };

    DetailMode.prototype.onScroll = function () {
        var i;
        var issue;
        var offsetPercent;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];

            issue.elm.x = issue.data.offset.left - this._canvas.canvasSize.x / 2;
            issue.elm.y = issue.data.offset.top - this._canvas.canvasSize.y / 2;

            offsetPercent = issue.elm.y / this._canvas.canvasSize.y;
            offsetPercent = Math.max(Math.min(offsetPercent, 1), 0);

            issue.elm.x += (issue.detailOffset - issue.elm.x) * offsetPercent;
        }
    };

    // DetailMode.prototype._drawLines = function () {
    //     var i;
    //     var issue;
    //     var relatedItem;

    //     this._canvas.clearLines();

    //     for (i = 0; i < this._canvas.issues.length - 1; i ++) {
    //         issue = this._canvas.issues[i];
    //         relatedItem = this._canvas.issues[i + 1];

    //         this._canvas.drawLine(issue, relatedItem, 0xFFFFFF, 1);
    //     }
    // };

    DetailMode.prototype._drawLines = function () {
        var i;
        var j;
        var issue;
        var related;
        var relatedItem;

        this._canvas.clearLines();

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            related = issue.data.getRelated();

            // draw lines connecting related issues
            for (j = 0; j < related.length; j ++) {
                relatedItem = this._canvas.getElementById(related[j]._id);
                this._canvas.drawLine(issue, relatedItem, 0xFFFFFF, 1);
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