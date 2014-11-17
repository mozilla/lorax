/* global define:true */
define([
    'stats',
    'font',
    'explore/explore-canvas',
    'explore/explore-mode',
    'explore/topics-mode',
    'explore/issues-mode',
    'explore/detail-mode',
    'explore/issue',
    'jquery-mobile'
], function (
    Stats,
    Font,
    ExploreCanvas,
    ExploreMode,
    TopicsMode,
    IssuesMode,
    DetailMode,
    Issue
) {
    'use strict';

    var Explore = function () {
        this._canvas = new ExploreCanvas();
        this._explore = new ExploreMode(this._canvas);
        this._topics = new TopicsMode(this._canvas);
        this._issues = new IssuesMode(this._canvas);
        this._detail = new DetailMode(this._canvas);
    };

    Explore.prototype.init = function (isDebug) {
        // FPS count for debugging
        if (isDebug) {
            this._showStats();
        }

        // preload font
        var font = new Font();
        font.onload = this.onFontLoaded.bind(this);
        font.fontFamily = 'Fira Sans';
        font.src = font.fontFamily;
    };

    Explore.prototype.onFontLoaded = function () {
        this._canvas.drawIssues(this._issueData);
        this._canvas.drawTags(this._tagData);
        this._canvas.pressIssueS.add(this._openIssue.bind(this));

        this._explore.init();
        this._topics.init();
        this._issues.init();
        this._detail.init();

        this._hasInitialized = true;
        if (this._onInitMode) {
            this._onInitMode();
        } else {
            this.showExplore();
        }
    };

    Explore.prototype.setData = function (data) {
        this._issueData = data.getIssues();
        this._tagData = data.getTags();
        this._topicsData = data.getTopics();

        this._topics.setData(this._topicsData);
    };

    Explore.prototype.setContainer = function (container) {
        this._canvas.init(container);
    };

    Explore.prototype.setEnterIssueCallback = function (enterIssueCallback) {
        this.enterIssueCallback = enterIssueCallback;
    };

    /**
    * Shows FPS count
    */
    Explore.prototype._showStats = function () {
        this._stats = new Stats();

        this._stats.setMode(0);
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '0px';
        this._stats.domElement.style.top = '0px';
        document.body.appendChild(this._stats.domElement);

        this._canvas.renderStartS.add(function () {
            this._stats.begin();
        }.bind(this));

        this._canvas.renderEndS.add(function () {
            this._stats.end();
        }.bind(this));
    };

    Explore.prototype.hold = function () {
        this._onInitMode = function () {};
    };

    Explore.prototype.showExplore = function () {
        if (this._hasInitialized) {
            this._mode = Issue.MODE_EXPLORE;
            this._explore.show();
        } else {
            this._onInitMode = this.showExplore;
        }
    };

    Explore.prototype.showIssues = function () {
        if (this._hasInitialized) {
            this._mode = Issue.MODE_ISSUES;
            this._issues.show();
        } else {
            this._onInitMode = this.showIssues;
        }
    };

    Explore.prototype.showTopics = function () {
        if (this._hasInitialized) {
            this._mode = Issue.MODE_TOPICS;
            this._topics.show();
        } else {
            this._onInitMode = this.showTopics;
        }
    };

    Explore.prototype.showDetail = function () {
        if (this._hasInitialized) {
            this._mode = Issue.MODE_DETAIL;
            this._detail.show();
            if (this._currentIssue) {
                this._currentIssue.closeIssue();
            }
        } else {
            this._onInitMode = this.showDetail;
        }
    };

    Explore.prototype.onScroll = function (offset) {
        if (this._mode === Issue.MODE_DETAIL) {
            this._detail.onScroll(offset);
        }
    };

    Explore.prototype._openIssue = function (issue) {
        this._mode = Issue.MODE_DETAIL;
        this._currentIssue = issue;

        if (this.enterIssueCallback) {
            var issueData = issue.data;
            issue.openIssue();
            this.showDetail();

            setTimeout(function () {
                this.enterIssueCallback(issueData.getParent().getId(), issueData.getId());
            }.bind(this), 300);
        }
    };

    Explore.prototype._updateScroller = function (mousePosition) {
        // no movement if mouse is out of the canvas
        if (mousePosition.y > this._canvasSize.y ||
            mousePosition.y < -this._canvasSize.y) {
            mousePosition.y = 0;
        }

        // using tan so the movement is smoother
        var tanMouse = Math.tan(mousePosition.y / this._canvasSize.y * Math.PI / 2);

        // no movement if mouse is near the center
        if (Math.abs(tanMouse) < 0.5) {
            tanMouse = 0;
        }

        this._scrollFinalPosition -= tanMouse * 8;

        this._scrollFinalPosition = Math.max(
            Math.min(this._scrollFinalPosition, 0),
            (-(this._scrollArea.y + (this._issueMargin * this._issues.length)) +
            this._scrollArea.height - 200)
        );

        this._scrollPosition += (this._scrollFinalPosition - this._scrollPosition) / 5;

        var i;
        var issue;
        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.elm.y = issue.issueY + this._scrollPosition;
            // issue.elm.alpha = ((1 - Math.abs(issue.elm.y / this._scrollArea.height))) + 0.3;
        }
    };

    return Explore;
});