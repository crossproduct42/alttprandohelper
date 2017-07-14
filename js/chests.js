(function(window) {
    'use strict';

    var mode = get_query_variable('mode');
    var is_standard = mode === 'standard';

    function can_reach_outcast() {
        return items.moonpearl && (
            items.glove === 2 || items.glove && items.hammer ||
            items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers));
    }

    function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 1; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }

    function always() { return 'available'; }

    // define dungeon chests
    window.dungeons = [{ // [0]
        name: 'Eastern Palace',
        is_beaten: false,
        is_beatable: function() {
            return items.bow > 1 ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        },
        can_get_chest: function() {
            return items.chest0 <= 2 && !items.lantern ||
                items.chest0 === 1 && !(items.bow > 1) ?
                'possible' : 'available';
        }
    }, { // [1]
        name: 'Desert Palace',
        is_beaten: false,
        is_beatable: function() {
            if (!(melee_bow() || cane() || rod())) return 'unavailable';
            if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
            if (!items.lantern && !items.firerod) return 'unavailable';
            return items.boots ? 'available' : 'possible';
        },
        can_get_chest: function() {
            if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
            if (items.glove && (items.firerod || items.lantern) && items.boots) return 'available';
            return items.chest1 > 1 && items.boots ? 'available' : 'possible';
        }
    }, { // [2]
        name: 'Tower of Hera',
        is_beaten: false,
        is_beatable: function() {
            if (!melee()) return 'unavailable';
            return this.can_get_chest();
        },
        can_get_chest: function() {
            if (!items.flute && !items.glove) return 'unavailable';
            if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
            return items.firerod || items.lantern ?
                items.flute || items.lantern ? 'available' : 'dark' :
                'possible';
        }
    }, { // [3]
        name: 'Palace of Darkness <img src="images/lantern.png" class="mini">',
        is_beaten: false,
        is_beatable: function() {
            if (!items.moonpearl || !(items.bow > 1) || !items.hammer) return 'unavailable';
            if (!items.agahnim && !items.glove) return 'unavailable';
            return items.lantern ? 'available' : 'dark';
        },
        can_get_chest: function() {
            if (!items.moonpearl) return 'unavailable';
            if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
            return !(items.bow > 1 && items.lantern) ||
                items.chest3 === 1 && !items.hammer ?
                'possible' : 'available';
        }
    }, { // [4]
        name: 'Swamp Palace <img src="images/mirror.png" class="mini">',
        is_beaten: false,
        is_beatable: function() {
            if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
            if (!items.hammer || !items.hookshot) return 'unavailable';
            if (!items.glove && !items.agahnim) return 'unavailable';
            return 'available';
        },
        can_get_chest: function() {
            if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
            if (!can_reach_outcast() && !(items.agahnim && items.hammer)) return 'unavailable';

            if (items.chest4 <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : 'available';
            if (items.chest4 <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : 'available';
            if (items.chest4 <= 5) return !items.hammer ? 'unavailable' : 'available';
            return !items.hammer ? 'possible' : 'available';
        }
    }, { // [5]
        name: 'Skull Woods',
        is_beaten: false,
        is_beatable: function() {
            return !can_reach_outcast() || !items.firerod || !items.sword ? 'unavailable' : 'available';
        },
        can_get_chest: function() {
            if (!can_reach_outcast()) return 'unavailable';
            return items.firerod ? 'available' : 'possible';
        }
    }, { // [6]
        name: 'Thieves\' Town',
        is_beaten: false,
        is_beatable: function() {
            if (!(melee() || cane())) return 'unavailable';
            if (!can_reach_outcast()) return 'unavailable';
            return 'available';
        },
        can_get_chest: function() {
            if (!can_reach_outcast()) return 'unavailable';
            return items.chest6 === 1 && !items.hammer ? 'possible' : 'available';
        }
    }, { // [7]
        name: 'Ice Palace (yellow=must bomb jump)',
        is_beaten: false,
        is_beatable: function() {
            if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) return 'unavailable';
            if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
            return items.hookshot || items.somaria ? 'available' : 'possible';
        },
        can_get_chest: function() {
            if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
            if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
            return items.hammer ? 'available' : 'possible';
        }
    }, { // [8]
        name: 'Misery Mire <img src="images/medallion0.png" class="mini"><img src="images/lantern.png" class="mini">',
        is_beaten: false,
        is_beatable: function() {
            if (!melee_bow()) return 'unavailable';
            if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
            if (!items.boots && !items.hookshot) return 'unavailable';
            // Medallion Check
            if (!items.sword || !items.bombos && !items.ether && !items.quake) return 'unavailable';
            if (medallions[0] === 1 && !items.bombos ||
                medallions[0] === 2 && !items.ether ||
                medallions[0] === 3 && !items.quake) return 'unavailable';
            if (medallions[0] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';

            return items.firerod ?
                items.lantern ? 'available' : 'dark' :
                'possible';
        },
        can_get_chest: function() {
            if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
            if (!items.boots && !items.hookshot) return 'unavailable';
            // Medallion Check
            if (!items.sword || !items.bombos && !items.ether && !items.quake) return 'unavailable';
            if (medallions[0] === 1 && !items.bombos ||
                medallions[0] === 2 && !items.ether ||
                medallions[0] === 3 && !items.quake) return 'unavailable';
            if (medallions[0] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';

            return (items.chest8 > 1 ?
                items.lantern || items.firerod :
                items.lantern && items.somaria) ?
                'available' : 'possible';
        }
    }, { // [9]
        name: 'Turtle Rock <img src="images/medallion0.png" class="mini"><img src="images/lantern.png" class="mini">',
        is_beaten: false,
        is_beatable: function() {
            if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
            if (!items.hookshot && !items.mirror) return 'unavailable';
            if (!items.icerod || !items.firerod) return 'unavailable';
            // Medallion Check
            if (!items.sword || !items.bombos && !items.ether && !items.quake) return 'unavailable';
            if (medallions[1] === 1 && !items.bombos ||
                medallions[1] === 2 && !items.ether ||
                medallions[1] === 3 && !items.quake) return 'unavailable';
            if (medallions[1] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';

            return items.lantern ? 'available' : 'dark';
        },
        can_get_chest: function() {
            if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
            if (!items.hookshot && !items.mirror) return 'unavailable';
            // Medallion Check
            if (!items.sword || !items.bombos && !items.ether && !items.quake) return 'unavailable';
            if (medallions[1] === 1 && !items.bombos ||
                medallions[1] === 2 && !items.ether ||
                medallions[1] === 3 && !items.quake) return 'unavailable';
            if (medallions[1] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';

            if (!items.lantern && !items.flute) return 'dark';

            return items.lantern && items.firerod && items.icerod ? 'available' : 'possible';
        }
    }];

    window.agahnim = {
        name: 'Agahnim <img src="images/sword2.png" class="mini">/ (<img src="images/cape.png" class="mini"><img src="images/sword1.png" class="mini">)',
        is_available: function() {
            return items.sword >= 2 || items.cape && items.sword ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        }
    };

    //define overworld chests
    window.chests = [{ // [0]
        name: 'King\'s Tomb <img src="images/boots.png" class="mini"> + <img src="images/glove2.png" class="mini">/<img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            if (!items.boots) return 'unavailable';
            if (can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
            return 'unavailable';
        }
    }, { // [1]
        name: 'Light World Swamp (2)',
        is_opened: false,
        is_available: always
    }, { // [2]
        name: 'Stoops Lonk\'s Hoose',
        is_opened: is_standard,
        is_available: always
    }, { // [3]
        name: 'Spiral Cave',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [4]
        name: 'Mimic Cave (<img src="images/mirror.png" class="mini"> outside of Turtle Rock)(Yellow = <img src="images/medallion0.png" class="mini"> unkown OR possible w/out <img src="images/firerod.png" class="mini">)',
        is_opened: false,
        is_available: function() {
            if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
            // Medallion Check
            if (!items.sword || !items.bombos && !items.ether && !items.quake) return 'unavailable';
            if (medallions[1] === 1 && !items.bombos ||
                medallions[1] === 2 && !items.ether ||
                medallions[1] === 3 && !items.quake) return 'unavailable';
            if (medallions[1] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';

            return items.firerod ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'possible';
        }
    }, { // [5]
        name: 'Tavern',
        is_opened: false,
        is_available: always
    }, { // [6]
        name: 'Chicken House <img src="images/bomb.png" class="mini">',
        is_opened: false,
        is_available: always
    }, { // [7]
        name: 'Bombable Hut <img src="images/bomb.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [8]
        name: 'C House',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [9]
        name: 'Aginah\'s Cave <img src="images/bomb.png" class="mini">',
        is_opened: false,
        is_available: always
    }, { // [10]
        name: 'West of Mire (2)',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
        }
    }, { // [11]
        name: 'DW Death Mountain (2) : Don\'t need <img src="images/moonpearl.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [12]
        name: 'Sahasrahla\'s Hut (3) <img src="images/bomb.png" class="mini">/<img src="images/boots.png" class="mini">',
        is_opened: false,
        is_available: always
    }, { // [13]
        name: 'Byrna Spike Cave',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove && items.hammer ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [14]
        name: 'Kakariko Well (4 + <img src="images/bomb.png" class="mini">)',
        is_opened: false,
        is_available: always
    }, { // [15]
        name: 'Thieve\'s Hut (4 + <img src="images/bomb.png" class="mini">)',
        is_opened: false,
        is_available: always
    }, { // [16]
        name: 'Hype Cave! <img src="images/bomb.png" class="mini"> (NPC + 4 <img src="images/bomb.png" class="mini">)',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
        }
    }, { // [17]
        name: 'Death Mountain East (5 + 2 <img src="images/bomb.png" class="mini">)',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [18]
        name: 'West of Sanctuary <img src="images/boots.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.boots ? 'available' : 'unavailable';
        }
    }, { // [19]
        name: 'Minimoldorm Cave (NPC + 4) <img src="images/bomb.png" class="mini">',
        is_opened: false,
        is_available: always
    }, { // [20]
        name: 'Ice Rod Cave <img src="images/bomb.png" class="mini">',
        is_opened: false,
        is_available: always
    }, { // [21]
        name: 'Cave Under Rock (bottom chest) <img src="images/hookshot.png" class="mini">/<img src="images/boots.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [22]
        name: 'Cave Under Rock (3 top chests) <img src="images/hookshot.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.hookshot ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [23]
        name: 'Treasure Chest Minigame: Pay 30 rupees',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [24]
        name: 'Bottle Vendor: Pay 100 rupees',
        is_opened: false,
        is_available: always
    }, { // [25]
        name: 'Sahasrahla <img src="images/pendant0.png" class="mini">',
        is_opened: false,
        is_available: function() {
            for (var k = 0; k < 10; k++) {
                if (prizes[k] === 1 && items['boss'+k] === 2)
                    return 'available';
            }
            return 'unavailable';
        }
    }, { // [26]
        name: 'Ol\' Stumpy',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
        }
    }, { // [27]
        name: 'Dying Boy: Distract him with <img src="images/bottle.png" class="mini"> so that you can rob his family!',
        is_opened: false,
        is_available: function() {
            return items.bottle ? 'available' : 'unavailable';
        }
    }, { // [28]
        name: 'Reunite the Hammer Brothers and show the Purple Chest to Gary',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
        }
    }, { // [29]
        name: 'Fugitive under the bridge <img src="images/flippers.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.flippers ? 'available' : 'unavailable';
        }
    }, { // [30]
        name: 'Ether Tablet <img src="images/sword2.png" class="mini"><img src="images/book.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.sword >= 2 && items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [31]
        name: 'Bombos Tablet <img src="images/mirror.png" class="mini"><img src="images/sword2.png" class="mini"><img src="images/book.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) &&
                items.mirror && items.sword >= 2 && items.book ? 'available' : 'unavailable';
        }
    }, { // [32]
        name: 'Catfish',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
                'available' : 'unavailable';
        }
    }, { // [33]
        name: 'King Zora: Pay 500 rupees',
        is_opened: false,
        is_available: function() {
            return items.flippers || items.glove ? 'available' : 'unavailable';
        }
    }, { // [34]
        name: 'Lost Old Man',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [35]
        name: 'Witch: Give her <img src="images/mushroom.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.mushroom ? 'available' : 'unavailable';
        }
    }, { // [36]
        name: 'Forest Hideout',
        is_opened: false,
        is_available: always
    }, { // [37]
        name: 'Lumberjack Tree <img src="images/agahnim.png" class="mini"><img src="images/boots.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.agahnim && items.boots ? 'available' : 'possible';
        }
    }, { // [38]
        name: 'Spectacle Rock Cave',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [39]
        name: 'South of Grove <img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
        }
    }, { // [40]
        name: 'Graveyard Cliff Cave <img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() && items.mirror ? 'available' : 'unavailable';
        }
    }, { // [41]
        name: 'Checkerboard Cave <img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
        }
    }, { // [42]
        name: '<img src="images/hammer.png" class="mini"><img src="images/hammer.png" class="mini"><img src="images/hammer.png" class="mini"><img src="images/hammer.png" class="mini"><img src="images/hammer.png" class="mini"><img src="images/hammer.png" class="mini"><img src="images/hammer.png" class="mini"><img src="images/hammer.png" class="mini">!!!!!!!!',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
        }
    }, { // [43]
        name: 'Library <img src="images/boots.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.boots ? 'available' : 'possible';
        }
    }, { // [44]
        name: 'Mushroom',
        is_opened: false,
        is_available: always
    }, { // [45]
        name: 'Spectacle Rock <img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.mirror ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [46]
        name: 'Floating Island <img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
                items.mirror && items.moonpearl && items.glove === 2 ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [47]
        name: 'Race Minigame <img src="images/bomb.png" class="mini">/<img src="images/boots.png" class="mini">',
        is_opened: false,
        is_available: always
    }, { // [48]
        name: 'Desert West Ledge <img src="images/book.png" class="mini">/<img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
        }
    }, { // [49]
        name: 'Lake Hylia Island <img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.flippers ?
                items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
                    'available' : 'possible' :
                'unavailable';
        }
    }, { // [50]
        name: 'Bumper Cave <img src="images/cape.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ?
                items.cape ? 'available' : 'possible' :
                'unavailable';
        }
    }, { // [51]
        name: 'Pyramid',
        is_opened: false,
        is_available: function() {
            return items.agahnim || items.glove && items.hammer && items.moonpearl ||
                items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
        }
    }, { // [52]
        name: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
        }
    }, { // [53]
        name: 'Zora River Ledge <img src="images/flippers.png" class="mini">',
        is_opened: false,
        is_available: function() {
            if (items.flippers) return 'available';
            if (items.glove) return 'possible';
            return 'unavailable';
        }
    }, { // [54]
        name: 'Buried Itam <img src="images/shovel.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.shovel ? 'available' : 'unavailable';
        }
    }, { // [55]
        name: 'Escape Sewer Side Room (3) <img src="images/glove.png" class="mini"> + <img src="images/bomb.png" class="mini">/<img src="images/boots.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return is_standard || items.glove ? 'available' :
                items.lantern ? 'possible' : 'dark';
        }
    }, { // [56]
        name: "Castle Secret Entrance (Uncle + 1)",
        is_opened: is_standard,
        is_available: always
    }, { // [57]
        name: 'Hyrule Castle Dungeon (3)',
        is_opened: is_standard,
        is_available: always
    }, { // [58]
        name: 'Sanctuary',
        is_opened: is_standard,
        is_available: always
    }, { // [59]
        name: 'Mad Batter <img src="images/hammer.png" class="mini">/<img src="images/mirror.png" class="mini"> + <img src="images/powder.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
        }
    }, { // [60]
        name: 'Take the frog home <img src="images/mirror.png" class="mini">',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
        }
    }, { // [61]
        name: 'Fat Fairy: Buy OJ bomb from Dark Link\'s House after <img src="images/crystal0.png" class="mini">5 <img src="images/crystal0.png" class="mini">6 (2 items)',
        is_opened: false,
        is_available: function() {
            //crystal check
            var crystal_count = 0;
            for (var k = 0; k < 10; k++) {
                if (prizes[k] === 4 && items['boss'+k] === 2)
                    crystal_count += 1;
            }

            if (!items.moonpearl || crystal_count < 2) return 'unavailable';
            return items.hammer && (items.agahnim || items.glove) ||
                items.agahnim && items.mirror && can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [62]
        name: 'Master Sword Pedestal <img src="images/pendant0.png" class="mini"><img src="images/pendant1.png" class="mini"><img src="images/pendant2.png" class="mini"> (can check with <img src="images/book.png" class="mini">)',
        is_opened: false,
        is_available: function() {
            var pendant_count = 0;
            for (var k = 0; k < 10; k++) {
                if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k] === 2) {
                    if (++pendant_count === 3) return 'available';
                }
            }
            return 'unavailable';
        }
    }, { // [63]
        name: 'Escape Sewer Dark Room',
        is_opened: is_standard,
        is_available: function() {
            return items.lantern ? 'available' : 'dark';
        }
    }];
}(window));
