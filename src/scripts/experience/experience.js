/* global define:true */
define([
    'stats',
    'webfontloader',
    'lorax/models/tag',
    'experience/experience-canvas',
    'experience/explore-mode',
    'experience/topics-mode',
    'experience/issues-mode',
    'experience/tag-issues-mode',
    'experience/detail-mode',
    'experience/intro-mode',
    'experience/issue',
    'jquery-mobile'
], function (
    Stats,
    WebFont,
    TagModel,
    ExperienceCanvas,
    ExploreMode,
    TopicsMode,
    IssuesMode,
    TagIssuesMode,
    DetailMode,
    IntroMode,
    Issue
) {
    'use strict';

    var Experience = function () {
        this._canvas = new ExperienceCanvas();
        this._exploreMode = new ExploreMode(this._canvas);
        this._topicsMode = new TopicsMode(this._canvas);
        this._issuesMode = new IssuesMode(this._canvas);
        this._tagIssuesMode = new TagIssuesMode(this._canvas);
        this._detailMode = new DetailMode(this._canvas);
        this._introMode = new IntroMode(this._canvas);
    };

    Experience.prototype.init = function (isDebug) {
        // FPS count for debugging
        if (isDebug) {
            this._showStats();
        }

        WebFont.load({
            active: this._onFontsLoaded.bind(this),
            custom: {families: ['Fira Sans:n2,n3,n4,n5,n6,n7,n8,n9']}
        });
    };

    Experience.prototype._onFontsLoaded = function () {
        this._canvas.drawIssues(this._issueData);
        this._canvas.drawTags(this._tagData);
        this._canvas.pressIssueS.add(this._openIssue.bind(this));
        this._canvas.hide();

        this._exploreMode.init();
        this._topicsMode.init();
        this._issuesMode.init();
        this._tagIssuesMode.init();
        this._detailMode.init();
        this._introMode.init();

        this._introMode.hideS.add(this._onEndIntro.bind(this));
        this._tagIssuesMode.hideS.add(this._onHideTagIssues.bind(this));

        this._hasInitialized = true;
        if (this._onInitMode) {
            this._onInitMode(this._onInitData);
        }
    };

    Experience.prototype.setData = function (data) {
        this._mainData = data;
        this._issueData = data.getIssues();
        this._tagData = data.getTags();
        this._topicsModeData = data.getTopics();
        this._miscData = data.getMiscLocale();

        this._topicsMode.setData(this._topicsModeData);
        this._detailMode.setTopics(this._topicsModeData);
        this._introMode.setData(this._miscData.intro);
    };

    Experience.prototype.setContainer = function (container) {
        this._canvas.init(container);
    };

    Experience.prototype.setEnterIssueCallback = function (enterIssueCallback) {
        this._enterIssueCallback = enterIssueCallback;
    };

    Experience.prototype.setBgModeCallback = function (bgModeCallback) {
        this._setBgMode = bgModeCallback;
    };

    Experience.prototype.setOpenTagCallBack = function (openTagCallBack) {
        this._openTag = openTagCallBack;
    };

    Experience.prototype.setGoBackCallBack = function (goBackCallback) {
        this._goBack = goBackCallback;
    };

    Experience.prototype.setExploreSafezone = function (safeZone) {
        this._exploreMode.setSafeZone(safeZone);
    };

    Experience.prototype.setTopicMenuPositions = function (positions) {
        this._detailMode.setTopicMenuPositions(positions);
    };

    /**
    * Shows FPS count
    */
    Experience.prototype._showStats = function () {
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

    Experience.prototype.hold = function () {
        this._onInitMode = function () {};
    };

    Experience.prototype.showExplore = function () {
        if (this._hasInitialized) {
            this._canvas.show();
            this._mode = Issue.MODE_EXPLORE;
            this._exploreMode.show();
            this._setBgMode('');
        } else {
            this._onInitMode = this.showExplore;
        }
    };

    Experience.prototype.showIssues = function () {
        if (this._hasInitialized) {
            this._canvas.show();
            this._mode = Issue.MODE_ISSUES;
            this._issuesMode.show();
            this._setBgMode('');
        } else {
            this._onInitMode = this.showIssues;
        }
    };

    Experience.prototype.showTopics = function () {
        if (this._hasInitialized) {
            this._canvas.show();
            this._mode = Issue.MODE_TOPICS;
            this._topicsMode.show();
            this._setBgMode('');
        } else {
            this._onInitMode = this.showTopics;
        }
    };

    Experience.prototype.showDetail = function () {
        if (this._hasInitialized) {
            this._canvas.show();
            this._mode = Issue.MODE_DETAIL;
            this._detailMode.show();

            if (this._currentIssue) {
                this._currentIssue.closeIssue();
            }
        } else {
            this._onInitMode = this.showDetail;
        }
    };

    Experience.prototype.showTagIssues = function (tag) {
        if (this._hasInitialized) {
            this._canvas.show();
            this._mode = Issue.MODE_TAG_ISSUES;
            this._tagIssuesMode.setTag(this._mainData.getTagByURLId(tag));
            this._tagIssuesMode.show();
            this._setBgMode('tag');
        } else {
            this._onInitMode = this.showTagIssues;
            this._onInitData = tag;
        }
    };

    Experience.prototype.showIntro = function () {
        if (this._hasInitialized) {
            this._canvas.show();
            this._mode = Issue.MODE_INTRO;
            this._introMode.show();
            this._setBgMode('intro');
        } else {
            this._onInitMode = this.showIntro;
        }
    };

    Experience.prototype._onHideTagIssues = function () {
        this._goBack();
    };

    Experience.prototype._onEndIntro = function () {
        this.showExplore();
    };

    Experience.prototype.onScroll = function (offset) {
        if (this._mode === Issue.MODE_DETAIL) {
            this._detailMode.onScroll(offset);
        }
    };

    Experience.prototype._openIssue = function (issue) {
        if (TagModel.prototype.isPrototypeOf(issue.data)) {
            // this.showTagIssues(issue.data.getURLId());
            this._openTag(issue.data.getURLId());
            return;
        }

        this._mode = Issue.MODE_DETAIL;
        this._currentIssue = issue;

        if (this._enterIssueCallback) {
            var issueData = issue.data;
            issue.openIssue();

            if (this._setBgMode) {
                this._setBgMode(issueData.getStatusDescription());
            }

            this._enterIssueCallback(issueData.getParent().getId(), issueData.getId());

            this.showDetail();
        }
    };

    Experience.prototype._updateScroller = function (mousePosition) {
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
            (-(this._scrollArea.y + (this._issueMargin * this._issuesMode.length)) +
            this._scrollArea.height - 200)
        );

        this._scrollPosition += (this._scrollFinalPosition - this._scrollPosition) / 5;

        var i;
        var issue;
        for (i = 0; i < this._issuesMode.length; i ++) {
            issue = this._issuesMode[i];
            issue.elm.y = issue.issueY + this._scrollPosition;
            // issue.elm.alpha = ((1 - Math.abs(issue.elm.y / this._scrollArea.height))) + 0.3;
        }
    };

    return Experience;
});
