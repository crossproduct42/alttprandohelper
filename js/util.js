(function(window) {
    'use strict';

    var slice = Array.prototype.slice;

    window.at = function(key, value) {
        return function(o) { return o[key] = value, o; }({});
    };

    window.announcer = function() {
        var listeners = [],
            methods = {};

        function announce() {
            var args = slice.call(arguments);
            listeners.forEach(function(f) { f.apply(null, args); });
        };

        methods.on = function(f) {
            listeners.push(f);
        };

        methods.off = function(f) {
            var index = listeners.findIndex(function(x) { return x === f; });
            if (index >= 0) listeners.splice(index, 1);
        };

        return Object.assign(announce, methods);
    };

    window.counter = function(value, delta, max, min) {
        min = min || 0;
        value += delta;
        if (value > max) value = min;
        if (value < min) value = max;
        return value;
    };

    window.create = function(proto, props) {
        var result = Object.create(proto);
        return props != null ? Object.assign(result, props) : result;
    };

    // based on https://github.com/medialize/URI.js/blob/gh-pages/src/URI.js
    window.uri_query = memoize(function() {
        var q, href = location.href + '',
            qi = href.indexOf('?'),
            hi = href.indexOf('#');

        q = hi >= 0 ? href.substring(0, hi) : href;
        q = qi >= 0 ? q.substring(qi) : '';

        // clean out leading question, trim amps, and consecutive amps
        return q.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '')
            .split('&').reduce(function(items, param) {
                if (!param) return items;
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
