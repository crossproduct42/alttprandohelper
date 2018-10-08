(function() {
    'use strict';

    if (typeof Object.assign !== 'function') {
        Object.defineProperty(Object, 'assign', {
            writable: true,
            configurable: true,
            // .length of function is 2
            value: function assign(target, varArgs) {
                if (target == null) throw new TypeError('Cannot convert undefined or null to object');

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            }
        });
    }
}());
