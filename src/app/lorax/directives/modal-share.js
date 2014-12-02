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
            shareFacebook: this.shareFacebook.bind(this),
            shareTwitter: this.shareTwitter.bind(this),
            onSecondStep: false,
            secondStepIssue: null,
            backToFirstStep: this.backToFirstStep.bind(this)
        };

        // listen for $broadcast of 'openShareModal'
        $scope.$on('openShareModal', this.openModal.bind(this));

        // get model
        this._dataService.getMain().then(function (model) {
            this._$scope.modalShare.content = model.getModals().share;

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
        // service = 'twitter', 'email', or 'fb'
        angular.extend(
            this._$scope.modalShare,
            {
                open: true,
                service: service
            }
        );

        console.log(service);

        this._windowService.setModalOpen(true);

        // get the current issue that the user is viewing,
        // from the url parameters
        var currentIssue = this._utilsService.getURLParameter('issue');

        // scroll to issue
        // if no issue in focus, e.g. user is on experience, we do nothing
        if (currentIssue) {
            this.scrollToIssue(currentIssue);
        }
    };

    ModalShareController.prototype.closeModal = function () {
        this._$scope.modalShare.open = false;
        this._$scope.modalShare.onSecondStep = false;

        this._windowService.setModalOpen(false);
    };

    ModalShareController.prototype.onShare = function (e, issue) {
        // if modal service is 'twitter' or 'fb'
        // prevent the default mailto behavior
        // open new sharing tab/window
        switch (this._$scope.modalShare.service) {
        case 'twitter':
            e.preventDefault();
            this.shareTwitter(issue);
            break;
        case 'fb':
            e.preventDefault(issue);
            this.shareFacebook();
            break;
        // if null, open second step
        case null:
            e.preventDefault();
            this.secondStep(issue);
            break;
        }
    };

    ModalShareController.prototype.shareFacebook = function (issue) {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + issue.getUrl(), '_blank');
    };

    ModalShareController.prototype.shareTwitter = function (issue) {
        window.open('http://twitter.com/share?text=' + issue.getTitle() + '&url=' +
            issue.getUrl() + '/&hashtags=shapeoftheweb', '_blank');
    };

    ModalShareController.prototype.secondStep = function (issue) {
        this._$scope.modalShare.onSecondStep = true;
        this._$scope.modalShare.secondStepIssue = issue;
    };

    ModalShareController.prototype.backToFirstStep = function () {
        this._$scope.modalShare.onSecondStep = false;
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
