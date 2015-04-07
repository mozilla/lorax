/**
 * @fileOverview ShareService
 * @author <a href="mailto:chris@work.co">Chris James</a>
 * @author <a href="mailto:sneethling@mozilla.com">Schalk Neethling</a>
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    var ShareService = function (
        dataService,
        routesService
    ) {

        this._dataService = dataService;
        this._routesService = routesService;

        function share(e, service) {

            this._dataService.getMain().then(function (model) {
                var content = model.getServices().share;
                var fbShareUrl = content.fbShareUrl;
                var twitterShareUrl = content.twitterShareUrl;
                var absUrl = this._routesService._$location.$$absUrl;

                // get the current path from the route service
                var path = this._routesService._$location.$$path;
                // get the current issue from the path
                var issueString = path.substring(path.lastIndexOf('/') + 1);
                if (issueString) {
                    this._dataService.getMain().then(function (model) {
                        var issue = model.getIssueById(issueString);

                        // set base URL based on service
                        var socialShareUrl = service === 'fb' ? fbShareUrl : twitterShareUrl;
                        if (service === 'fb') {
                            socialShareUrl += issue ? issue.getShareUrl() : absUrl;
                        } else {
                            socialShareUrl += '?text=';
                            socialShareUrl += issue ? issue.getTitle() : '';
                            socialShareUrl += '&url=';
                            socialShareUrl += issue ? issue.getShareUrl() : absUrl;
                            socialShareUrl += '&hashtags=' + content.hashtag;
                        }

                        ga('send', 'pageview', '/share' + path + '/' + service + '/');
                        window.open(window.encodeURI(socialShareUrl), '_blank');

                    }.bind(this));
                }
            }.bind(this));
        }
        return {
            share: share
        }
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ShareService.$inject = [
        'dataService',
        'routesService'
    ];

    return ShareService;
});
