/**
 * Manages data access.
 *
 * @class core/services/dataService
 */
define([
  'angular',
  'lorax/models/main'
], function (
  angular,
  MainModel
) {
  'use strict';

  var dataService = function ($http, $q) {

    this._defaultLocale = 'en-US'
    this._$http = $http;
    this._$q    = $q;

    function _buildMainEndpoint() {
      return [
        'data',
        'base',
        'main.json'
      ].join('/');
    }
    
    function _buildLocaleMainEndpoint(locale) {
      return [
        'data',
        'i18n',
        locale,
        'main.json'
      ].join('/');
    }

    /**
     * @method core/services/dataService~getMain
     * @param locale {String} Locale code
     */
    function getMain(locale) {
      locale = locale || this._defaultLocale;
      var deferred = this._$q.defer();

      var req = this._$http.get(_buildMainEndpoint());
      var localeReq = this._$http.get(_buildLocaleMainEndpoint(locale));

      req.then(function (res) {
        var model = null;
        if (res.data) {
          localeReq.then(function (localeRes) {
            model = new MainModel(res.data, localeRes.data);
            deferred.resolve(model);
          });
        }
      }.bind(this))['catch'](function (error) {
        deferred.reject(error);
      }.bind(this));

      return deferred.promise;
    }

    return {
      getMain: getMain.bind(this)
    };
  };

  dataService.$inject = [
    '$http',
    '$q'
  ];

  return dataService;
});