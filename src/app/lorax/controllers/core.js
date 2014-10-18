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
    scrollService
  ) {

    this._$scope = $scope;

    /**
     * Instance reference to $modal provider
     * @type {Object}
     */
    //this._$modal = $modal;

    //$scope.core = {
    //
    //};

    $scope.$on('$locationChangeSuccess', function () {
      console.log('go');
      scrollService.go('top',  { duration: 0 });
    });
  };

  CoreCtrl.$inject = [
    '$scope',
    'scrollService'
  ];

  return CoreCtrl;
});
