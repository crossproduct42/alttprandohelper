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

        boss0: false,
        chest0: 3,
        lantern: false,
        hammer: false,
        shovel: false,
        net: false,
        book: false,

        boss1: false,
        chest1: 2,
        bottle:0,
        somaria: false,
        byrna: false,
        cape: false,
        mirror: false,

        boss2: false,
        chest2: 2,
        boots: false,
        glove: 0,
        flippers: false,
        flute: false,
        agahnim: false,

        boss3: false,
        boss4: false,
        boss5: false,
        boss6: false,
        boss7: false,
        boss8: false,
        boss9: false,

        chest3: 5,
        chest4: 6,
        chest5: 2,
        chest6: 4,
        chest7: 3,
        chest8: 2,
        chest9: 5
    };

    window.items_min = {
        sword:0,
        shield:0,
        tunic:1,

        bottle:0,
        bow:0,
        boomerang:0,
        glove:0
    };

    window.items_max = {
        sword:4,
        shield:3,
        tunic:3,

        bottle:4,
        bow:3,
        boomerang:3,
        glove:2,

        chest0: 3,
        chest1: 2,
        chest2: 2,
        chest3: 5,
        chest4: 6,
        chest5: 2,
        chest6: 4,
        chest7: 3,
        chest8: 2,
        chest9: 5

    };
}(window));
