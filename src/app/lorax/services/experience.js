/**
 * Service for explore infographic
 *
 * @class lorax/services/ExploreService
 */
define(['jquery', 'experience/experience'], function ($, Experience) {
    'use strict';

    var ExperienceService = function ($location, $timeout, $window, windowService, dataService) {
        this._$location = $location;
        this._$timeout = $timeout;
        this._$window = $window;
        this._windowService = windowService;

        this._experience = new Experience();
        this._experience.setEnterIssueCallback(this._onPressIssue.bind(this));
        this._experience.setBgModeCallback(this._onChangeBgMode.bind(this));
        this._experience.setGoToIndexCallBack(this._goToIndex.bind(this));
        this._experience.setOpenTagCallBack(this._openTag.bind(this));

        var menu = $('.experience-menu');
        var menuRect = {
            x: menu.offset().left - $('#experience-canvas').width() / 2,
            y: menu.offset().top - $('#experience-canvas').height() / 2,
            width: menu.outerWidth(),
            height: menu.outerHeight()
        };
        this._experience.setExploreSafezone(menuRect);

        dataService.getMain().then(this.setData.bind(this));

        this._windowService.subscribe('onOpenModal', this.onModalOpen.bind(this));
    };

    ExperienceService.prototype.setMenuPositions = function () {
        if (this._windowService.breakpoint() !== 'small') {
            var detailMenuPositions = {};

            $('.banner-nav li a').each(function (index, elm) {
                elm = $(elm);
                detailMenuPositions[$(elm).attr('data-topic')] = {
                    x: elm.offset().left + (elm.innerWidth() / 2) - 5 - ($('#experience-canvas').width() / 2),
                    y: (elm.innerHeight() / 2) + 15 - ($('#experience-canvas').height() / 2)
                };
            });
        }

        this._experience.setTopicMenuPositions(detailMenuPositions);
    };

    ExperienceService.prototype.setData = function (data) {
        this._data = data;
        this._checkIfReady();
    };

    ExperienceService.prototype.setContainer = function (container) {
        this._container = container;
        this._checkIfReady();
    };

    ExperienceService.prototype.onModalOpen = function (isOpen) {
        if (isOpen) {
            this._experience.endAutoPlay();
        } else {
            this._experience.startAutoPlay();
        }
    };

    ExperienceService.prototype._checkIfReady = function () {
        if (this._experience && this._data && this._container) {
            this._experience.setContainer(this._container);
            this._experience.setData(this._data);

            if (this._view) {
                this.switchView(this._view, this._viewData);
            }

            this._experience.init();

            if (this._offset) {
                this.onScroll(this._offset);
            }
        }
    };

    ExperienceService.prototype.switchView = function (view, data) {
        if (this._experience) {
            switch (view) {
                case 'intro':
                    this._experience.showIntro();
                    break;
                case 'ecosystem':
                    this._experience.showExplore();
                    break;
                case 'vitals':
                    this._experience.showTopics();
                    break;
                case 'checklist':
                    this._experience.showIssues();
                    break;
                case 'tag':
                    this._experience.showTagIssues(data);
                    break;
                case 'detail':
                    this._experience.showDetail();
                    break;
                default:
                    this._experience.hold();
            }
        }

        this._view = view;
        this._viewData = data;
    };

    ExperienceService.prototype.onScroll = function (offset) {
        if (this._experience) {
            this._experience.onScroll(offset);
        }

        this._offset = offset;
    };

    ExperienceService.prototype._onPressIssue = function (topic, issue) {
        this._$timeout(function () {
            this._$location.url('/detail/' + topic + '/' + issue);
        }.bind(this));
    };

    ExperienceService.prototype._onChangeBgMode = function (status, animate) {
        this._windowService.setBgMode(status, animate);
    };

    ExperienceService.prototype._goToIndex = function () {
        this._$timeout(function () {
            this._$location.url('/');
        }.bind(this));
    };

    ExperienceService.prototype._openTag = function (tag) {
        this._$timeout(function () {
            this._$location.url('/tag/' + tag);
        }.bind(this));
    };

    ExperienceService.$inject = [
        '$location',
        '$timeout',
        '$window',
        'windowService',
        'dataService'
    ];

    return ExperienceService;
});
