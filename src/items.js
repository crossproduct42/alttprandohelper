(function(window) {
    'use strict';

    const items = {
        get has_melee() { return this.sword || this.hammer; },
        get has_bow() { return this.bow > 1; },
        get has_melee_bow() { return this.has_melee || this.has_bow; },
        get has_cane() { return this.somaria || this.byrna; },
        get has_rod() { return this.firerod || this.icerod; },
        get has_fire() { return this.lantern || this.firerod; },

        can_reach_outcast(agahnim) {
            return this.moonpearl && (
                this.glove === 2 || this.glove && this.hammer ||
                agahnim && this.hookshot && (this.hammer || this.glove || this.flippers));
        },

        medallion_check(medallion) {
            if (!this.sword || !this.bombos && !this.ether && !this.quake) return 'unavailable';
            if (medallion === 1 && !this.bombos ||
                medallion === 2 && !this.ether ||
                medallion === 3 && !this.quake) return 'unavailable';
            if (medallion === 0 && !(this.bombos && this.ether && this.quake)) return 'possible';
        },

        inc: counters(1, {
            tunic: { min: 1, max: 3 },
            sword: { max: 4 },
            shield: { max: 3 },
            bottle: { max: 4 },
            bow: { max: 3 },
            boomerang: { max: 3 },
            glove: { max: 2 }
        })
    };

    function counters(delta, limits) {
        return function(item) {
            const max = limits[item].max;
            const min = limits[item].min;
            return counter(this[item], delta, max, min);
        };
    };

    const open_items = _.create(items, {
        tunic: 1,
        sword: 0,
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
        flute: false
    });

    const standard_items = update(open_items, { sword: { $set: 1 } });

    window.item_model = function(mode) {
        return { items: { standard: standard_items }[mode] || open_items };
    };
}(window));
