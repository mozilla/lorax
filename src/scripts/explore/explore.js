/* global define:true */
define([
    'jquery',
    'pixi',
    'stats',
    'createjs',
    'explore/explore-canvas',
    'explore/explore-mode',
    'explore/topics-mode',
    'explore/issues-mode',
    'explore/issue',
    'explore/circle',
    'explore/topic',
    'jquery-mobile'
], function (
    $,
    PIXI,
    Stats,
    createjs,
    ExploreCanvas,
    ExploreMode,
    TopicsMode,
    IssuesMode,
    Issue,
    Circle,
    Topic
) {
    'use strict';

    var Explore = function () {
        this._canvas = new ExploreCanvas();
        this._explore = new ExploreMode(this._canvas);
        this._topics = new TopicsMode(this._canvas);
        this._issues = new IssuesMode(this._canvas);
    };

    Explore.prototype.init = function (isDebug) {
        this._canvas.drawTags(this._tagData);
        this._canvas.drawIssues(this._issueData);

        this._explore.init();
        this._topics.init();
        this._issues.init();

        // FPS count for debugging
        if (isDebug) {
            this._stats = new Stats();
            this._showStats();
        }

        this._autoModeTime = 8000;
        this._autoModeTimeUp = 3000;

        this.showExplore();
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

    Explore.prototype._startAutoMode = function () {
        // this._autoMode = true;

        // this._autoModeIssue = this._issues[Math.floor(Math.random() * this._issues.length)];
        // this._mouseOverIssue(this._autoModeIssue);

        // clearTimeout(this._autoModeTimeout);
        // this._autoModeTimeout = setTimeout(
        //     this._endAutoMode.bind(this),
        //     this._autoModeTimeUp,
        //     true
        // );
    };

    Explore.prototype._endAutoMode = function (startAnother) {
        // if (this._autoModeIssue) {
        //     this._mouseOutIssue(this._autoModeIssue);
        // }

        // this._autoMode = false;

        // clearTimeout(this._autoModeTimeout);
        // if (startAnother) {
        //     this._autoModeTimeout = setTimeout(
        //         this._startAutoMode.bind(this),
        //         this._autoModeTime
        //     );
        // }
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
        this._explore.show();
    };

    /**
    * Go to issues mode
    */
    Explore.prototype.showIssues = function () {
        this._issues.show();
    };

    /**
    * Go to topics mode
    */
    Explore.prototype.showTopics = function () {
        this._topics.show();
    };

    Explore.prototype._onOverTag = function (event) {
        this._tags[event.target.index].mouseOver();
    };

    Explore.prototype._onOutTag = function (event) {
        this._tags[event.target.index].mouseOut();
    };

    Explore.prototype._onOverIssue = function (event) {
        if (this._mode === Issue.MODE_ISSUES) {
            this._issues[event.target.index].issueModeMouseOver();
        } else {
            this._issues[event.target.index].mouseOver();
        }
    };

    Explore.prototype._onOutIssue = function (event) {
        if (this._mode === Issue.MODE_ISSUES) {
            this._issues[event.target.index].issueModeMouseOut();
        } else {
            this._issues[event.target.index].mouseOut();
        }
    };

    Explore.prototype._onPressIssue = function (event) {
        this._openIssue(this._getElementFromId(this._issueData[event.target.index].getId()));
    };

    Explore.prototype._openIssue = function (issue) {
        this._mode = Issue.MODE_DETAIL;

        if (this.enterIssueCallback) {
            var issueData = issue.data;
            issue.openIssue();
            this.enterIssueCallback(issueData.getParent().getId(), issueData.getId());
        }
    }

    Explore.prototype._mouseOverIssue = function (issue) {
        var related;
        var relatedIssue;
        var isSameTopic;
        var i;

        if (this._mode !== Issue.MODE_ISSUES) {
            related = issue.data.getRelated();
            for(i = 0; i < related.length; i ++) {
                relatedIssue = this._getElementFromId(related[i]._id);
                isSameTopic = issue.data._parent._id === relatedIssue.data._parent._id;
                if (this._mode !== Issue.MODE_TOPICS) {
                    relatedIssue.lightUp();
                }
            }
        }
    };

    Explore.prototype._mouseOutIssue = function (issue) {
        var related;
        var relatedIssue;
        var i;

        if (this._mode !== Issue.MODE_ISSUES) {
            // if (!issue.isInteractive || this._autoMode) {
            //     issue.mouseOut.bind(issue)();
            // }

            related = issue.data.getRelated();
            for(i = 0; i < related.length; i ++) {
                relatedIssue = this._getElementFromId(related[i]._id);
                relatedIssue.lightDown();
            }
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