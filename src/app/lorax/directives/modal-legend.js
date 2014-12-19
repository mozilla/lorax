/**
 * @fileOverview Legend Modal directive
 * @author <a href="mailto:owen@work.co">Owen Herterich</a>
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(function () {
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
        $animate,
        dataService,
        windowService
    ) {
        this._$scope = $scope;
        this._$animate = $animate;
        this._dataService = dataService;
        this._windowService = windowService;

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
        '$animate',
        'dataService',
        'windowService'
    ];

    ModalLegendController.prototype.openModal = function () {
        this._$scope.modalLegend.open = true;
        this._windowService.setSidePanelOpen(true, 'legend');
        this._windowService.publish('onOpenModal', [true]);
    };

    ModalLegendController.prototype.closeModal = function () {
        this._$scope.modalLegend.open = false;
        this._windowService.setSidePanelOpen(false, 'legend');
        this._windowService.publish('onOpenModal', [false]);
    };

    return ModalLegendDirective;
});
