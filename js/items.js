(function(window) {
    'use strict';

    var query = uri_query(),
        sword = query.mode === 'open' ? 0 : 1;

    window.items = {
        tunic: 1,
        sword: sword,
        shield: 0,
        moonpearl: false,

        bow: 0,
        boomerang: 0,
        hookshot: false,
        mushroom: false,
        powder: false,

        firerod: false,
        icerod: false,
        bombos: false,
        ether: false,
        quake: false,

        lantern: false,
        hammer: false,
        shovel: false,
        net: false,
        book: false,

        bottle: 0,
        somaria: false,
        byrna: false,
        cape: false,
        mirror: false,

        boots: false,
        glove: 0,
        flippers: false,
        flute: false,
        agahnim: false,

        inc: limit(1, {
            tunic: { min: 1, max: 3 },
            sword: { max: 4 },
            shield: { max: 3 },
            bottle: { max: 4 },
            bow: { max: 3 },
            boomerang: { max: 3 },
            glove: { max: 2 }
        })
    };

    window.count = {
        chests: {
            eastern: 3,
            desert: 2,
            hera: 2,
            darkness: 5,
            swamp: 6,
            skull: 2,
            thieves: 4,
            ice: 3,
            mire: 2,
            turtle: 5,
            
            dec: limit(-1, {
                eastern: { max: 3 },
                desert: { max: 2 },
                hera: { max: 2 },
                darkness: { max: 5 },
                swamp: { max: 6 },
                skull: { max: 2 },
                thieves: { max: 4 },
                ice: { max: 3 },
                mire: { max: 2 },
                turtle: { max: 5 }
            })
        }
    };

    function limit(delta, limits) {
        return function(item) {
            var value = this[item],
                max = limits[item].max,
                min = limits[item].min || 0;
            value += delta;
            if (value > max) value = min;
            if (value < min) value = max;
            return this[item] = value;
        };
    }
}(window));
