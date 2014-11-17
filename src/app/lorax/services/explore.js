define(function () {
    'use strict';

    var ExploreService = function ($location, $timeout) {
        this._$location = $location;
        this._$timeout = $timeout;
    };

    ExploreService.prototype.setCanvas = function (canvas) {
        this._explore = canvas;
        this._explore.init(true);
        this._explore.setEnterIssueCallback(this._onPressIssue.bind(this));
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

    ExploreService.$inject = [
        '$location',
        '$timeout'
    ];

    return ExploreService;
});
