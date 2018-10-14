(function(window) {
    'use strict';

    function always() { return 'available'; }

    var dungeons = {
        eastern: {
            caption: 'Eastern Palace {lantern}',
            chest_limit: 3,
            can_complete: function(items) {
                return items.has_bow() ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            },
            can_progress: function(items) {
                return (this.chests > 2 || items.lantern) &&
                    (this.chests > 1 || items.has_bow()) ?
                    'available' : 'possible';
            }
        },
        desert: {
            caption: 'Desert Palace',
            chest_limit: 2,
            can_enter: function(items) {
                return items.book || items.flute && items.glove === 2 && items.mirror;
            },
            can_complete: function(items) {
                if (!(items.has_melee_bow() || items.has_cane() || items.has_rod())) return 'unavailable';
                if (!this.can_enter(items)) return 'unavailable';
                if (!items.glove || !items.has_fire()) return 'unavailable';
                return items.boots ? 'available' : 'possible';
            },
            can_progress: function(items) {
                if (!this.can_enter(items)) return 'unavailable';
                if (items.glove && items.has_fire() && items.boots) return 'available';
                return this.chests > 1 && items.boots ? 'available' : 'possible';
            }
        },
        hera: {
            caption: 'Tower of Hera',
            chest_limit: 2,
            can_enter: function(items) {
                return (items.mirror || items.hookshot && items.hammer) && (items.glove || items.flute);
            },
            can_complete: function(items) {
                return items.has_melee() ? this.can_progress(items) : 'unavailable';
            },
            can_progress: function(items) {
                return this.can_enter(items) ?
                    items.has_fire() ?
                        items.flute || items.lantern ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        darkness: {
            caption: 'Palace of Darkness {lantern}',
            darkworld: true,
            chest_limit: 5,
            can_enter: function(items, model) {
                return items.moonpearl && (model.agahnim() || items.glove && items.hammer || items.glove === 2 && items.flippers);
            },
            can_complete: function(items, model) {
                return this.can_enter(items, model) && items.has_bow() && items.hammer ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            },
            can_progress: function(items, model) {
                return this.can_enter(items, model) ?
                    items.has_bow() && items.lantern &&
                        (this.chests > 1 || items.hammer) ?
                        'available' : 'possible' :
                    'unavailable';
            }
        },
        swamp: {
            caption: 'Swamp Palace {mirror}',
            darkworld: true,
            chest_limit: 6,
            can_enter: function(items, model) {
                return items.moonpearl && items.mirror && items.flippers &&
                    (items.can_reach_outcast(model.agahnim()) || model.agahnim() && items.hammer);
            },
            can_complete: function(items, model) {
                return this.can_enter(items, model) && items.hammer && items.hookshot ? 'available' : 'unavailable';
            },
            can_progress: function(items, model) {
                if (!this.can_enter(items, model)) return 'unavailable';
                if (this.chests <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : 'available';
                if (this.chests <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : 'available';
                if (this.chests <= 5) return !items.hammer ? 'unavailable' : 'available';
                return !items.hammer ? 'possible' : 'available';
            }
        },
        skull: {
            caption: 'Skull Woods',
            darkworld: true,
            chest_limit: 2,
            can_enter: function(items, model) {
                return items.can_reach_outcast(model.agahnim());
            },
            can_complete: function(items, model) {
                return this.can_enter(items, model) &&
                    items.firerod && items.sword ? 'available' : 'unavailable';
            },
            can_progress: function(items, model) {
                return this.can_enter(items, model) ?
                    items.firerod && (this.chests > 1 || items.sword) ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        thieves: {
            caption: 'Thieves\' Town',
            darkworld: true,
            chest_limit: 4,
            can_enter: function(items, model) {
                return items.can_reach_outcast(model.agahnim());
            },
            can_complete: function(items, model) {
                return (items.has_melee() || items.has_cane()) && this.can_enter(items, model) ? 'available' : 'unavailable';
            },
            can_progress: function(items, model) {
                return this.can_enter(items, model) ?
                    this.chests > 1 || items.hammer ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        ice: {
            caption: 'Ice Palace (yellow = might need bomb jump)',
            darkworld: true,
            chest_limit: 3,
            can_enter: function(items) {
                return items.moonpearl && items.flippers && items.glove === 2 && (items.firerod || items.sword && items.bombos);
            },
            can_complete: function(items) {
                return this.can_enter(items) && items.hammer ?
                    items.hookshot || items.somaria ? 'available' : 'possible' :
                    'unavailable';
            },
            can_progress: function(items) {
                return this.can_enter(items) ?
                    items.hammer ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        mire: {
            caption: medallion_caption('Misery Mire {medallion}{lantern}', 'mire'),
            darkworld: true,
            chest_limit: 2,
            can_enter: function(items) {
                return items.moonpearl && items.flute && items.glove === 2 && (items.boots || items.hookshot);
            },
            can_complete: function(items) {
                return this.can_enter(items) && items.somaria ?
                    items.medallion_check(this.medallion) || (items.has_fire() ?
                        items.lantern ? 'available' : 'dark' :
                        'possible') :
                    'unavailable';
            },
            can_progress: function(items) {
                return this.can_enter(items) ?
                    items.medallion_check(this.medallion) || (
                        (this.chests > 1 ?
                            items.has_fire() :
                            items.lantern && items.somaria) ?
                        'available' : 'possible') :
                    'unavailable';
            }
        },
        turtle: {
            caption: medallion_caption('Turtle Rock {medallion}{lantern}', 'turtle'),
            darkworld: true,
            chest_limit: 5,
            can_enter: function(items) {
                return items.moonpearl && items.hammer && items.glove === 2 && items.somaria && (items.hookshot || items.mirror);
            },
            can_complete: function(items) {
                return this.can_enter(items) && items.icerod && items.firerod ?
                    items.medallion_check(this.medallion) || (items.byrna || items.cape || items.shield === 3 ?
                        items.lantern ? 'available' : 'dark' :
                        'possible') :
                'unavailable';
            },
            can_progress: function(items) {
                var state = this.can_enter(items) ? items.medallion_check(this.medallion) : 'unavailable';
                if (state) return state;

                var laser_safety = items.byrna || items.cape || items.shield === 3,
                    dark_room = items.lantern ? 'available' : 'dark';
                if (this.chests <= 1) return !laser_safety ? 'unavailable' : items.firerod && items.icerod ? dark_room : 'possible';
                if (this.chests <= 2) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
                if (this.chests <= 4) return laser_safety && items.firerod && items.lantern ? 'available' : 'possible';
                return items.firerod && items.lantern ? 'available' : 'possible';
            }
        }
    };

    var encounters = {
        agahnim: {
            caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
            can_complete: function(items) {
                return items.sword >= 2 || items.cape && items.sword ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            }
        }
    };

    var chests = {
        altar: {
            caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
            is_available: function(items, model) {
                var pendant_count = Object.keys(model.dungeons).reduce(function(s, name) {
                    var dungeon = model.dungeons[name];
                    return [1,2].includes(dungeon.prize) && dungeon.completed ? s + 1 : s;
                }, 0);

                return pendant_count >= 3 ? 'available' :
                    items.book ? 'possible' : 'unavailable';
            }
        },
        mushroom: {
            caption: 'Mushroom',
            is_available: always
        },
        hideout: {
            caption: 'Forest Hideout',
            is_available: always
        },
        tree: {
            caption: 'Lumberjack Tree {agahnim}{boots}',
            is_available: function(items, model) {
                return model.agahnim() && items.boots ? 'available' : 'possible';
            }
        },
        lost_man: {
            caption: 'Lost Old Man {lantern}',
            is_available: function(items) {
                return items.glove || items.flute ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        spectacle_cave: {
            caption: 'Spectacle Rock Cave',
            is_available: function(items) {
                return items.glove || items.flute ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        spectacle_rock: {
            caption: 'Spectacle Rock {mirror}',
            is_available: function(items) {
                return items.glove || items.flute ?
                    items.mirror ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        ether: {
            caption: 'Ether Tablet {sword2}{book}',
            is_available: function(items) {
                return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
                    items.sword >= 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        paradox: {
            caption: 'Death Mountain East (5 + 2 {bomb})',
            is_available: function(items) {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        spiral: {
            caption: 'Spiral Cave',
            is_available: function(items) {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        island_dm: {
            caption: 'Floating Island {mirror}',
            is_available: function(items) {
                return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
                    items.mirror && items.moonpearl && items.glove === 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        mimic: {
            caption: medallion_caption('Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion} unkown OR possible w/out {firerod})', 'turtle'),
            is_available: function(items, model) {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
                var state = items.medallion_check(model.dungeons.turtle.medallion);
                if (state) return state;

                return items.firerod ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible';
            }
        },
        graveyard_w: {
            caption: 'West of Sanctuary {boots}',
            is_available: function(items) {
                return items.boots ? 'available' : 'unavailable';
            }
        },
        graveyard_n: {
            caption: 'Graveyard Cliff Cave {mirror}',
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) && items.mirror ? 'available' : 'unavailable';
            }
        },
        graveyard_e: {
            caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
            is_available: function(items, model) {
                return items.boots && (items.glove === 2 || items.can_reach_outcast(model.agahnim()) && items.mirror) ? 'available' : 'unavailable';
            }
        },
        witch: {
            caption: 'Witch: Give her {mushroom}',
            is_available: function(items) {
                return items.mushroom ? 'available' : 'unavailable';
            }
        },
        fairy_lw: {
            caption: 'Waterfall of Wishing (2) {flippers}',
            is_available: function(items) {
                return items.flippers ? 'available' : 'unavailable';
            }
        },
        zora: {
            caption: 'King Zora: Pay 500 rupees',
            is_available: function(items) {
                return items.flippers || items.glove ? 'available' : 'unavailable';
            }
        },
        river: {
            caption: 'Zora River Ledge {flippers}',
            is_available: function(items) {
                return items.flippers ? 'available' :
                    items.glove ? 'possible' :
                    'unavailable';
            }
        },
        well: {
            caption: 'Kakariko Well (4 + {bomb})',
            is_available: always
        },
        thief_hut: {
            caption: 'Thieve\'s Hut (4 + {bomb})',
            is_available: always
        },
        bottle: {
            caption: 'Bottle Vendor: Pay 100 rupees',
            is_available: always
        },
        chicken: {
            caption: 'Chicken House {bomb}',
            is_available: always
        },
        kid: {
            caption: 'Dying Boy: Distract him with {bottle} so that you can rob his family!',
            is_available: function(items) {
                return items.bottle ? 'available' : 'unavailable';
            }
        },
        tavern: {
            caption: 'Tavern',
            is_available: always
        },
        frog: {
            caption: 'Take the frog home {mirror} / Save+Quit',
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            }
        },
        bat: {
            caption: 'Mad Batter {hammer}/{mirror} + {powder}',
            is_available: function(items) {
                return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
            }
        },
        sahasrahla_hut: {
            caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
            is_available: always
        },
        sahasrahla: {
            caption: 'Sahasrahla {pendant0}',
            is_available: function(items, model) {
                return Object.keys(model.dungeons).reduce(function(state, name) {
                    var dungeon = model.dungeons[name];
                    return dungeon.prize === 1 && dungeon.completed ? 'available' : state;
                }, 'unavailable');
            }
        },
        maze: {
            caption: 'Race Minigame {bomb}/{boots}',
            is_available: always
        },
        library: {
            caption: 'Library {boots}',
            is_available: function(items) {
                return items.boots ? 'available' : 'possible';
            }
        },
        dig_grove: {
            caption: 'Buried Itam {shovel}',
            is_available: function(items) {
                return items.shovel ? 'available' : 'unavailable';
            }
        },
        desert_w: {
            caption: 'Desert West Ledge {book}/{mirror}',
            is_available: function(items) {
                return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
            }
        },
        desert_ne: {
            caption: 'Checkerboard Cave {mirror}',
            is_available: function(items) {
                return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
            }
        },
        aginah: {
            caption: 'Aginah\'s Cave {bomb}',
            is_available: always
        },
        bombos: {
            caption: 'Bombos Tablet {mirror}{sword2}{book}',
            is_available: function(items, model) {
                return items.book && items.mirror && (items.can_reach_outcast(model.agahnim()) || model.agahnim() && items.moonpearl && items.hammer) ?
                    items.sword >= 2 ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        grove_s: {
            caption: 'South of Grove {mirror}',
            is_available: function(items, model) {
                return items.mirror && (items.can_reach_outcast(model.agahnim()) || model.agahnim() && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
            }
        },
        dam: {
            caption: 'Light World Swamp (2)',
            is_available: always
        },
        lake_sw: {
            caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
            is_available: always
        },
        ice_cave: {
            caption: 'Ice Rod Cave {bomb}',
            is_available: always
        },
        island_lake: {
            caption: 'Lake Hylia Island {mirror}',
            is_available: function(items, model) {
                return items.flippers && items.moonpearl && items.mirror &&
                    (model.agahnim() || items.glove === 2 || items.glove && items.hammer) ? 'available' : 'possible';
            }
        },
        hobo: {
            caption: 'Fugitive under the bridge {flippers}',
            is_available: function(items) {
                return items.flippers ? 'available' : 'unavailable';
            }
        },
        link_house: {
            caption: 'Stoops Lonk\'s Hoose',
            is_available: always
        },
        secret: {
            caption: "Castle Secret Entrance (Uncle + 1)",
            is_available: always
        },
        castle: {
            caption: 'Hyrule Castle Dungeon (3)',
            is_available: always
        },
        escape_dark: {
            caption: 'Escape Sewer Dark Room {lantern}',
            is_available: function(items) {
                return items.lantern ? 'available' : 'dark';
            }
        },
        escape_side: {
            caption: 'Escape Sewer Side Room (3) {bomb}/{boots} (yellow = need small key)',
            is_available: function(items) {
                return items.glove ? 'available' :
                    items.lantern ? 'possible' : 'dark';
            }
        },
        sanctuary: {
            caption: 'Sanctuary',
            is_available: always
        },
        bumper: {
            caption: 'Bumper Cave {cape}',
            darkworld: true,
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) ?
                    items.glove && items.cape ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        spike: {
            caption: 'Byrna Spike Cave',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        bunny: {
            caption: 'Super Bunny Chests (2)',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        rock_hook: {
            caption: 'Cave Under Rock (3 top chests) {hookshot}',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && items.hookshot ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        rock_boots: {
            caption: 'Cave Under Rock (bottom chest) {hookshot}/{boots}',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        catfish: {
            caption: 'Catfish',
            darkworld: true,
            is_available: function(items, model) {
                return items.moonpearl && items.glove && (model.agahnim() || items.hammer || items.glove === 2 && items.flippers) ?
                    'available' : 'unavailable';
            }
        },
        chest_game: {
            caption: 'Treasure Chest Minigame: Pay 30 rupees',
            darkworld: true,
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) ? 'available' : 'unavailable';
            }
        },
        c_house: {
            caption: 'C House',
            darkworld: true,
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) ? 'available' : 'unavailable';
            }
        },
        bomb_hut: {
            caption: 'Bombable Hut {bomb}',
            darkworld: true,
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) ? 'available' : 'unavailable';
            }
        },
        purple: {
            caption: 'Gary\'s Lunchbox (save the frog first)',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            }
        },
        pegs: {
            caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
            }
        },
        fairy_dw: {
            caption: 'Pyramid Faerie: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
            darkworld: true,
            is_available: function(items, model) {
                var crystal_count = Object.keys(model.dungeons).reduce(function(s, name) {
                    var dungeon = model.dungeons[name];
                    return dungeon.prize === 4 && dungeon.completed ? s + 1 : s;
                }, 0);

                if (crystal_count < 2 || !items.moonpearl) return 'unavailable';
                return items.hammer && (model.agahnim() || items.glove) ||
                    model.agahnim() && items.mirror && items.can_reach_outcast(model.agahnim()) ? 'available' : 'unavailable';
            }
        },
        pyramid: {
            caption: 'Pyramid',
            darkworld: true,
            is_available: function(items, model) {
                return model.agahnim() || items.glove && items.hammer && items.moonpearl ||
                    items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
            }
        },
        dig_game: {
            caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
            darkworld: true,
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) || model.agahnim() && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            }
        },
        stumpy: {
            caption: 'Ol\' Stumpy',
            darkworld: true,
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) || model.agahnim() && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            }
        },
        swamp_ne: {
            caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
            darkworld: true,
            is_available: function(items, model) {
                return items.can_reach_outcast(model.agahnim()) || model.agahnim() && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            }
        },
        mire_w: {
            caption: 'West of Mire (2)',
            darkworld: true,
            is_available: function(items) {
                return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
            }
        }
    };

    function update_standard_chests(chests) {
        return update(chests, {
            link_house: { $merge: { marked: true } },
            secret: { $merge: { marked: true } },
            castle: { $merge: { marked: true } },
            escape_dark: { $merge: {
                marked: true,
                is_available: always
            } },
            escape_side: { $merge: {
                caption: 'Escape Sewer Side Room (3) {bomb}/{boots}',
                is_available: always
            } },
            sanctuary: { $merge: { marked: true } }
        });
    }

    function medallion_caption(caption, name) {
        return function(model) {
            var value = model.dungeons[name].medallion;
            return caption.replace('{medallion}', '{medallion'+value+'}');
        };
    }

    window.location_model = function(mode, opts) {
        var location = { dungeons: dungeons, encounters: encounters, chests: chests },
            model = { open: open, standard: standard, keysanity: keysanity };
        return Object.assign(model[mode](location, build, opts),
            { agahnim: function() { return this.encounters.agahnim.completed; } });
    };

    function open(location, build) {
        return {
            dungeons: build.dungeons(location.dungeons),
            encounters: build.encounters(location.encounters),
            chests: build.chests(location.chests)
        };
    }

    function standard(location, build) {
        return open(Object.assign(location, { chests: update_standard_chests(location.chests) }), build);
    }

    var build = {
        dungeons: function(dungeons) {
            return update(_.mapValues(dungeons, function(dungeon) {
                return _.create(dungeon, { chests: dungeon.chest_limit, completed: false, prize: 0 });
            }), {
                mire:   { $merge: { medallion: 0 } },
                turtle: { $merge: { medallion: 0 } }
            });
        },

        encounters: function(encounters) {
            return _.mapValues(encounters, function(encounter) {
                return _.create(encounter, { completed: false });
            });
        },

        chests: function(chests) {
            return _.mapValues(chests, function(chest) {
                return _.create(chest, { marked: chest.marked || false });
            });
        }
    };
}(window));
