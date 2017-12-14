(function(window) {
    var slice = Array.prototype.slice,
        splice = Array.prototype.splice,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString

    // adopted from https://github.com/kolodny/immutability-helper
    function newContext() {
        var commands = Object.assign({}, defaultCommands);
            update.extend = function(directive, fn) {
                commands[directive] = fn;
            };
            update.isEquals = function(a, b) { return a === b; };

            return update;

        function update(object, spec) {
            if (typeof spec === 'function') {
                return spec(object);
            }

            if (!(Array.isArray(object) && Array.isArray(spec))) {
                invariant(
                    !Array.isArray(spec),
                    'update(): You provided an invalid spec to update(). The spec may ' +
                    'not contain an array except as the value of $set, $push, $unshift, ' +
                    '$splice or any custom command allowing an array value.'
                );
            }

            invariant(
                typeof spec === 'object' && spec !== null,
                'update(): You provided an invalid spec to update(). The spec and ' +
                'every included key path must be plain objects containing one of the ' +
                'following commands: %.',
                Object.keys(commands).join(', ')
            );

            var nextObject = object;
            var index, key;
            Object.keys(spec).forEach(function(key) {
                if (hasOwnProperty.call(commands, key)) {
                    var objectWasNextObject = object === nextObject;
                    nextObject = commands[key](spec[key], nextObject, spec, object);
                    if (objectWasNextObject && update.isEquals(nextObject, object)) {
                        nextObject = object;
                    }
                } else {
                    var nextValueForKey = update(object[key], spec[key]);
                    if (!update.isEquals(nextValueForKey, nextObject[key]) || typeof nextValueForKey === 'undefined' && !hasOwnProperty.call(object, key)) {
                        if (nextObject === object) {
                            nextObject = copy(object);
                        }
                        nextObject[key] = nextValueForKey;
                    }
                }
            });
            return nextObject;
        }
    }

    var defaultCommands = {
        $push: function(value, nextObject, spec) {
            invariantPushAndUnshift(nextObject, spec, '$push');
            return value.length ? nextObject.concat(value) : nextObject;
        },
        $unshift: function(value, nextObject, spec) {
            invariantPushAndUnshift(nextObject, spec, '$unshift');
            return value.length ? value.concat(nextObject) : nextObject;
        },
        $splice: function(value, nextObject, spec, originalObject) {
            invariantSplices(nextObject, spec);
            value.forEach(function(args) {
                invariantSplice(args);
                if (nextObject === originalObject && args.length) nextObject = copy(originalObject);
                splice.apply(nextObject, args);
            });
            return nextObject;
        },
        $set: function(value, nextObject, spec) {
            invariantSet(spec);
            return value;
        },
        $toggle: function(targets, nextObject) {
            invariantSpecArray(targets, '$toggle');
            var nextObjectCopy = targets.length ? copy(nextObject) : nextObject;

            targets.forEach(function(target) {
                nextObjectCopy[target] = !nextObject[target];
            });

            return nextObjectCopy;
        },
        $unset: function(value, nextObject, spec, originalObject) {
            invariantSpecArray(value, '$unset');
            value.forEach(function(key) {
                if (Object.hasOwnProperty.call(nextObject, key)) {
                    if (nextObject === originalObject) nextObject = copy(originalObject);
                    delete nextObject[key];
                }
            });
            return nextObject;
        },
        $add: function(value, nextObject, spec, originalObject) {
            invariantMapOrSet(nextObject, '$add');
            invariantSpecArray(value, '$add');
            if (type(nextObject) === 'Map') {
                value.forEach(function(pair) {
                    var key = pair[0];
                    var value = pair[1];
                    if (nextObject === originalObject && nextObject.get(key) !== value) nextObject = copy(originalObject);
                    nextObject.set(key, value);
                });
            } else {
                value.forEach(function(value) {
                    if (nextObject === originalObject && !nextObject.has(value)) nextObject = copy(originalObject);
                    nextObject.add(value);
                });
            }
            return nextObject;
        },
        $remove: function(value, nextObject, spec, originalObject) {
            invariantMapOrSet(nextObject, '$remove');
            invariantSpecArray(value, '$remove');
            value.forEach(function(key) {
                if (nextObject === originalObject && nextObject.has(key)) nextObject = copy(originalObject);
                nextObject.delete(key);
            });
            return nextObject;
        },
        $merge: function(value, nextObject, spec, originalObject) {
            invariantMerge(nextObject, value);
            Object.keys(value).forEach(function(key) {
                if (value[key] !== nextObject[key]) {
                    if (nextObject === originalObject) nextObject = copy(originalObject);
                    nextObject[key] = value[key];
                }
            });
            return nextObject;
        },
        $apply: function(value, original) {
            invariantApply(value);
            return value(original);
        }
    };

    function copy(object) {
        if (Array.isArray(object)) {
            return Object.assign(object.constructor(object.length), object)
        } else if (type(object) === 'Map') {
            return new Map(object)
        } else if (type(object) === 'Set') {
            return new Set(object)
        } else if (object && typeof object === 'object') {
            // change this to use __proto__ instead of constructor
            return Object.assign(Object.create(object.__proto__ || null), object);
        } else {
            return object;
        }
    }

    function type(obj) {
        return toString.call(obj).slice(8, -1);
    }

    function invariantPushAndUnshift(value, spec, command) {
        invariant(Array.isArray(value),
            'update(): expected target of % to be an array; got %.',
            command, value);
        invariantSpecArray(spec[command], command)
    }

    function invariantSpecArray(spec, command) {
        invariant(Array.isArray(spec),
            'update(): expected spec of % to be an array; got %. ' +
            'Did you forget to wrap your parameter in an array?',
            command, spec);
    }

    function invariantSplices(value, spec) {
        invariant(Array.isArray(value),
            'Expected $splice target to be an array; got %',
            value);
        invariantSplice(spec['$splice']);
    }

    function invariantSplice(value) {
        invariant(Array.isArray(value),
            'update(): expected spec of $splice to be an array of arrays; got %. ' +
            'Did you forget to wrap your parameters in an array?',
            value);
    }

    function invariantApply(fn) {
        invariant(typeof fn === 'function',
            'update(): expected spec of $apply to be a function; got %.',
            fn);
    }

    function invariantSet(spec) {
        invariant(Object.keys(spec).length === 1,
            'Cannot have more than one key in an object with $set');
    }

    function invariantMerge(target, specValue) {
        invariant(specValue && typeof specValue === 'object',
            'update(): $merge expects a spec of type \'object\'; got %',
            specValue);
        invariant(target && typeof target === 'object',
            'update(): $merge expects a target of type \'object\'; got %',
            target);
    }

    function invariantMapOrSet(target, command) {
        var typeOfTarget = type(target);
        invariant(typeOfTarget === 'Map' || typeOfTarget === 'Set',
            'update(): % expects a target of type Set or Map; got %',
            command, typeOfTarget);
    }

    function invariant(condition, format) {
        if (!condition) {
            var args = slice.call(arguments, 2);
            throw Object.assign(
                new Error(format.replace(/%/g, function() { return args.unshift(); })), {
                    name: 'Invariant Violation',
                    framesToPop: 1 // we don't care about invariant's own frame
                });
        }
    }

    window.update = newContext();
    window.update.newContext = newContext;
}(window));
