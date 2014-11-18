/* global define:true */
define([
    'explore/issues-mode',
    'explore/issue'
], function (
    IssuesMode,
    Issue
) {
    'use strict';

    var TagIssuesMode = function (canvas) {
        this._canvas = canvas;

        return this;
    };

    TagIssuesMode.prototype = new IssuesMode();
    TagIssuesMode.prototype.constructor = TagIssuesMode;

    TagIssuesMode.prototype.init = function () {
        IssuesMode.prototype.init.call(this);
    };

    TagIssuesMode.prototype.setTag = function (data) {
        this._tag = this._canvas.getElementByData(data);

        this._issues = [];
        var related = data.getRelated();
        for (var i = 0; i < related.length; i ++) {
            this._issues.push(this._canvas.getElementByData(related[i]));
        }

        this._updateScroll();
    };

    TagIssuesMode.prototype._drawLines = function () {
        var i;
        var issue;
        var relatedItem;

        this._canvas.clearLines();

        for (i = 0; i < this._issues.length - 1; i ++) {
            issue = this._issues[i];
            relatedItem = this._issues[i + 1];

            this._canvas.drawLine(issue, relatedItem, 0xFFFFFF, 0.10);
        }
    };

    TagIssuesMode.prototype._onStartShow = function () {
        var i;
        var issue;

        this._scrollPosition = this._scrollFinalPosition = 0;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.explode();
        }

        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setMode(Issue.MODE_TAG_ISSUES);
            issue.moveTo(issue.issueX, issue.issueY);
            // so mouse over doesnt block animation
            setTimeout(this._setIssueMouseEvents.bind(this), 500, issue);
        }

        this._drawLinesBind = this._drawLines.bind(this);
        this._canvas.renderStartS.add(this._drawLinesBind);

        $(document).on('mousewheel', this._onMouseWheel.bind(this));
        this._canvas._stage.touchstart = this._onTouchStart.bind(this);
        this._canvas._stage.touchend = this._onTouchEnd.bind(this);
        this._canvas._stage.touchmove = this._onTouching.bind(this);

        setTimeout(this._onShow.bind(this), 500);
    };

    TagIssuesMode.prototype._onStartHide = function () {
        IssuesMode.prototype._onStartHide.call(this);
    };

    return TagIssuesMode;
});