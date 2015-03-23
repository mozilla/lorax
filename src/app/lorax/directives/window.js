/**
 * @fileOverview Window directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    var BREAKPOINTS = {
        0: 'small',
        560: 'medium',
        960: 'large',
        1360: 'xlarge'
    };

    var Window = function () {
        return {
            restrict: 'A',
            controller: WindowController,
            link: WindowLinkFn
        };
    };

    Window.$inject = ['$rootScope'];

    var WindowController = function (
        $scope,
        $rootScope,
        $compile,
        $timeout,
        windowService,
        pubSubService
    ) {

        /**
         * Reference to controller $scope
         * @type {Object}
         */
        this.$scope = $scope;

        /**
         * Reference to application rootScope
         * @type {Object}
         */
        this.$rootScope = $rootScope;

        /**
         * Reference to Angular's compile function
         * @type {Function}
         */
        this.$compile = $compile;

        /**
         * Reference to Angular's timeout function
         * @type {Function}
         */
        this.$timeout = $timeout;

        /**
         * Reference to window service
         * @type {Object}
         */
        this.windowService = windowService;

        /**
         * Reference to pubSub service
         * @type {Object}
         */
        this.pubSubService = pubSubService;

        this._hasPageYOffset = window.pageYOffset !== undefined;
    };

    WindowController.$inject = [
        '$scope',
        '$rootScope',
        '$compile',
        '$timeout',
        'windowService',
        'pubSubService'
    ];

    WindowController.prototype.evaluateBreakpoint = function () {
        var currentBreakpoint = BREAKPOINTS[Object.keys(BREAKPOINTS)[0]];

        // Loop over breakpoints
        for (var breakpoint in BREAKPOINTS) {
            if (breakpoint < this.windowDims.width) {
                currentBreakpoint = BREAKPOINTS[breakpoint];
            }
        }

        if (currentBreakpoint !== this.latestBreakpoint) {
            this.latestBreakpoint = currentBreakpoint;
            this.windowService.setBreakpoint(this.latestBreakpoint);

            // Inform Angular of breakpoint change
            this.$timeout(function () {
                this.$scope.$apply();
            }.bind(this));
        }
    };

    WindowController.prototype.onResize = function () {
        this.windowService.setDimensions(this.windowDims);
        this.evaluateBreakpoint();
    };

    WindowController.prototype.getBreakpoint = function () {
        return this.windowService.breakpoint;
    };

    WindowController.prototype.setBreakpoint = function (newBreakpoint) {
        this.windowService.setBreakpoint(newBreakpoint);
    };

    var WindowLinkFn = function WindowLinkFn(scope, iElem, iAttrs, controller) {
        var windowEl = $(window);

        var onResize = angular.bind(controller, function () {
            this.windowDims = {
                height: windowEl.innerHeight(),
                width: windowEl.innerWidth()
            };

            // Inform controller and apply scope
            this.onResize();
        });

        function onBreakpointChange(newBreakpoint) {
            iElem
                .removeClass(function (index, css) {
                    return (css.match(/bp-\S+/g) || []).join(' ');
                })
                .addClass('bp-' + newBreakpoint);
        }

        function onDetailModeChange(isDetail) {
            var classMethod = (isDetail === true) ? 'addClass' : 'removeClass';
            iElem[classMethod]('is-detail');
        }

        /**
         * Sets the background color of the issue modal container based on the
         * status of the current issue. @see getStatusDescription in:
         * /src/app/lorax/models/issue.js
         */
        function onBgModeChange(status, animate) {
            var modelIssueContainer = $('.modal-issue', iElem);

            if (!animate) {
                modelIssueContainer.addClass('no-anim');
            }

            modelIssueContainer.attr('data-bg-mode', status);

            if (!animate) {
                setTimeout(function () {
                    modelIssueContainer.removeClass('no-anim');
                }, 500);
            }
        }

        function onModalOpenChange(modalOpen) {
            var classMethod = (modalOpen === true) ? 'addClass' : 'removeClass';
            iElem[classMethod]('is-modal-open');
        }

        function onSidePanelOpenChange(panelOpen, id) {
            var classMethod = (panelOpen === true) ? 'addClass' : 'removeClass';
            iElem[classMethod]('is-side-panel-open side-panel-' + id);
        }

        windowEl.on('resize', onResize).trigger('resize');

        // init
        onBreakpointChange(
            controller.windowService.breakpoint()
        );

        controller.pubSubService.subscribe(
            'windowService.breakpoint',
            onBreakpointChange
        );

        controller.pubSubService.subscribe(
            'windowService.detailMode',
            onDetailModeChange
        );

        controller.pubSubService.subscribe(
            'windowService.bgMode',
            onBgModeChange
        );

        controller.pubSubService.subscribe(
            'windowService.modalOpen',
            onModalOpenChange
        );

        controller.pubSubService.subscribe(
            'windowService.sidePanelOpen',
            onSidePanelOpenChange
        );
    };

    return Window;

});
