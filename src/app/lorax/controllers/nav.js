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
        var nav = $('.banner-nav-wrap');
        if (!nav.hasClass('fixed') && scrollTop > nav.offset().top) {
            this._navOffset = nav.offset();
            $('body').addClass('no-anim');
            $('#detail').css('padding-top', nav.outerHeight(true));
            nav.addClass('fixed');
            setTimeout(function () {
                 $('body').removeClass('no-anim');
            }, 100);
        } else if (nav.hasClass('fixed') && scrollTop < this._navOffset.top) {
            nav.removeClass('fixed');
            $('body').addClass('no-anim');
            $('#detail').css('padding-top', 0);
            setTimeout(function () {
                 $('body').removeClass('no-anim');
            }, 100);
        }
    };

    NavCtrl.prototype._onChangeTopic = function (topic) {
        this._$timeout(function () {
            this._$scope.nav.active = topic;
        }.bind(this));
    };

    return NavCtrl;
});
