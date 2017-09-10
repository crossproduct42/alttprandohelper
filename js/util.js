(function(window) {
    'use strict';

    // based on https://github.com/medialize/URI.js/blob/gh-pages/src/URI.js
    window.uri_query = memoize(function() {
        var q, href = location.href + '',
            qi = href.indexOf('?'),
            hi = href.indexOf('#');

        q = hi >= 0 ? href.substring(0, hi) : href;
        q = qi >= 0 ? href.substring(qi) : '';
        
        // clean out leading question, trim amps, and consecutive amps
        return q.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '')
            .split('&').reduce(function(items, param) {
                var name, value,
                    v = param.split('=', 2);
                name = decodeURIComponent(v.shift());
                value = v[0] ? decodeURIComponent(v.shift()) : true;
                items[name] = value;
                return items;
            }, {});
    });

    function memoize(func) {
        var memoized = function(value) {
            var cache = memoized._cache;
            return cache[value] || (cache[value] = func(value));
        };
        memoized._cache = {};
        return memoized;
    };
}(window));
