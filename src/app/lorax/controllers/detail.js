/**
 * Detail page controller
 *
 * @class lorax/controllers/DetailCtrl
 * @param $scope
 */
define([], function () {
  'use strict';

  var DetailCtrl = function (
    $scope,
    dataService
  ) {

    this._$scope = $scope;

    this._$scope.detail = { };

    dataService.getMain().then(function(model) {
      this._$scope.detail.model = model;
    }.bind(this));

  };

  DetailCtrl.$inject = [
    '$scope',
    'dataService'
  ];

  return DetailCtrl;
});
