/**
 * @fileOverview Add Infograhpic directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define([], function () {
    'use strict';

    /**
     * Add Infographic directive
     */
    var AddInfographicDirective = function () {
        return {
            restrict: 'A',
            scope: true,
            controller: AddInfographicController,
            link: AddInfographicLinkFn
        };
    };

    /**
     * Controller for AddInfographic directive
     * @constructor
     */
    var AddInfographicController = function (
        $scope,
        $compile
        )
    {
        this._$scope = $scope;
        this._$compile = $compile;
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    AddInfographicController.$inject = [
        '$scope',
        '$compile'
    ];

    /**
     * Link function for Add Infographic Section directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var AddInfographicLinkFn = function (scope, iElem, iAttrs, controller) {
        var directiveType = iAttrs.directiveType;

        iElem.removeAttr('data-lorax-add-infographic-directive');
        iElem.attr(directiveType, '');

        controller._$compile(iElem)(scope);
    };

    return AddInfographicDirective;
});
