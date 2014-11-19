/**
 * @fileOverview About Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    /**
     * About Modal directive
     */
    var ModalAboutDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ModalAboutController,
            templateUrl: '/app/lorax/directives/modal-about.tpl.html'
        };
    };

    /**
    * Controller for About Modal directive
    * @constructor
    */
    var ModalAboutController = function (
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

        $scope.modalAbout = {
            open: false,
            closeModal: this.closeModal.bind(this)
        };

        // listen for $broadcast of 'openAboutModal'
        $scope.$on('openAboutModal', this.openModal.bind(this));

        this._dataService.getMain().then(function (model) {
            this._$scope.modalAbout.content = model.getModals().about;
        }.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalAboutController.$inject = [
        '$scope',
        '$timeout',
        'dataService',
        'windowService',
        'utilsService'
    ];

    ModalAboutController.prototype.openModal = function (e) {
        angular.extend(
            this._$scope.modalAbout,
            {
                open: true
            }
        );

        this._windowService.setModalOpen(true);
    };

    ModalAboutController.prototype.closeModal = function () {
        this._$scope.modalAbout.open = false;

        this._windowService.setModalOpen(false);
    };

    return ModalAboutDirective;
});
