/**
 * Service for explore infographic
 *
 * @class lorax/services/ExploreService
 */
define(function () {
    'use strict';

    var ExperienceService = function ($location, $timeout, windowService) {
        this._$location = $location;
        this._$timeout = $timeout;
        this._windowService = windowService;
    };

    ExperienceService.prototype.setCanvas = function (canvas) {
        this._experience = canvas;
        this._experience.init();
        this._experience.setEnterIssueCallback(this._onPressIssue.bind(this));
        this._experience.setBgModeCallback(this._onChangeBgMode.bind(this));
    };

    ExperienceService.prototype.switchView = function (view) {
        switch (view) {
            case 'explore':
                this._experience.showExplore();
                break;
            case 'topics':
                this._experience.showTopics();
                break;
            case 'issues':
                this._experience.showIssues();
                break;
            case 'detail':
                this._experience.showDetail();
                break;
            default:
                this._experience.hold();
        }
    };

    ExperienceService.prototype.onScroll = function (offset) {
        this._experience.onScroll(offset);
    };

    ExperienceService.prototype._onPressIssue = function (topic, issue) {
        this._$timeout(function () {
            this._$location.url('/detail/?topic=' + topic + '&issue=' + issue);
        }.bind(this));
    };

    ExperienceService.prototype._onChangeBgMode = function (status, animate) {
        this._windowService.setBgMode(status, animate);
    };

    ExperienceService.$inject = [
        '$location',
        '$timeout',
        'windowService'
    ];

    return ExperienceService;
});
