/**
 * @fileOverview Share Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    /**
     * Share Modal directive
     */
    var ModalShareDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ModalShareController,
            link: ModalShareLinkFn,
            templateUrl: '/app/lorax/directives/modal-share.tpl.html'
        };
    };

    /**
    * Controller for Share Modal directive
    * @constructor
    */
    var ModalShareController = function (
        $scope,
        $timeout,
        dataService,
        windowService,
        utilsService
    ) {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._dataService = dataService;
        this._windowService = windowService;
        this._utilsService = utilsService;

        this._offset = {
            'small': -60,
            'medium': -60,
            'large': -35,
            'xlarge': -35
        };

        $scope.modalShare = {
            open: false,
            service: null,
            closeModal: this.closeModal.bind(this),
            onShare: this.onShare.bind(this),
            shareUrl: 'http://test.com'
        };

        // listen for $broadcast of 'openShareModal'
        $scope.$on('openShareModal', this.openModal.bind(this));

        // get model
        this._dataService.getMain().then(function (model) {
            var issuesArray = [];

            angular.forEach(model._topics, function (topic) {
                angular.forEach(topic._issues, function (issue) {
                    issuesArray.push(issue);
                });
            });

            this._$scope.modalShare.issues = issuesArray;
        }.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalShareController.$inject = [
        '$scope',
        '$timeout',
        'dataService',
        'windowService',
        'utilsService'
    ];

    ModalShareController.prototype.openModal = function (e, service) {
        angular.extend(
            this._$scope.modalShare,
            {
                open: true,
                service: service
            }
        );

        this._windowService.setModalOpen(true);

        var currentIssue = this._utilsService.getURLParameter('issue');

        if (currentIssue) {
            this.scrollToIssue(currentIssue);
        }
    };

    ModalShareController.prototype.closeModal = function () {
        this._$scope.modalShare.open = false;

        this._windowService.setModalOpen(false);
    };

    ModalShareController.prototype.onShare = function (e, issue) {
        switch (this._$scope.modalShare.service) {
        case 'twitter':
            e.preventDefault();
            window.open('http://twitter.com/share?text=' + issue.getTitle() + '&url=' + issue.getUrl() + '/&hashtags=shapeoftheweb', '_blank');
            break;
        case 'fb':
            e.preventDefault();
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + issue.getUrl(), '_blank');
            break;
        }
    };

    var ModalShareLinkFn = function (scope, iElem, iAttrs, controller) {
        controller.scrollToIssue = function (issue) {
            controller._$timeout(function () {
                var $el = $('[data-id="' + issue + '"]');
                var top = $el.position().top;
                var offset = controller._offset[controller._windowService.breakpoint()];

                $('.modal').scrollTop(top + offset);
            });

        };
    };

    return ModalShareDirective;
});
