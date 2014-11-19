/**
 * Service for explore infographic
 *
 * @class lorax/services/ExploreService
 */
define(function () {
    'use strict';

    var ExploreService = function ($location, $timeout, windowService) {
        this._$location = $location;
        this._$timeout = $timeout;
        this._windowService = windowService;
    };

    ExploreService.prototype.setCanvas = function (canvas) {
        this._explore = canvas;
        this._explore.init();
        this._explore.setEnterIssueCallback(this._onPressIssue.bind(this));
        this._explore.setBgModeCallback(this._onChangeBgMode.bind(this));
    };

    ExploreService.prototype.switchView = function (view) {
        switch (view) {
        case 'explore':
            this._explore.showExplore();
            break;
        case 'topics':
            this._explore.showTopics();
            break;
        case 'issues':
            this._explore.showIssues();
            break;
        case 'detail':
            this._explore.showDetail();
            break;
        default:
            this._explore.hold();
        }
    };

    ExploreService.prototype.onScroll = function (offset) {
        this._explore.onScroll(offset);
    };

    ExploreService.prototype._onPressIssue = function (topic, issue) {
        this._$timeout(function () {
            this._$location.url('/detail/?topic=' + topic + '&issue=' + issue);
        }.bind(this));
    };

    ExploreService.prototype._onChangeBgMode = function (status, animate) {
        this._windowService.setBgMode(status, animate);
    };

    ExploreService.$inject = [
        '$location',
        '$timeout',
        'windowService'
    ];

    return ExploreService;
});
