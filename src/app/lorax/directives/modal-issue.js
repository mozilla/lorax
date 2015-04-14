/**
 * @fileOverview Issue Modal directive
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    /**
     * Issue Modal directive
     */
    var ModalIssueDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            controller: ModalIssueController,
            templateUrl: '/app/lorax/directives/modal-issue.tpl.html'
        };
    };

    /**
    * Controller for Issue Modal directive
    * @constructor
    */
    var ModalIssueController = function (
        $scope,
        $compile,
        $location,
        $timeout,
        routesService,
        windowService,
        dataService
    ) {

        this._$scope = $scope;
        this._$compile = $compile;
        this._$location = $location;
        this._$timeout = $timeout;
        this._routesService = routesService;
        this._windowService = windowService;
        this._dataService = dataService;

        $scope.modalIssue = {
            open: false,
            closeModal: this.closeModal.bind(this)
        };

        // listen for $broadcast of 'openIssueModal'
        $scope.$on('openIssueModal', this.openModal.bind(this));

        // If an issue is accessed directly, with a URL such as:
        // ...trust/governmentSurveillance, the routeService's page
        // property will be set to 'modal-issue'.
        if (this._routesService.page === 'modal-issue') {
            // open the issue modal
            this.openModal();
        }
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalIssueController.$inject = [
        '$scope',
        '$compile',
        '$location',
        '$timeout',
        'routesService',
        'windowService',
        'dataService'
    ];

    /**
     * Triggered by a modalIssue event broadcast from:
     * src/app/lorax/services/experience.js and recieves the issue to show.
     */
    ModalIssueController.prototype.openModal = function (e, issue) {

        // on direct access of an issue, the issue is not passed to the
        // function so, test for this and get it from the routeService.
        var issue = issue ? issue : this._routesService.params.issue;

        this._dataService.getMain().then(function (model) {

            this._$scope.modalIssue.open = true;
            this._$scope.modalIssue.issue = model.getIssueById(issue);

            // causes _onIssueChange in /src/app/lorax/services/routes.js to
            // be called which then updates the url to the new topic and issue
            this._windowService.setIssue(this._$scope.modalIssue.issue);

            // the call to setBgMode in /src/app/lorax/services/window.js causes
            // it to publish a windowService.bgMode event, which is then handled
            // in /src/app/lorax/directives/window.js (onBgModeChange) which in turn
            // sets the background color of the issue modal based on the status of
            // the current issue.
            this._windowService.setBgMode(this._$scope.modalIssue.issue.getStatusDescription(), false);

            var figure = $('.infographic__wrapper');
            // get and store the InfographicType, which will be something like:
            // data-lorax-chart-open-source
            // this would then map to, using the above example, the following:
            // /src/app/lorax/directives/chart-open-source.js
            var infographicDirective = this._$scope.modalIssue.issue.getInfographicType();
            // create the infographic container element
            var infographicContainer = $('<div />', { class: 'infographic-container' });

            // set the chart directive as an attribure on the infographicContainer
            infographicContainer.attr(infographicDirective,'');
            // append the infographic container to the parent figure element.
            figure.append(infographicContainer);

            // compile the new element based on it's new directive.
            // this will then call a directive such as:
            // /src/app/lorax/directives/chart-open-source.js
            this._$compile(infographicContainer)(this._$scope);

            this._windowService.setIssueMode(true);
            this._windowService.setModalOpen(true);

        }.bind(this));
    };

    ModalIssueController.prototype.closeModal = function () {

        var $colophon = $('.colophon');
        // if an issue was accessed from a direct URL the previous
        // state will not be set. Fallback to root
        var referrer = $colophon.data('previous-state') || '/';

        this._$scope.modalIssue.open = false;

        this._windowService.setIssueMode(false);
        this._windowService.setModalOpen(false);

        // remove the infographic container added in openModal above.
        $('.infographic-container').remove();
        $colophon.removeClass('issue-modal-active');

        this._$timeout(function () {
            this._$location.url(referrer);
        }.bind(this));
    };

    return ModalIssueDirective;
});
