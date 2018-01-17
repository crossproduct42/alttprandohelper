(function(window) {
    'use strict';

    var items = {
        has_melee: function() { return this.sword || this.hammer; },
        has_bow: function() { return this.bow > 1; },
        has_melee_bow: function() { return this.has_melee() || this.has_bow(); },
        has_cane: function() { return this.somaria || this.byrna; },
        has_rod: function() { return this.firerod || this.icerod; },

        can_reach_outcast: function(agahnim) {
            return this.moonpearl && (
                this.glove === 2 || this.glove && this.hammer ||
                agahnim && this.hookshot && (this.hammer || this.glove || this.flippers));
        },

        medallion_check: function(medallion) {
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
            var max = limits[item].max,
                min = limits[item].min;
            return counter(this[item], delta, max, min);
        };
    };

    var open_items = create(items, {
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

    var standard_items = update(open_items, { sword: { $set: 1 } });

    window.item_model = function(mode) {
        return { items: { standard: standard_items }[mode] || open_items };
    };
}(window));
