(function(window) {
    'use strict';

    var slice = Array.prototype.slice;

    window.at = function(key, value) {
        return function(o) { return o[key] = value, o; }({});
    };

    window.compact = function(array) {
        if (array == null) return [];
        return array.reduce(function(acc, value) {
            return value ? acc.concat(value) : acc;
        }, []);
    };

    window.counter = function(value, delta, max, min) {
        min = min || 0;
        value += delta;
        if (value > max) value = min;
        if (value < min) value = max;
        return value;
    };

    window.not = function(predicate) {
        return function() {
            return !predicate.apply(this, arguments);
        };
    };

    window.partial = function(func, partials) {
        partials = slice.call(arguments, 1);
        return function(args) {
            args = slice.call(arguments);
            return func.apply(this, partials.concat(args));
        }
    };

    window.property = function(key) {
        return function(object) { return object[key]; };
    };

    window.result = function(key) {
        return function(object) {
            var value = object[key];
            return typeof value === 'function' ? value.call(object) : value;
        }
    };

    // based on https://github.com/medialize/URI.js/blob/gh-pages/src/URI.js
    window.uri_query = _.memoize(function() {
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
}(window));
