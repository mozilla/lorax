define(['jquery', 'bowser'], function($, bowser) {
    'use strict';

    /**
     * Browser support is currently as follows:
     * IE 10+
     * Firefox 31+
     * Chrome 31+
     * Safari 7+
     * iOS Safari 7.1+
     * Android Browser 4.4+
     * Chrome for Android 39+
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1113349#c0
     */

    function init() {
        bindEvents();

        var supported = (
            // IE 10+
            (bowser.msie && bowser.version >= 10) ||

            // Firefox 31+
            (bowser.firefox && !bowser.android && bowser.version >= 31) ||

            // Chrome 31+
            (bowser.chrome && !bowser.android && bowser.version >= 31) ||

            // Safari 7+
            (bowser.safari && !bowser.ios && bowser.version >= 7) ||

            // Firefox for Android 34+
            (bowser.firefox && bowser.android && bowser.version >= 34) ||

            // iOS Webkit 7.1+
            (bowser.webkit && bowser.ios  && bowser.version >= 7) ||

            // Android Browser 4.4+
            (bowser.android && bowser.webkit && !bowser.chrome && bowser.osversion >= 4.4) ||

            // Chrome for Android 39+
            (bowser.chrome && bowser.android && bowser.version >= 39)
        );

        if (!supported) {
            $('.modal--old-ie').show();
        }
    }

    function bindEvents() {
        $(document.documentElement).on('click', '.modal--old-ie .close-modal', function(e) {
            var modal = $(e.target).parents('.modal--old-ie');
            modal.remove();
        });
    }

    return {
        init: init,
    };
});
