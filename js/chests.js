(function(window) {
    'use strict';

    var query = uri_query(),
        is_standard = query.mode === 'standard';

    function can_reach_outcast() {
        return items.moonpearl && (
            items.glove === 2 || items.glove && items.hammer ||
            items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers));
    }

    function medallion_check(i) {
        if (!items.sword || !items.bombos && !items.ether && !items.quake) return 'unavailable';
        if (medallions[i] === 1 && !items.bombos ||
            medallions[i] === 2 && !items.ether ||
            medallions[i] === 3 && !items.quake) return 'unavailable';
        if (medallions[i] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';
    }

    function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 1; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }

    function always() { return 'available'; }

    window.dungeon_names = ['eastern', 'desert', 'hera', 'darkness', 'swamp', 'skull', 'thieves', 'ice', 'mire', 'turtle'];

    window.dungeons = {
        eastern: {
            caption: 'Eastern Palace {lantern}',
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
        },
        desert: {
            caption: 'Desert Palace',
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
        },
        hera: {
            caption: 'Tower of Hera',
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
        },
        darkness: {
            caption: 'Palace of Darkness {lantern}',
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
        },
        swamp: {
            caption: 'Swamp Palace {mirror}',
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
        },
        skull: {
            caption: 'Skull Woods',
            is_beaten: false,
            is_beatable: function() {
                return !can_reach_outcast() || !items.firerod || !items.sword ? 'unavailable' : 'available';
            },
            can_get_chest: function() {
                if (!can_reach_outcast()) return 'unavailable';
                return items.firerod ? 'available' : 'possible';
            }
        },
        thieves: {
            caption: 'Thieves\' Town',
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
        },
        ice: {
            caption: 'Ice Palace (yellow=must bomb jump)',
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
        },
        mire: {
            caption: 'Misery Mire {medallion0}{lantern}',
            is_beaten: false,
            is_beatable: function() {
                if (!melee_bow()) return 'unavailable';
                if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = medallion_check(0);
                if (state) return state;

                return items.lantern || items.firerod ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            },
            can_get_chest: function() {
                if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = medallion_check(0);
                if (state) return state;

                return (items.chest8 > 1 ?
                    items.lantern || items.firerod :
                    items.lantern && items.somaria) ?
                    'available' : 'possible';
            }
        },
        turtle: {
            caption: 'Turtle Rock {medallion0}{lantern}',
            is_beaten: false,
            is_beatable: function() {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                if (!items.icerod || !items.firerod) return 'unavailable';
                var state = medallion_check(1);
                if (state) return state;

                return items.byrna || items.cape || items.shield === 3 ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            },
            can_get_chest: function() {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                var state = medallion_check(1);
                if (state) return state;

                var laser_safety = items.byrna || items.cape || items.shield === 3,
                    dark_room = items.lantern ? 'available' : 'dark';
                if (items.chest9 <= 1) return !laser_safety ? 'unavailable' : items.firerod && items.icerod ? dark_room : 'possible';
                if (items.chest9 <= 2) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
                if (items.chest9 <= 4) return laser_safety && items.firerod && items.lantern ? 'available' : 'possible';
                return items.firerod && items.lantern ? 'available' : 'possible';
            }
        }
    };

    window.encounters = {
        agahnim: {
            caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
            is_available: function() {
                return items.sword >= 2 || items.cape && items.sword ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            }
        }
    };

    window.chests = {
        graveyard_e: {
            caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
            is_opened: false,
            is_available: function() {
                if (!items.boots) return 'unavailable';
                if (can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
                return 'unavailable';
            }
        },
        dam: {
            caption: 'Light World Swamp (2)',
            is_opened: false,
            is_available: always
        },
        link_house: {
            caption: 'Stoops Lonk\'s Hoose',
            is_opened: is_standard,
            is_available: always
        },
        spiral: {
            caption: 'Spiral Cave',
            is_opened: false,
            is_available: function() {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        mimic: {
            caption: 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unkown OR possible w/out {firerod})',
            is_opened: false,
            is_available: function() {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
                var state = medallion_check(1);
                if (state) return state;

                return items.firerod ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible';
            }
        },
        tavern: {
            caption: 'Tavern',
            is_opened: false,
            is_available: always
        },
        chicken: {
            caption: 'Chicken House {bomb}',
            is_opened: false,
            is_available: always
        },
        bomb_hut: {
            caption: 'Bombable Hut {bomb}',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        c_house: {
            caption: 'C House',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        aginah: {
            caption: 'Aginah\'s Cave {bomb}',
            is_opened: false,
            is_available: always
        },
        mire_w: {
            caption: 'West of Mire (2)',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
            }
        },
        bunny: {
            caption: 'Super Bunny Chests (2)',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        sahasrahla_hut: {
            caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
            is_opened: false,
            is_available: always
        },
        spike: {
            caption: 'Byrna Spike Cave',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        well: {
            caption: 'Kakariko Well (4 + {bomb})',
            is_opened: false,
            is_available: always
        },
        thief_hut: {
            caption: 'Thieve\'s Hut (4 + {bomb})',
            is_opened: false,
            is_available: always
        },
        swamp_ne: {
            caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
            }
        },
        paradox: {
            caption: 'Death Mountain East (5 + 2 {bomb})',
            is_opened: false,
            is_available: function() {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        graveyard_w: {
            caption: 'West of Sanctuary {boots}',
            is_opened: false,
            is_available: function() {
                return items.boots ? 'available' : 'unavailable';
            }
        },
        lake_sw: {
            caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
            is_opened: false,
            is_available: always
        },
        ice_cave: {
            caption: 'Ice Rod Cave {bomb}',
            is_opened: false,
            is_available: always
        },
        rock_boots: {
            caption: 'Cave Under Rock (bottom chest) {hookshot}/{boots}',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        rock_hook: {
            caption: 'Cave Under Rock (3 top chests) {hookshot}',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && items.hookshot ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        chest_game: {
            caption: 'Treasure Chest Minigame: Pay 30 rupees',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        bottle: {
            caption: 'Bottle Vendor: Pay 100 rupees',
            is_opened: false,
            is_available: always
        },
        sahasrahla: {
            caption: 'Sahasrahla {pendant0}',
            is_opened: false,
            is_available: function() {
                return dungeon_names.reduce(function(state, name, i) {
                    return prizes[name] === 1 && items['boss'+i] ? 'available' : state;
                }, 'unavailable');
            }
        },
        stumpy: {
            caption: 'Ol\' Stumpy',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            }
        },
        kid: {
            caption: 'Dying Boy: Distract him with {bottle} so that you can rob his family!',
            is_opened: false,
            is_available: function() {
                return items.bottle ? 'available' : 'unavailable';
            }
        },
        purple: {
            caption: 'Gary\'s Lunchbox (save the frog first)',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            }
        },
        hobo: {
            caption: 'Fugitive under the bridge {flippers}',
            is_opened: false,
            is_available: function() {
                return items.flippers ? 'available' : 'unavailable';
            }
        },
        ether: {
            caption: 'Ether Tablet {sword2}{book}',
            is_opened: false,
            is_available: function() {
                return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
                    items.sword >= 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        bombos: {
            caption: 'Bombos Tablet {mirror}{sword2}{book}',
            is_opened: false,
            is_available: function() {
                return items.book && items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ?
                    items.sword >= 2 ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        catfish: {
            caption: 'Catfish',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
                    'available' : 'unavailable';
            }
        },
        zora: {
            caption: 'King Zora: Pay 500 rupees',
            is_opened: false,
            is_available: function() {
                return items.flippers || items.glove ? 'available' : 'unavailable';
            }
        },
        lost_man: {
            caption: 'Lost Old Man {lantern}',
            is_opened: false,
            is_available: function() {
                return items.glove || items.flute ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        witch: {
            caption: 'Witch: Give her {mushroom}',
            is_opened: false,
            is_available: function() {
                return items.mushroom ? 'available' : 'unavailable';
            }
        },
        hideout: {
            caption: 'Forest Hideout',
            is_opened: false,
            is_available: always
        },
        tree: {
            caption: 'Lumberjack Tree {agahnim}{boots}',
            is_opened: false,
            is_available: function() {
                return items.agahnim && items.boots ? 'available' : 'possible';
            }
        },
        spectacle_cave: {
            caption: 'Spectacle Rock Cave',
            is_opened: false,
            is_available: function() {
                return items.glove || items.flute ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        grove_s: {
            caption: 'South of Grove {mirror}',
            is_opened: false,
            is_available: function() {
                return items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
            }
        },
        graveyard_n: {
            caption: 'Graveyard Cliff Cave {mirror}',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() && items.mirror ? 'available' : 'unavailable';
            }
        },
        desert_ne: {
            caption: 'Checkerboard Cave {mirror}',
            is_opened: false,
            is_available: function() {
                return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
            }
        },
        pegs: {
            caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
            }
        },
        library: {
            caption: 'Library {boots}',
            is_opened: false,
            is_available: function() {
                return items.boots ? 'available' : 'possible';
            }
        },
        mushroom: {
            caption: 'Mushroom',
            is_opened: false,
            is_available: always
        },
        spectacle_rock: {
            caption: 'Spectacle Rock {mirror}',
            is_opened: false,
            is_available: function() {
                return items.glove || items.flute ?
                    items.mirror ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        island_dm: {
            caption: 'Floating Island {mirror}',
            is_opened: false,
            is_available: function() {
                return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
                    items.mirror && items.moonpearl && items.glove === 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        maze: {
            caption: 'Race Minigame {bomb}/{boots}',
            is_opened: false,
            is_available: always
        },
        desert_w: {
            caption: 'Desert West Ledge {book}/{mirror}',
            is_opened: false,
            is_available: function() {
                return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
            }
        },
        island_lake: {
            caption: 'Lake Hylia Island {mirror}',
            is_opened: false,
            is_available: function() {
                return items.flippers ?
                    items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
                        'available' : 'possible' :
                    'unavailable';
            }
        },
        bumper: {
            caption: 'Bumper Cave {cape}',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() ?
                    items.glove && items.cape ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        pyramid: {
            caption: 'Pyramid',
            is_opened: false,
            is_available: function() {
                return items.agahnim || items.glove && items.hammer && items.moonpearl ||
                    items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
            }
        },
        dig_game: {
            caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
            is_opened: false,
            is_available: function() {
                return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            }
        },
        river: {
            caption: 'Zora River Ledge {flippers}',
            is_opened: false,
            is_available: function() {
                if (items.flippers) return 'available';
                if (items.glove) return 'possible';
                return 'unavailable';
            }
        },
        dig_grove: {
            caption: 'Buried Itam {shovel}',
            is_opened: false,
            is_available: function() {
                return items.shovel ? 'available' : 'unavailable';
            }
        },
        escape_side: {
            caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (is_standard ? '' : ' (yellow = need small key)'),
            is_opened: false,
            is_available: function() {
                return is_standard || items.glove ? 'available' :
                    items.lantern ? 'possible' : 'dark';
            }
        },
        secret: {
            caption: "Castle Secret Entrance (Uncle + 1)",
            is_opened: is_standard,
            is_available: always
        },
        castle: {
            caption: 'Hyrule Castle Dungeon (3)',
            is_opened: is_standard,
            is_available: always
        },
        sanctuary: {
            caption: 'Sanctuary',
            is_opened: is_standard,
            is_available: always
        },
        bat: {
            caption: 'Mad Batter {hammer}/{mirror} + {powder}',
            is_opened: false,
            is_available: function() {
                return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
            }
        },
        frog: {
            caption: 'Take the frog home {mirror} / Save+Quit',
            is_opened: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            }
        },
        fairy_dw: {
            caption: 'Fat Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
            is_opened: false,
            is_available: function() {
                var crystal_count = dungeon_names.reduce(function(s, name, i) {
                    return prizes[name] === 4 && items['boss'+i] ? s + 1 : s;
                }, 0);

                if (crystal_count < 2 || !items.moonpearl) return 'unavailable';
                return items.hammer && (items.agahnim || items.glove) ||
                    items.agahnim && items.mirror && can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        altar: {
            caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
            is_opened: false,
            is_available: function() {
                var pendant_count = dungeon_names.reduce(function(s, name, i) {
                    return (prizes[name] === 1 || prizes[name] === 2) && items['boss'+i] ? s + 1 : s;
                }, 0);

                return pendant_count >= 3 ? 'available' :
                    items.book ? 'possible' : 'unavailable';
            }
        },
        escape_dark: {
            caption: 'Escape Sewer Dark Room {lantern}',
            is_opened: is_standard,
            is_available: function() {
                return is_standard || items.lantern ? 'available' : 'dark';
            }
        },
        fairy_lw: {
            caption: 'Waterfall of Wishing (2) {flippers}',
            is_opened: false,
            is_available: function() {
                return items.flippers ? 'available' : 'unavailable';
            }
        }
    };
}(window));
