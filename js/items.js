(function(window) {
    'use strict';

    var mode = get_query_variable('mode');
    var sword = mode === 'open' ? 0 : 1;

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

        boss0: false,
        boss1: false,
        boss2: false,
        boss3: false,
        boss4: false,
        boss5: false,
        boss6: false,
        boss7: false,
        boss8: false,
        boss9: false,

        chest0: 3,
        chest1: 2,
        chest2: 2,
        chest3: 5,
        chest4: 6,
        chest5: 2,
        chest6: 4,
        chest7: 3,
        chest8: 2,
        chest9: 5,

        inc: limit(1, {
            tunic: { min: 1, max: 3 },
            sword: { max: 4 },
            shield: { max: 3 },
            bottle: { max: 4 },
            bow: { max: 3 },
            boomerang: { max: 3 },
            glove: { max: 2 }
        }),
        dec: limit(-1, {
            chest0: { max: 3 },
            chest1: { max: 2 },
            chest2: { max: 2 },
            chest3: { max: 5 },
            chest4: { max: 6 },
            chest5: { max: 2 },
            chest6: { max: 4 },
            chest7: { max: 3 },
            chest8: { max: 2 },
            chest9: { max: 5 }
        })
    };

    function limit(delta, limits) {
        return function(item) {
            var value = items[item],
                max = limits[item].max,
                min = limits[item].min || 0;
            value += delta;
            if (value > max) value = min;
            if (value < min) value = max;
            return items[item] = value;
        };
    }
}(window));
