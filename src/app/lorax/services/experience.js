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
        this._experience.setEnterIssueCallback(this._onPressIssue.bind(this));
        this._experience.setBgModeCallback(this._onChangeBgMode.bind(this));

        if (this._container) {
            this.setContainer(this._container);
        }

        if (this._view) {
            this.switchView(this._view);
        }
    };

    ExperienceService.prototype.setContainer = function (container) {
        if (this._experience) {
            this._experience.setContainer(container);
            this._experience.init();
        } else {
            this._container = container;
        }
    };

    ExperienceService.prototype.switchView = function (view) {
        if (this._experience) {
            switch (view) {
                case 'intro':
                    this._experience.showIntro();
                    break;
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
        } else {
            this._view = view;
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
