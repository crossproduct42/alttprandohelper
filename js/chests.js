(function(window) {
    'use strict';

    var query = uri_query(),
        is_standard = query.mode === 'standard',
        is_keysanity = query.mode === 'keysanity';

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

    // define dungeon chests
    window.dungeons = [{ // [0]
        caption: 'Eastern Palace {lantern}',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity && !items.bigkey0) return 'unavailable';
            return items.bow > 1 ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        },
        can_get_chest: function() {
            if (is_keysanity) {
                if (items.bigkey0 && items.bow > 1 && items.lantern) return 'available';
                if (items.keychest0 >= 4) return 'possible';
                if (items.keychest0 >= 3 && !items.bigkey0 && !items.lantern) return 'dark';
                if (items.keychest0 >= 3 && (items.bigkey0 || items.lantern)) return 'possible';
                if (items.keychest0 >= 2 && items.bigkey0) return items.lantern ? 'possible' : 'dark';
                if (items.bigkey0 && items.bow > 1 && !items.lantern) return 'dark';
                return 'unavailable';
            } else {
                return items.chest0 <= 2 && !items.lantern ||
                    items.chest0 === 1 && !(items.bow > 1) ?
                    'possible' : 'available';
            }
        }
    }, { // [1]
        caption: 'Desert Palace',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!items.bigkey1) return 'unavailable';
                if (!(melee_bow() || cane() || rod())) return 'unavailable';
                if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (!items.lantern && !items.firerod) return 'unavailable';
                return 'available';
            } else {
                if (!(melee_bow() || cane() || rod())) return 'unavailable';
                if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (!items.lantern && !items.firerod) return 'unavailable';
                return items.boots ? 'available' : 'possible';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (items.bigkey1 && items.smallkey1 === 1 && items.glove && (items.lantern || items.firerod) && items.boots) return 'available';
                if (items.keychest1 === 6) return 'possible';
                if (items.keychest1 >= 5 && (items.bigkey1 || items.boots)) return 'possible';
                if (items.keychest1 >= 4 && (items.smallkey1 === 1 || (items.bigkey1 && items.boots))) return 'possible';
                if (items.keychest1 >= 4 && items.bigkey1 && (items.lantern || items.firerod)) return 'possible';
                if (items.keychest1 >= 3 && items.smallkey1 === 1 && (items.bigkey1 || items.boots)) return 'possible';
                if (items.keychest1 >= 3 && items.bigkey1 && items.boots && (items.lantern || items.firerod)) return 'possible';
                if (items.keychest1 >= 2 && items.bigkey1 && items.smallkey1 === 1 && ((items.glove && items.lantern) || items.boots)) return 'possible';
                return 'unavailable';
            } else {
                if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (items.glove && (items.firerod || items.lantern) && items.boots) return 'available';
                return items.chest1 > 1 && items.boots ? 'available' : 'possible';
            }
        }
    }, { // [2]
        caption: 'Tower of Hera',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!melee() || !items.bigkey2) return 'unavailable';
                if (!items.flute && !items.glove) return 'unavailable';
                if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
                return !items.flute && !items.lantern ? 'dark' : 'available';
            } else {
                if (!melee()) return 'unavailable';
                return this.can_get_chest();
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                if (!(items.flute || items.glove) || !(items.mirror || (items.hookshot && items.hammer))) return 'unavailable';
                if (items.bigkey2 && items.smallkey2 === 1 && melee() && (items.lantern || items.firerod)) return (!items.flute && !items.lantern) ? 'dark' : 'available';
                if (items.keychest2 >= 5) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
                if (items.keychest2 >= 4 && items.smallkey2 === 1 && (items.firerod || items.lantern)) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
                if (items.keychest2 >= 3 && items.bigkey2) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
                if (items.keychest2 >= 2 && items.bigkey2 && (melee() || (items.smallkey2 === 1 && (items.firerod || items.lantern)))) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
                return 'unavailable';
            } else {
                if (!items.flute && !items.glove) return 'unavailable';
                if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
                return items.firerod || items.lantern ?
                    items.flute || items.lantern ? 'available' : 'dark' :
                    'possible';
            }
        }
    }, { // [3]
        caption: 'Palace of Darkness {lantern}',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!items.moonpearl || !(items.bow > 1) || !items.hammer) return 'unavailable';
                if (!items.agahnim && !items.glove) return 'unavailable';
                if (!items.bigkey3 || items.smallkey3 === 0) return 'unavailable';
                if (items.smallkey3 < 6) return items.lantern ? 'possible' : 'dark';
                return items.lantern ? 'available' : 'dark';
            } else {
                if (!items.moonpearl || !(items.bow > 1) || !items.hammer) return 'unavailable';
                if (!items.agahnim && !items.glove) return 'unavailable';
                return items.lantern ? 'available' : 'dark';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                //STILL IN TESTING!
                if (!items.moonpearl) return 'unavailable';
                if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
                if (items.smallkey3 === 6 && items.bigkey3 && items.hammer && items.bow > 1 && items.lantern) return 'available';
                // item count approach
                var reachable = 0;
                var curr_keys = 0;
                var dark_chests = 0;
                curr_keys += items.smallkey3;
                reachable += 1; // free first chest
                // 0 key chests
                if (items.bow > 1) reachable += 2; // bow locked right side
                // conditioned key usage
                if (items.bow > 1 && items.hammer) {
                    reachable += 2; // bridge and dropdown
                } else {
                    if (curr_keys > 0) {
                        reachable += 2; // bridge and dropdown
                        curr_keys -= 1; // front door used
                    }
                }
                // 1 key chests
                if (curr_keys > 0) {
                    reachable += 3; // Back side of POD, since it yields most chests for the key
                    curr_keys -= 1;
                    dark_chests += 2;
                }
                if (curr_keys > 0) {
                    reachable += items.bigkey3 ? 3 : 2; // Dark area with big chest
                    curr_keys -= 1;
                    dark_chests += items.bigkey3 ? 3 : 2;
                }
                if (items.bow > 1 && items.hammer && items.bigkey3 && curr_keys > 0) {
                    reachable += 1; // King Helmasaur. We do not prioritize him when he is beatable. This way we show the max amount of items.
                    curr_keys -= 1;
                    dark_chests += 1;
                }
                if (curr_keys > 0) {
                    reachable += 1; // Spike Room
                    curr_keys -= 1;
                }
                if (curr_keys > 0) {
                    reachable += 1; // Vanilla big key chest
                    curr_keys -= 1;
                }

                if (items.keychest3 > 14 - reachable) {
                    if (items.keychest3 > 14 - (reachable - dark_chests)) {
                        return 'possible';
                    } else {
                        return items.lantern ? 'possible' : 'dark';
                    }
                }

                return 'unavailable'; // We got all reachable chests or even more if helmasaur was not prioritized
            } else {
                if (!items.moonpearl) return 'unavailable';
                if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
                return !(items.bow > 1 && items.lantern) ||
                    items.chest3 === 1 && !items.hammer ?
                    'possible' : 'available';
            }
        }
    }, { // [4]
        caption: 'Swamp Palace {mirror}',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!items.hammer || !items.hookshot || items.smallkey4 === 0) return 'unavailable';
                if (!items.glove && !items.agahnim) return 'unavailable';
                return 'available';
            } else {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!items.hammer || !items.hookshot) return 'unavailable';
                if (!items.glove && !items.agahnim) return 'unavailable';
                return 'available';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!can_reach_outcast() && !(items.agahnim && items.hammer)) return 'unavailable';
                if (items.bigkey4 && items.smallkey4 === 1 && items.hammer && items.hookshot) return 'available';
                if (items.keychest4 === 10) return 'possible';
                if (items.keychest4 >= 9 && items.smallkey4 >= 1) return 'possible';
                if (items.keychest4 >= 6 && items.smallkey4 >= 1 && items.hammer) return 'possible';
                if (items.keychest4 >= 5 && items.smallkey4 >= 1 && items.hammer && items.bigkey4) return 'possible';
                if (items.keychest4 >= 2 && items.smallkey4 >= 1 && items.hammer && items.hookshot) return 'possible';
                return 'unavailable';
            } else {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!can_reach_outcast() && !(items.agahnim && items.hammer)) return 'unavailable';
                if (items.chest4 <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : 'available';
                if (items.chest4 <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : 'available';
                if (items.chest4 <= 5) return !items.hammer ? 'unavailable' : 'available';
                return !items.hammer ? 'possible' : 'available';
            }
        }
    }, { // [5]
        caption: 'Skull Woods',
        is_beaten: false,
        is_beatable: function() {
            return !can_reach_outcast() || !items.firerod || !items.sword ? 'unavailable' : 'available';
        },
        can_get_chest: function() {
            if (is_keysanity) {
                if (!can_reach_outcast()) return 'unavailable';
                if (items.bigkey5 && items.firerod && items.sword > 0) return 'available';
                if (items.keychest5 >= 4) return 'possible';
                if (items.keychest5 >= 3 && (items.bigkey5 || items.firerod)) return 'possible';
                if (items.keychest5 >= 2 && items.firerod && (items.sword > 0 || items.bigkey5)) return 'possible';
                return 'unavailable';
            } else {
                if (!can_reach_outcast()) return 'unavailable';
                return items.firerod ? 'available' : 'possible';
            }
        }
    }, { // [6]
        caption: 'Thieves\' Town',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!(melee() || cane())) return 'unavailable';
                if (!can_reach_outcast()) return 'unavailable';
                if (!items.bigkey6) return 'unavailable';
                return 'available';
            } else {
                if (!(melee() || cane())) return 'unavailable';
                if (!can_reach_outcast()) return 'unavailable';
                return 'available';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                if (!can_reach_outcast()) return 'unavailable';
                if (items.bigkey6 && items.smallkey6 === 1 && items.hammer) return 'available';
                if (items.keychest6 >= 5) return 'possible';
                if (items.keychest6 >= 3 && items.bigkey6) return 'possible';
                if (items.keychest6 >= 2 && items.bigkey6 && (melee() || cane())) return 'possible';
                return 'unavailable';
            } else {
                if (!can_reach_outcast()) return 'unavailable';
                return items.chest6 === 1 && !items.hammer ? 'possible' : 'available';
            }
        }
    }, { // [7]
        caption: 'Ice Palace (yellow=must bomb jump)',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                if (items.bigkey7 && ((items.smallkey7 > 0 && items.somaria) || items.smallkey7 > 1)) return 'available';
                return 'possible'; /* via bomb jump */
            } else {
                if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                return items.hookshot || items.somaria ? 'available' : 'possible';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                //STILL IN TESTING!
                // Logic to match Standard/Open to list possible if wanting to do bomb jump, does allow logic to leave
                // and re-enter dungeon after picking up dungeon small keys
                if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                if (items.bigkey7 && items.hammer) return ((items.smallkey7 === 1 && items.somaria) || items.smallkey7 === 2) ? 'available' : 'possible';
                if (items.bigkey7 && items.hammer) return 'possible';
                if (items.keychest7 >= 5) return 'possible';
                if (items.keychest7 >= 4 && items.bigkey7) return 'possible';
                if (items.keychest7 >= 2 && items.hammer) return 'possible';
                return 'unavailable';
            } else {
                if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                return items.hammer ? 'available' : 'possible';
            }
        }
    }, { // [8]
        caption: 'Misery Mire {medallion0}{lantern}',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!melee_bow()) return 'unavailable';
                if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = medallion_check(0);
                if (state) return state;
                if (!items.bigkey8) return 'unavailable';

                return items.lantern ? 'available' : 'dark'
            } else {
                if (!melee_bow()) return 'unavailable';
                if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = medallion_check(0);
                if (state) return state;

                return items.lantern || items.firerod ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = medallion_check(0);
                if (state) return state;

                if (items.lantern && items.bigkey8 && items.somaria) return 'available';

                if (items.keychest8 >= 5) return 'possible';
                if (items.keychest8 >= 3 && (items.bigkey8 || (items.lantern || items.firerod))) return 'possible';
                if (items.keychest8 >= 3 && items.bigkey8 && items.somaria && !items.lantern && !items.firerod) return 'dark';
                if (items.keychest8 >= 2 && items.firerod && items.bigkey8) return 'possible';
                if (items.keychest8 >= 1 && !items.lantern && items.firerod && items.bigkey8 && items.somaria) return 'dark';
                return 'unavailable';
            } else {
                if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = medallion_check(0);
                if (state) return state;

                return (items.chest8 > 1 ?
                    items.lantern || items.firerod :
                    items.lantern && items.somaria) ?
                    'available' : 'possible';
            }
        }
    }, { // [9]
        caption: 'Turtle Rock {medallion0}{lantern}',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                if (!items.icerod || !items.firerod) return 'unavailable';
                if (!items.bigkey9 || items.smallkey9 < 3) return 'unavailable';
                var state = medallion_check(1);
                if (state) return state;
                if (items.smallkey9 === 3) return items.lantern ? 'possible' : 'dark';
                return items.lantern ? 'available' : 'dark';
            } else {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                if (!items.icerod || !items.firerod) return 'unavailable';
                var state = medallion_check(1);
                if (state) return state;

                return items.byrna || items.cape || items.shield === 3 ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                //STILL IN TESTING!
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                var state = medallion_check(1);
                if (state) return state;

                if (items.bigkey9 && items.smallkey9 === 4 && items.firerod && items.icerod && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
                if (items.keychest9 >= 12) return 'possible';
                if (items.keychest9 >= 10 && (items.firerod || items.smallkey9 >= 2)) return 'possible';
                if (items.keychest9 >= 9 && ((items.smallkey9 >= 1 && items.firerod) || (items.smallkey9 >= 2 && items.bigkey9))) return 'possible';
                if (items.keychest9 >= 8 && items.smallkey9 >= 2 && items.firerod) return 'possible';
                if (items.keychest9 >= 7 && items.bigkey9 && items.smallkey9 >= 2 && items.firerod) return 'possible';
                if (items.keychest9 >= 5 && items.bigkey9 && items.smallkey9 >= 2 && (items.byrna || items.cape || items.shield === 3)) return items.lantern ? 'possible' : 'dark';
                if (items.keychest9 >= 4 && items.bigkey9 && items.smallkey9 >= 3 && (items.byrna || items.cape || items.shield === 3)) return items.lantern ? 'possible' : 'dark';
                if (items.keychest9 >= 3 && items.bigkey9 && items.smallkey9 >= 2 && items.firerod && (items.byrna || items.cape || items.shield === 3)) return items.lantern ? 'possible' : 'dark';
                if (items.keychest9 >= 3 && items.bigkey9 && items.smallkey9 === 4 && items.firerod && items.icerod) return items.lantern ? 'possible' : 'dark';
                if (items.keychest9 >= 2 && items.bigkey9 && items.smallkey9 >= 3 && items.firerod && (items.byrna || items.cape || items.shield === 3)) return items.lantern ? 'possible' : 'dark';
                return 'unavailable';
            } else {
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
    }, { // [10]
        caption: 'Ganon\'s Castle (7 Crystals)',
        is_beaten: false,
        is_beatable: function() {
            if (is_keysanity) {
                var crystal_count = 0;
                for (var k = 0; k < 10; k++) {
                    if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
                        crystal_count++;
                    }
                }
                if (crystal_count === 7 && items.bigkey10 && items.bow > 1 && items.hookshot && (items.firerod || items.lantern)) {
                    if (items.smallkey10 < 3) return 'possible';
                    if (items.smallkey10 >= 3) return 'available';
                }
                return 'unavailable';
            } else {
                return 'unavailable';
            }
        },
        can_get_chest: function() {
            if (is_keysanity) {
                //STILL IN TESTING!
                var crystal_count = 0;
                for (var k = 0; k < 10; k++) {
                    if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
                        crystal_count++;
                    }
                }
                if (crystal_count === 7 && items.glove == 2 && ((items.hookshot && items.hammer) || items.mirror)) {
                    if (items.bigkey10 && items.smallkey10 > 2 && items.bow > 1 &&
                        items.hookshot && items.firerod && items.somaria) return 'available';
                    // Counting reachable items and keys
                    var reachable = 0;
                    var keys = 0;
                    keys += items.smallkey10;
                    keys += 1; // free key on left side
                    // 0 key chests
                    reachable += 2; // first two right side chests
                    if (items.boots) reachable += 1; // torch
                    if (items.somaria) reachable += 1; // tile room
                    if (items.hookshot && items.hammer) reachable += 4; // stalfos room
                    // mini helmasaur room
                    if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod)) {
                        reachable += 2;
                        keys += 1;
                    }
                    // 0 key chests with common sense
                    // rest of the right side chests. The key is gained back after those.
                    if (items.somaria && items.firerod && keys > 0) reachable += 4;
                    // chest before randomizer room. We assume the key in the switch room is used for this one
                    if (items.hookshot && items.hammer) reachable += 1;
                    // room after mini helmasaurs. We assume players keep enough keys to reach top.
                    // If they didnt, then they got other chests for that key.
                    if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod) && keys > 0) {
                        reachable += 1;
                        keys -= 1;
                    }
                    // Chest after Moldorm. See assumptions above.
                    if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod) &&
                        items.hookshot && (items.sword > 0 || items.hammer) && keys > 0) {
                        reachable += 1;
                        keys -= 1;
                    }
                    // 1 key chests
                    if (keys > 0) {
                        // we can reach randomizer room and the area after that
                        if (items.hookshot && items.hammer) {
                            reachable += items.bigkey10 ? 9 : 8;
                            keys -= 1;
                        }
                        // we can reach armos' area via right side
                        else if (items.somaria && items.firerod) {
                            reachable += items.bigkey10 ? 5 : 4;
                            keys -= 1;
                        }
                    }
                    // Vanilla map chest aka double firebar chest. Since one item for
                    // one key is the least bang for the buck we check this one last.
                    if ((items.hookshot || items.boots) && items.hammer && keys > 0) {
                        reachable += 1;
                        keys -= 1;
                    }
                    // 1 key chests
                    // available was checked at the beginning. You can get all items
                    // with 2 smallkey10 alone but let's make it 'possible' in case
                    // someone had to open second right side door to get to armos
                    // in order to get hookshot
                    if (items.keychest10 > (27 - reachable))
                        return 'possible';

                    // We got all reachable items or even more than that in case the player did not follow the 'common sense'
                }
            }
            return 'unavailable';
        }
    }];

    window.agahnim = {
        caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
        is_available: function() {
            if (is_keysanity) {
                return (items.sword >= 2 || items.cape && items.sword) && items.smallkeyhalf1 === 2 ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            } else {
                return items.sword >= 2 || items.cape && items.sword ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            }
        }
    };

    //define overworld chests
    window.chests = [{ // [0]
        caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
        is_opened: false,
        is_available: function() {
            if (!items.boots) return 'unavailable';
            if (can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
            return 'unavailable';
        }
    }, { // [1]
        caption: 'Light World Swamp (2)',
        is_opened: false,
        is_available: always
    }, { // [2]
        caption: 'Stoops Lonk\'s Hoose',
        is_opened: is_standard,
        is_available: always
    }, { // [3]
        caption: 'Spiral Cave',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [4]
        caption: 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unkown OR possible w/out {firerod})',
        is_opened: false,
        is_available: function() {
            if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
            var state = medallion_check(1);
            if (state) return state;

            if (is_keysanity) {
                return items.smallkey9 <= 1 ? 'unavailable' : 'available';
            }

            return items.firerod ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'possible';
        }
    }, { // [5]
        caption: 'Tavern',
        is_opened: false,
        is_available: always
    }, { // [6]
        caption: 'Chicken House {bomb}',
        is_opened: false,
        is_available: always
    }, { // [7]
        caption: 'Bombable Hut {bomb}',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [8]
        caption: 'C House',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [9]
        caption: 'Aginah\'s Cave {bomb}',
        is_opened: false,
        is_available: always
    }, { // [10]
        caption: 'West of Mire (2)',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
        }
    }, { // [11]
        caption: 'Super Bunny Chests (2)',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [12]
        caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
        is_opened: false,
        is_available: always
    }, { // [13]
        caption: 'Byrna Spike Cave',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [14]
        caption: 'Kakariko Well (4 + {bomb})',
        is_opened: false,
        is_available: always
    }, { // [15]
        caption: 'Thieve\'s Hut (4 + {bomb})',
        is_opened: false,
        is_available: always
    }, { // [16]
        caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
        }
    }, { // [17]
        caption: 'Death Mountain East (5 + 2 {bomb})',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [18]
        caption: 'West of Sanctuary {boots}',
        is_opened: false,
        is_available: function() {
            return items.boots ? 'available' : 'unavailable';
        }
    }, { // [19]
        caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
        is_opened: false,
        is_available: always
    }, { // [20]
        caption: 'Ice Rod Cave {bomb}',
        is_opened: false,
        is_available: always
    }, { // [21]
        caption: 'Cave Under Rock (bottom chest) {hookshot}/{boots}',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [22]
        caption: 'Cave Under Rock (3 top chests) {hookshot}',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.hookshot ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [23]
        caption: 'Treasure Chest Minigame: Pay 30 rupees',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [24]
        caption: 'Bottle Vendor: Pay 100 rupees',
        is_opened: false,
        is_available: always
    }, { // [25]
        caption: 'Sahasrahla {pendant0}',
        is_opened: false,
        is_available: function() {
            for (var k = 0; k < 10; k++) {
                if (prizes[k] === 1 && items['boss'+k])
                    return 'available';
            }
            return 'unavailable';
        }
    }, { // [26]
        caption: 'Ol\' Stumpy',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
        }
    }, { // [27]
        caption: 'Dying Boy: Distract him with {bottle} so that you can rob his family!',
        is_opened: false,
        is_available: function() {
            return items.bottle ? 'available' : 'unavailable';
        }
    }, { // [28]
        caption: 'Gary\'s Lunchbox (save the frog first)',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
        }
    }, { // [29]
        caption: 'Fugitive under the bridge {flippers}',
        is_opened: false,
        is_available: function() {
            return items.flippers ? 'available' : 'unavailable';
        }
    }, { // [30]
        caption: 'Ether Tablet {sword2}{book}',
        is_opened: false,
        is_available: function() {
            return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
                items.sword >= 2 ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [31]
        caption: 'Bombos Tablet {mirror}{sword2}{book}',
        is_opened: false,
        is_available: function() {
            return items.book && items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ?
                items.sword >= 2 ? 'available' : 'possible' :
                'unavailable';
        }
    }, { // [32]
        caption: 'Catfish',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
                'available' : 'unavailable';
        }
    }, { // [33]
        caption: 'King Zora: Pay 500 rupees',
        is_opened: false,
        is_available: function() {
            return items.flippers || items.glove ? 'available' : 'unavailable';
        }
    }, { // [34]
        caption: 'Lost Old Man {lantern}',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [35]
        caption: 'Witch: Give her {mushroom}',
        is_opened: false,
        is_available: function() {
            return items.mushroom ? 'available' : 'unavailable';
        }
    }, { // [36]
        caption: 'Forest Hideout',
        is_opened: false,
        is_available: always
    }, { // [37]
        caption: 'Lumberjack Tree {agahnim}{boots}',
        is_opened: false,
        is_available: function() {
            return items.agahnim && items.boots ? 'available' : 'possible';
        }
    }, { // [38]
        caption: 'Spectacle Rock Cave',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [39]
        caption: 'South of Grove {mirror}',
        is_opened: false,
        is_available: function() {
            return items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
        }
    }, { // [40]
        caption: 'Graveyard Cliff Cave {mirror}',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() && items.mirror ? 'available' : 'unavailable';
        }
    }, { // [41]
        caption: 'Checkerboard Cave {mirror}',
        is_opened: false,
        is_available: function() {
            return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
        }
    }, { // [42]
        caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
        }
    }, { // [43]
        caption: 'Library {boots}',
        is_opened: false,
        is_available: function() {
            return items.boots ? 'available' : 'possible';
        }
    }, { // [44]
        caption: 'Mushroom',
        is_opened: false,
        is_available: always
    }, { // [45]
        caption: 'Spectacle Rock {mirror}',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.mirror ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [46]
        caption: 'Floating Island {mirror}',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
                items.mirror && items.moonpearl && items.glove === 2 ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [47]
        caption: 'Race Minigame {bomb}/{boots}',
        is_opened: false,
        is_available: always
    }, { // [48]
        caption: 'Desert West Ledge {book}/{mirror}',
        is_opened: false,
        is_available: function() {
            return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
        }
    }, { // [49]
        caption: 'Lake Hylia Island {mirror}',
        is_opened: false,
        is_available: function() {
            return items.flippers ?
                items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
                    'available' : 'possible' :
                'unavailable';
        }
    }, { // [50]
        caption: 'Bumper Cave {cape}',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ?
                items.glove && items.cape ? 'available' : 'possible' :
                'unavailable';
        }
    }, { // [51]
        caption: 'Pyramid',
        is_opened: false,
        is_available: function() {
            return items.agahnim || items.glove && items.hammer && items.moonpearl ||
                items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
        }
    }, { // [52]
        caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
        }
    }, { // [53]
        caption: 'Zora River Ledge {flippers}',
        is_opened: false,
        is_available: function() {
            if (items.flippers) return 'available';
            if (items.glove) return 'possible';
            return 'unavailable';
        }
    }, { // [54]
        caption: 'Buried Itam {shovel}',
        is_opened: false,
        is_available: function() {
            return items.shovel ? 'available' : 'unavailable';
        }
    }, { // [55]
        caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (is_standard ? '' : ' (yellow = need small key)'),
        is_opened: false,
        is_available: function() {
            if (is_keysanity) {
                if (items.glove) return 'available';
                if (items.smallkeyhalf0 === 1) return items.lantern ? 'available' : 'dark';
                return 'unavailable';
            }
            return is_standard || items.glove ? 'available' :
                items.lantern ? 'possible' : 'dark';
        }
    }, { // [56]
        caption: "Castle Secret Entrance (Uncle + 1)",
        is_opened: is_standard,
        is_available: always
    }, { // [57]
        caption: 'Hyrule Castle Dungeon (3)',
        is_opened: is_standard,
        is_available: always
    }, { // [58]
        caption: 'Sanctuary',
        is_opened: is_standard,
        is_available: always
    }, { // [59]
        caption: 'Mad Batter {hammer}/{mirror} + {powder}',
        is_opened: false,
        is_available: function() {
            return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
        }
    }, { // [60]
        caption: 'Take the frog home {mirror} / Save+Quit',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
        }
    }, { // [61]
        caption: 'Fat Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
        is_opened: false,
        is_available: function() {
            //crystal check
            var crystal_count = 0;
            for (var k = 0; k < 10; k++) {
                if (prizes[k] === 4 && items['boss'+k])
                    crystal_count += 1;
            }

            if (!items.moonpearl || crystal_count < 2) return 'unavailable';
            return items.hammer && (items.agahnim || items.glove) ||
                items.agahnim && items.mirror && can_reach_outcast() ? 'available' : 'unavailable';
        }
    }, { // [62]
        caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
        is_opened: false,
        is_available: function() {
            var pendant_count = 0;
            for (var k = 0; k < 10; k++) {
                if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
                    if (++pendant_count === 3) return 'available';
                }
            }
            return items.book ? 'possible' : 'unavailable';
        }
    }, { // [63]
        caption: 'Escape Sewer Dark Room {lantern}',
        is_opened: is_standard,
        is_available: function() {
            return is_standard || items.lantern ? 'available' : 'dark';
        }
    }, { // [64]
        caption: 'Waterfall of Wishing (2) {flippers}',
        is_opened: false,
        is_available: function() {
            return items.flippers ? 'available' : 'unavailable';
        }
    }, { // [65]
        caption: 'Castle Tower',
        is_opened: false,
        is_available: function() {
            return items.sword >= 2 || items.cape ? 'available' : 'unavailable';
        }
    }, { // [66]
        caption: 'Castle Tower (small key)',
        is_opened: false,
        is_available: function() {
            return (items.sword >= 2 || items.cape) && items.smallkeyhalf1 > 0 ? items.lantern ? 'available' : 'dark' : 'unavailable';
        }
    }];
}(window));
