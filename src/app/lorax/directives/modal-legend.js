/**
 * @fileOverview Legend Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    /**
     * Legend Modal directive
     */
    var ModalLegendDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ModalLegendController,
            templateUrl: '/app/lorax/directives/modal-legend.tpl.html'
        };
    };

    /**
    * Controller for Legend Modal directive
    * @constructor
    */
    var ModalLegendController = function (
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

        $scope.modalLegend = {
            open: false,
            closeModal: this.closeModal.bind(this)
        };

        // listen for $broadcast of 'openLegendModal'
        $scope.$on('openLegendModal', this.openModal.bind(this));

        this._dataService.getMain().then(function (model) {
            this._$scope.modalLegend.content = model.getModals().legend;

        }.bind(this));


    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalLegendController.$inject = [
        '$scope',
        '$timeout',
        'dataService',
        'windowService',
        'utilsService'
    ];

    ModalLegendController.prototype.openModal = function (e) {
        angular.extend(
            this._$scope.modalLegend,
            {
                open: true
            }
        );

        this._windowService.setModalOpen(true);
    };

    ModalLegendController.prototype.closeModal = function () {
        this._$scope.modalLegend.open = false;

        this._windowService.setModalOpen(false);
    };

    return ModalLegendDirective;
});
