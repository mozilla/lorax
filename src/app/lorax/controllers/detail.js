/**
 * Detail page controller
 *
 * @class lorax/controllers/DetailCtrl
 * @param $scope
 */
define([], function () {
  'use strict';

  var DetailCtrl = function (
    $scope
  ) {

    this._$scope = $scope;
  };

  DetailCtrl.$inject = [
    '$scope'
  ];

  return DetailCtrl;
});
