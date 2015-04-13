/* global define:true */
define([
    'stats',
    'experience/experience-canvas',
    'experience/explore-mode',
    'experience/topics-mode',
    'experience/issues-mode',
    'experience/issue',
    'jquery-mobile'
], function (
    Stats,
    ExperienceCanvas,
    ExploreMode,
    TopicsMode,
    IssuesMode,
    Issue
) {
    'use strict';

    var Experience = function () {
        this._canvas = new ExperienceCanvas();
        this._exploreMode = new ExploreMode(this._canvas);
        this._topicsMode = new TopicsMode(this._canvas);
        this._issuesMode = new IssuesMode(this._canvas);
    };

    Experience.prototype.init = function (isDebug) {

        // FPS count for debugging
        if (isDebug) {
            this._showStats();
        }

        var $colophon = $('.colophon');
        $colophon.on('click', 'a', function(event) {
            // only handle clicks triggered from the colophon trigger
            if ($(event.target).hasClass('colophon-trigger-mobile')) {
                event.preventDefault();
                // show or hide the list of links.
                $('ul', $colophon).toggleClass('colophon-show-mobile');
            }
        });

        this._canvas.drawIssues(this._issueData);
        // adds an event listener to the clickable issue dots
        this._canvas.pressIssueS.add(this._openIssue.bind(this));
        this._canvas.hide();

        this._exploreMode.init();
        this._topicsMode.init();
        this._issuesMode.init();

        setTimeout(function () {
            this._hasInitialized = true;
            if (this._onInitMode) {
                this._onInitMode(this._onInitData);
            }
        }.bind(this), 500);
    };

    Experience.prototype.setData = function (data) {
        this._mainData = data;
        this._issueData = data.getIssues();
        this._topicsModeData = data.getTopics();
        this._miscData = data.getMiscLocale();

        this._topicsMode.setData(this._topicsModeData);
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

    Experience.prototype.setGoToIndexCallBack = function (callback) {
        this._goToIndex = callback;
    };

    Experience.prototype.setExploreSafezone = function (safeZone) {
        this._exploreMode.setSafeZone(safeZone);
    };

    Experience.prototype.endAutoPlay = function () {
        if (this._mode === Issue.MODE_EXPLORE) {
            this._exploreMode._endAutoMode();
        }
    };

    Experience.prototype.startAutoPlay = function () {
        if (this._mode === Issue.MODE_EXPLORE) {
            this._exploreMode._endAutoMode(true);
        }
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

    /**
     * When one of the issue circles are clicked on the canvas it triggers this
     * function, and is passed the issue that was clicked.
     *
     * This then sets the _enterIssueCallback which is handled by _onPressIssue
     * in src/app/lorax/services/experience.js
     */
    Experience.prototype._openIssue = function (issue) {

        var $colophon = $('.colophon');
        var issueData = issue.data;

        // store the previous view so we can go back to it when the
        // modal is closed.
        $colophon.data('previous-state', window.location.pathname);

        // add the modal-issue-active class to the footer.
        // This is used in the CSS to bump up the z-index of
        // some of the sharing icons.
        $colophon.addClass('issue-modal-active');

        this._mode = Issue.MODE_ISSUES;
        this._enterIssueCallback(issueData.getParent().getId(), issueData.getId());
    };

    return Experience;
});
