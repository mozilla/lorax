/**
 * @fileOverview Mobile Options Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular'], function (angular) {
    'use strict';

    /**
     * Mobile Options Modal directive
     */
    var ModalMobileOptionsDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ModalMobileOptionsController,
            templateUrl: '/app/lorax/directives/modal-mobile-options.tpl.html'
        };
    };

    /**
    * Controller for Mobile Options Modal directive
    * @constructor
    */
    var ModalMobileOptionsController = function (
        $scope,
        $rootScope,
        windowService,
        dataService
    ) {
        this._$scope = $scope;
        this._$rootScope = $rootScope;
        this._windowService = windowService;
        this._dataService = dataService;

        $scope.modalOptions = {
            open: false,
            closeModal: this.closeModal.bind(this),
            openEmail: this.openEmail.bind(this),
            openAbout: this.openAbout.bind(this)
        };

        this._dataService.getMain().then( function (model) {
            $scope.modalOptions.miscData = model.getMiscLocale();
        });

        // listen for $broadcast of 'openEmailModal'
        $scope.$on('openMobileOptions', this.openModal.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalMobileOptionsController.$inject = [
        '$scope',
        '$rootScope',
        'windowService',
        'dataService'
    ];

    ModalMobileOptionsController.prototype.openModal = function (e, isOpen) {
        this._$scope.modalOptions.open = isOpen;

        this._windowService.setModalOpen(isOpen);
    };

    ModalMobileOptionsController.prototype.closeModal = function () {
        this._$scope.modalOptions.open = false;

        this._windowService.setModalOpen(false);
    };

    ModalMobileOptionsController.prototype.openEmail = function () {
        this._$rootScope.$broadcast('openEmailModal');

        this._$scope.modalOptions.open = false;
    };

    ModalMobileOptionsController.prototype.openAbout = function () {
        this._$rootScope.$broadcast('openAboutModal');

        this._$scope.modalOptions.open = false;
    };

    return ModalMobileOptionsDirective;
});
