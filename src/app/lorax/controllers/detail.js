/**
 * Detail controller
 *
 * @class lorax/controllers/DetailCtrl
 * @param $scope
 */
define([], function () {
  'use strict';

  /*jshint unused: false */
  var DetailCtrl = function (
    $scope
  ) {

    this._$scope = $scope;

    console.log('load detail ctrl');
  };

  DetailCtrl.$inject = [
    '$scope'
  ];

  return DetailCtrl;
});
