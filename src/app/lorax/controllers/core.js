/**
 * Core controller
 *
 * @class lorax/controllers/CoreCtrl
 * @param $scope
 */
define(['jquery', 'angular'], function ($, angular) {
  'use strict';

  /*jshint unused: false */
  var CoreCtrl = function (
    $scope,
    scrollService,
    dataService
  ) {

    this._$scope = $scope;

    $scope.$on('$locationChangeSuccess', function () {
      scrollService.go('top',  { duration: 0 });
    });
  };

  CoreCtrl.$inject = [
    '$scope',
    'scrollService',
    'dataService'
  ];

  return CoreCtrl;
});
