/**
 * Manages data access.
 *
 * @class lorax/services/dataService
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

        this._defaultLocale = 'en-US';
        this._$http = $http;
        this._$q = $q;
        this._mainData, this._requestingMain, this._mainDefer;
        this._mapData, this._requestingMap, this._mapDefer;

        this._mainEndpoint = '/data/base/main.json';
        this._mapEndpoint = '/data/base/countries.topo.json';
        this._countryDataEndpoint = '/data/base/country-data.json';

        this._localeMainEndpoint = '/data/i18n/main.json';
        this._infographicEndpoint = '/data/i18n/infographics.json';

        /**
         * @method core/services/dataService~getMain
         * @param locale {String} Locale code
         */
        function getMain(locale) {
            locale = locale || this._defaultLocale;

            if (!this._mainData) {
                if (this._requestingMain) {
                    return this._mainDefer.promise;
                }

                this._requestingMain = true;
                this._mainDefer = this._$q.defer();

                var req = this._$http.get(this._mainEndpoint);
                // TODO: prepend locale to the below once i18n has started
                var localeReq = this._$http.get(this._localeMainEndpoint);
                var infographicReq = this._$http.get(this._infographicEndpoint);

                req.then(function (res) {
                    if (res.data) {
                        localeReq.then(function (localeRes) {
                            if (localeRes.data) {
                                infographicReq.then(function (infographicRes) {
                                    this._mainData = new MainModel(res.data, localeRes.data, infographicRes.data);
                                    this._mainDefer.resolve(this._mainData);
                                }.bind(this));
                            }
                        }.bind(this));
                    }
                }.bind(this))['catch'](function (error) {
                    this._mainDefer.reject(error);
                }.bind(this));
            } else {
                this._mainDefer.resolve(this._mainData);
            }

            return this._mainDefer.promise;
        }

        function getMap(locale) {
            locale = locale || this._defaultLocale;

            if (!this._mapData) {
                if (this._requestingMap) {
                    return this._mapDefer.promise;
                }

                this._requestingMap = true;
                this._mapDefer = this._$q.defer();

                var req = this._$http.get(this._mapEndpoint);
                var countryReq = this._$http.get(this._countryDataEndpoint);

                req.then(function (res) {
                    if ( res.data ) {
                        countryReq.then(function (countryRes) {
                            this._mapData = {
                                "geoData": res.data,
                                "countryData": countryRes.data
                            };

                            this._mapDefer.resolve(this._mapData);
                        }.bind(this));
                    }
                }.bind(this))['catch'](function (error) {
                    this._mapDefer.reject(error);
                }.bind(this));
            } else {
                this._mapDefer.resolve(this._mapData);
            }

            return this._mapDefer.promise;
        }

        return {
            getMain: getMain.bind(this),
            getMap: getMap.bind(this)
        };
    };

    dataService.$inject = [
        '$http',
        '$q'
    ];

    return dataService;
});
