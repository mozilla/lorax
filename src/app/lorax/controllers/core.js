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

    dataService.getMain().then(function(model) {
      debugger;
      console.log(model);
      console.log(model.getIssues());
    });

    $scope.$on('$locationChangeSuccess', function () {
      console.log('go');
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
