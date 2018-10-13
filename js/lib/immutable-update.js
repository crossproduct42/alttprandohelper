(function(window) {
    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;

    function context() {
        var strict_equal = function(a, b) { return a === b; };
        var context = function(object, spec) {
            return update(object, spec, context.equality || strict_equal);
        };
        Object.assign(context, utility);
        return context;
    }

    function update(object, spec, equality) {
        if (_.isNil(spec) || _.isBoolean(spec)) {
            return object;
        }

        if (_.isFunction(spec)) {
            spec = { $apply: [spec] };
        }

        invariant(_.isArray(object) || !_.isArray(spec),
            'update: You provided an invalid spec. The spec may not contain an array ' +
            'except as the value of $set or any custom command allowing an array value.');

        invariant(_.isObjectLike(spec),
            'update: You provided an invalid spec. The spec and every included branch ' +
            'must be one of undefined, null, true, false, function, or a plain objects ' +
            'containing one of the commands $set, $apply, $merge, or $delete.');

        var original = object;
        var next = object;
        _.each(command_order, function(command) {
            if (_.has(spec, command)) next = update_with(commands[command], spec[command], next, original, equality);
        });
        _.each(spec, function(spec, key) {
            if (!_.has(commands, key)) next = update_branch(spec, key, next, original, equality);
        });
        return next;
    }

    function update_with(command, spec, next, original, equality) {
        var next_was_original = original === next;
        next = command(spec, next, original);
        return next_was_original && equality(next, original) ? original : next;
    }

    function update_branch(spec, key, next, original, equality) {
        var next_value = update(get(next, key), spec, equality);
        if (!equality(next_value, get(next, key)) ||
            typeof next_value === 'undefined' && !_.has(original, key)) {
            if (next === original)
                next = copy(original);
            set(next, key, next_value);
        }
        return next;
    }

    var command_order = ['$set', '$apply', '$merge', '$delete'];
    var commands = {
        $set: _.identity,
        $apply: function(func, next) {
            func =_.castArray(func);
            invariant(_.every(func, _.isFunction), 'update: $apply expects a spec of type function or array of functions; got %.', func);
            return _.flow(func)(next);
        },
        $merge: function(values, next, original) {
            var is_map = _.isMap(next);
            var is_set = _.isSet(next);
            invariant(_.isObjectLike(next), 'update: $merge expects a target of type Object, Map, or Set; got %', next);
            if (is_map) invariant_merge_map(values);
            else if (is_set) invariant_merge_set(values);
            else invariant_merge_object(values);

            _.each(values, function(value, key) {
                if (is_map) { key = value[0]; value = value[1]; }
                if (is_set) { key = value; value = true; }
                if (get(next, key) !== value) {
                    if (next === original)
                        next = copy(original);
                    set(next, key, value);
                }
            });
            return next;
        },
        $delete: function delete_command(value, next, original) {
            invariant(_.isObjectLike(next), 'update: $delete expects a target of type Object, Map, or Set; got %', next);
            var is_map_set = _.isMap(next) || _.isSet(next);
            _.castArray(value).forEach(function(key) {
                if (has(next, key)) {
                    if (next === original)
                        next = copy(original);
                    _delete(next, key);
                }
            });
            return next;
        }
    };

    function invariant_merge_map(values) {
        invariant(Array.isArray(values) && _.every(values, Array.isArray),
            'update: $merge expects a spec of type Array of Arrays for a Map target; got %. ' +
            'Did you forget to wrap your parameters in an array?', values);
    }

    function invariant_merge_set(values) {
        invariant(Array.isArray(values),
            'update: $merge expects a spec of type Array for a Set target; got %. ' +
            'Did you forget to wrap your parameters in an array?', values);
    }

    function invariant_merge_object(values) {
        invariant(_.isObjectLike(values), 'update: $merge expects a spec of type Object for an Object target; got %', values);
    }

    function has(object, key) {
        return _.isMap(object) || _.isSet(object) ? object.has(key) :
            _.has(object, key);
    }

    function get(object, key) {
        return _.isMap(object) ? object.get(key) :
            _.isSet(object) ? object.has(key) :
            object[key];
    }

    function set(object, key, value) {
        _.isMap(object) ? object.set(key, value) :
            _.isSet(object) ? object.add(key) :
            object[key] = value;
    }

    function _delete(object, key) {
        _.isMap(object) || _.isSet(object) ? object.delete(key) :
            delete object[key];
    }

    var utility = {
        push: function(values) {
            values = _.castArray(values);
            return function(next) {
                invariant(Array.isArray(next), 'update.push: expected target to be an array; got %.', next);
                return values.length ? next.concat(values) : next;
            };
        },
        unshift: function(values) {
            values = _.castArray(values);
            return function(next) {
                invariant(Array.isArray(next), 'update.unshift: expected target to be an array; got %.', next);
                return values.length ? values.concat(next) : next;
            };
        },
        splice: function(values) {
            invariant(Array.isArray(values) && _.every(values, Array.isArray), 
                'update.splice: expected spec to be an array of arrays; got %. ' +
                'Did you forget to wrap your parameters in an array?', values);
            return function(next) {
                invariant(Array.isArray(next), 'update.splice: expected target to be an array; got %.', next);
                var original = next;
                values.forEach(function(value) {
                    if (next === original && value.length)
                        next = copy(original);
                    splice.apply(next, value);
                });
                return next;
            };
        },
        toggle: function(keys) {
            keys = _.castArray(keys);
            return function(next) {
                next = keys.length ? copy(next) : next;
                keys.forEach(function(key) {
                    next[key] = !next[key];
                });
                return next;
            };
        }
    };

    function copy(object) {
        if (_.isMap(object)) return new Map(object);
        if (_.isSet(object)) return new Set(object);
        if (_.isArray(object))
            return Object.assign(object.constructor(object.length), object)
        if (_.isObjectLike(object))
            return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
        return object;
    }

    function invariant(condition, format) {
        if (!condition) {
            var args = slice.call(arguments, 2);
            throw Object.assign(
                new Error(format.replace(/%/g, function() { return args.shift(); })),
                { name: 'InvariantViolation' });
        }
    }

    window.update = context();
    window.update.context = context;
}(window));
