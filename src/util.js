(function(window) {
    'use strict';

    _.mixin({
        matchAll(text, pattern) {
            const result = [];
            let match;
            while ((match = pattern.exec(text))) {
                result.push(match);
            }
            return result;
        }
    });

    window.counter = function(value, delta, max, min) {
        min = min || 0;
        value += delta;
        if (value > max) value = min;
        if (value < min) value = max;
        return value;
    };

    // based on https://github.com/medialize/URI.js/blob/gh-pages/src/URI.js
    window.uri_query = _.memoize(function() {
        let q;
        const href = location.href + '';
        const qi = href.indexOf('?');
        const hi = href.indexOf('#');

        q = hi >= 0 ? href.substring(0, hi) : href;
        q = qi >= 0 ? q.substring(qi) : '';

        // clean out leading question, trim amps, and consecutive amps
        return q.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '')
            .split('&').reduce(function(items, param) {
                if (!param) return items;
                const v = param.split('=', 2);
                const name = decodeURIComponent(v.shift());
                const value = v[0] ? decodeURIComponent(v.shift()) : true;
                items[name] = value;
                return items;
            }, {});
    });
}(window));
