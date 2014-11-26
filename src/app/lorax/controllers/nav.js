/**
 * Nav bar controller
 *
 * @class lorax/controllers/DetailCtrl
 * @param $scope
 */
define([], function () {
    'use strict';

    var NavCtrl = function (
        $scope,
        routesService
    ) {

        this._$scope = $scope;

        this._$scope.nav = {
            active : 'access'
        };

        this._$scope.nav.handleClick = function () {
        }.bind(this);

        // this._$scope.nav.active = this._$route.current.params.topic;
    };

    NavCtrl.$inject = [
        '$scope',
        'routesService'
    ];

    return NavCtrl;
});
