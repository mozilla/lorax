/**
 * @fileOverview Email Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(function () {
    'use strict';

    /**
     * Email Modal directive
     */
    var ModalEmailDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ModalEmailController,
            templateUrl: '/app/lorax/directives/modal-email.tpl.html'
        };
    };

    /**
    * Controller for Email Modal directive
    * @constructor
    */
    var ModalEmailController = function (
        $scope
    ) {
        this._$scope = $scope;
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalEmailController.$inject = [
        '$scope'
    ];

    return ModalEmailDirective;
});
