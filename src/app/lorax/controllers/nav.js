/**
 * Nav bar controller
 *
 * @class lorax/controllers/DetailCtrl
 * @param $scope
 */
define(['jquery'], function ($) {
    'use strict';

    var NavCtrl = function (
        $scope,
        $timeout,
        windowService,
        dataService
    ) {

        this._$scope = $scope;
        this._$timeout = $timeout;
        this._windowService = windowService;
        this._dataService = dataService;

        this._$scope.nav = {
            active : null
        };

        this._dataService.getMain().then(function (model) {
            this._$scope.nav.content = model.getMiscLocale();
        }.bind(this));

        windowService.subscribe('topic', this._onChangeTopic.bind(this));

        $(window).on('scroll', this._onScroll.bind(this));
    };

    NavCtrl.$inject = [
        '$scope',
        '$timeout',
        'windowService',
        'dataService'
    ];

    NavCtrl.prototype._onScroll = function () {
        var scrollTop = $(window).scrollTop();
        if (!this.navElm) {
            this.navElm = $('.banner-nav-wrap');
            this.navTop = parseInt(this.navElm.css('top'));
            this.bannerElm = $('.banner');
            this.bannerTop = parseInt(this.bannerElm.css('top'));
            this.bannerInfoElm = $('.banner-info');
            this.bannerInfoTop = parseInt(this.bannerInfoElm.css('top'));
        }

        // save scrollStartPos
        if (scrollTop > this.lastScroll) {
            if (!this.scrollStartPos) {
                this.scrollStartPos = scrollTop;
            }
            if (scrollTop - this.scrollStartPos > this.bannerElm.height()) {
                this.scrollStartPos = scrollTop - this.bannerElm.height();
            }
        } else if (scrollTop < this.lastScroll) {
            if (scrollTop - this.scrollStartPos > 0) {
                this.scrollStartPos -= scrollTop - this.lastScroll;
            } else {
                this.scrollStartPos = scrollTop;
            }
        }

        // update positions
        this.navElm.css('top', Math.max(0, this.navTop - (scrollTop - this.scrollStartPos)));
        this.bannerElm.css('top', this.bannerTop - (scrollTop - this.scrollStartPos));
        this.bannerInfoElm.css('top', this.bannerInfoTop - (scrollTop - this.scrollStartPos));

        this.scrollingDown = scrollTop - this.lastScroll > 0;
        this.lastScroll = scrollTop;
    };

    NavCtrl.prototype._onChangeTopic = function (topic) {
        this._$timeout(function () {
            this._$scope.nav.active = topic;
        }.bind(this));
    };

    return NavCtrl;
});
