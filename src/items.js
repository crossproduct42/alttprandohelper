(function(window) {
    'use strict';

    const items_base = {
        get can_lift_light() { return this.glove >= 1; },
        get can_lift_heavy() { return this.glove >= 2; },
        get can_flute() { return this.flute; },
        get mastersword() { return this.sword >= 2; },
        get has_bottle() { return this.bottle >= 1; },

        get has_melee() { return this.sword || this.hammer; },
        get has_bow() { return this.bow > 1; },
        get has_melee_bow() { return this.has_melee || this.has_bow; },
        get has_cane() { return this.somaria || this.byrna; },
        get has_rod() { return this.firerod || this.icerod; },
        get has_fire() { return this.lamp || this.firerod; },

        can_reach_outcast(agahnim) {
            return this.moonpearl && (
                this.glove === 2 || this.glove && this.hammer ||
                agahnim && this.hookshot && (this.hammer || this.glove || this.flippers));
        },

        medallion_check(medallion) {
            if (!this.sword || !this.bombos && !this.ether && !this.quake) return 'unavailable';
            if (medallion === 'bombos' && !this.bombos ||
                medallion === 'ether' && !this.ether ||
                medallion === 'quake' && !this.quake) return 'unavailable';
            if (medallion === 'unknown' && !(this.bombos && this.ether && this.quake)) return 'possible';
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

    const items = _.create(items_base, {
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

        lamp: false,
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

    window.item_model = function() {
        return { items: items };
    };
}(window));
