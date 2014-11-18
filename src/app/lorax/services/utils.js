/**
 * Utility functions
 *
 * @class core/services/utilsService
 */
define(function () {
    'use strict';

    var utilsService = function () {

        /**
         * @method core/services/utilsService~getURLParameter
         * @param name {String} name of parameter
         */
        function getURLParameter(name) {
            return decodeURIComponent((
                new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [,''])[1]
                    .replace(/\+/g, '%20'
            )) || null;
        }

        return {
            getURLParameter: getURLParameter
        };
    };

    return utilsService;
});
