/**
 * @fileOverview Detail directive
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     * directive
     */
    var DetailDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            controller: DetailCtrl,
            link: DetailLinkFn,
            templateUrl: '/app/lorax/directives/detail.tpl.html'
        };
    };

    /**
     * Controller
     * @constructor
     */
    var DetailCtrl = function (
        $scope,
        routesService,
        windowService,
        pubSubService
        )
    {
        this._$scope = $scope;
        this._routesService = routesService;
        this._windowService = windowService;
        this._pubSubService = pubSubService;

        this._$scope.detail = {
            isOpen: true
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    DetailCtrl.$inject = [
        '$scope',
        'routesService',
        'windowService',
        'pubSubService'
    ];

    DetailCtrl.prototype.init = function () {
        // listen to route change
        this._routesService.subscribe('change', this.onRouteChange.bind(this));
        if (this._routesService.page) {
            this.onRouteChange();
        }
    };

    DetailCtrl.prototype.onRouteChange = function () {
        this._routesService.page === 'detail' ? this.open() : this.close();
    };

    DetailCtrl.prototype.open = function () {
        if (!this._$scope.detail.isOpen) {
            // set detail mode on, adds body class
            this._windowService.setDetailMode(true);

            // set bg color
            var status = $('.detail').eq(0).attr('data-issue-status');
            this._windowService.setBgMode(status, false);

            this._$scope.detail.isOpen = true;
        }

        var topic = this._routesService.params.topic;
        var issue = this._routesService.params.issue;

        this._pubSubService.publish('detail.scrollToIssue', [issue, topic]);
    };

    DetailCtrl.prototype.close = function () {
        if (this._$scope.detail.isOpen) {
            this._windowService.setDetailMode(false);
            this._$scope.detail.isOpen = false;
        }
    };

    /**
     * Link function
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var DetailLinkFn = function (scope, iElem, iAttrs, controller) {
        controller.init();
    };

    return DetailDirective;
});
