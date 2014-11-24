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
        $route
    ) {

        this._$scope = $scope;
        this._$route = $route;

        this._$scope.nav = {
            active : 'access'
        };

        this._$scope.nav.handleClick = function () {
        }.bind(this);

        this._$scope.nav.active = this._$route.current.params.topic;
    };

    NavCtrl.$inject = [
        '$scope',
        '$route'
    ];

    return NavCtrl;
});
