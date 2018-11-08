(function(window) {
    'use strict';

    const always = () => 'available';

    const dungeons = {
        eastern: {
            caption: 'Eastern Palace {lamp}',
            chest_limit: 3,
            can_complete(items) {
                return items.has_bow ?
                    items.lamp ? 'available' : 'dark' :
                    'unavailable';
            },
            can_progress(items) {
                return (this.chests > 2 || items.lamp) &&
                    (this.chests > 1 || items.has_bow) ?
                    'available' : 'possible';
            }
        },
        desert: {
            caption: 'Desert Palace',
            chest_limit: 2,
            can_enter(items) {
                return items.book || items.flute && items.glove === 2 && items.mirror;
            },
            can_complete(items) {
                if (!(items.has_melee_bow || items.has_cane || items.has_rod)) return 'unavailable';
                if (!this.can_enter(items)) return 'unavailable';
                if (!items.glove || !items.has_fire) return 'unavailable';
                return items.boots ? 'available' : 'possible';
            },
            can_progress(items) {
                if (!this.can_enter(items)) return 'unavailable';
                if (items.glove && items.has_fire && items.boots) return 'available';
                return this.chests > 1 && items.boots ? 'available' : 'possible';
            }
        },
        hera: {
            caption: 'Tower of Hera',
            chest_limit: 2,
            can_enter(items) {
                return (items.mirror || items.hookshot && items.hammer) && (items.glove || items.flute);
            },
            can_complete(items) {
                return items.has_melee ? this.can_progress(items) : 'unavailable';
            },
            can_progress(items) {
                return this.can_enter(items) ?
                    items.has_fire ?
                        items.flute || items.lamp ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        darkness: {
            caption: 'Palace of Darkness {lamp}',
            darkworld: true,
            chest_limit: 5,
            can_enter(items, model) {
                return items.moonpearl && (model.agahnim() || items.glove && items.hammer || items.glove === 2 && items.flippers);
            },
            can_complete(items, model) {
                return this.can_enter(items, model) && items.has_bow && items.hammer ?
                    items.lamp ? 'available' : 'dark' :
                    'unavailable';
            },
            can_progress(items, model) {
                return this.can_enter(items, model) ?
                    items.has_bow && items.lamp &&
                        (this.chests > 1 || items.hammer) ?
                        'available' : 'possible' :
                    'unavailable';
            }
        },
        swamp: {
            caption: 'Swamp Palace {mirror}',
            darkworld: true,
            chest_limit: 6,
            can_enter(items, model) {
                return items.moonpearl && items.mirror && items.flippers &&
                    (items.can_reach_outcast(model.agahnim()) || model.agahnim() && items.hammer);
            },
            can_complete(items, model) {
                return this.can_enter(items, model) && items.hammer && items.hookshot ? 'available' : 'unavailable';
            },
            can_progress(items, model) {
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
            can_enter(items, model) {
                return items.can_reach_outcast(model.agahnim());
            },
            can_complete(items, model) {
                return this.can_enter(items, model) &&
                    items.firerod && items.sword ? 'available' : 'unavailable';
            },
            can_progress(items, model) {
                return this.can_enter(items, model) ?
                    items.firerod && (this.chests > 1 || items.sword) ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        thieves: {
            caption: 'Thieves\' Town',
            darkworld: true,
            chest_limit: 4,
            can_enter(items, model) {
                return items.can_reach_outcast(model.agahnim());
            },
            can_complete(items, model) {
                return (items.has_melee || items.has_cane) && this.can_enter(items, model) ? 'available' : 'unavailable';
            },
            can_progress(items, model) {
                return this.can_enter(items, model) ?
                    this.chests > 1 || items.hammer ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        ice: {
            caption: 'Ice Palace (yellow = might need bomb jump)',
            darkworld: true,
            chest_limit: 3,
            can_enter(items) {
                return items.moonpearl && items.flippers && items.glove === 2 && (items.firerod || items.sword && items.bombos);
            },
            can_complete(items) {
                return this.can_enter(items) && items.hammer ?
                    items.hookshot || items.somaria ? 'available' : 'possible' :
                    'unavailable';
            },
            can_progress(items) {
                return this.can_enter(items) ?
                    items.hammer ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        mire: {
            caption: medallion_caption('Misery Mire {medallion}{lamp}', 'mire'),
            darkworld: true,
            chest_limit: 2,
            can_enter(items) {
                return items.moonpearl && items.flute && items.glove === 2 && (items.boots || items.hookshot);
            },
            can_complete(items) {
                return this.can_enter(items) && items.somaria ?
                    items.medallion_check(this.medallion) || (items.has_fire ?
                        items.lamp ? 'available' : 'dark' :
                        'possible') :
                    'unavailable';
            },
            can_progress(items) {
                return this.can_enter(items) ?
                    items.medallion_check(this.medallion) || (
                        (this.chests > 1 ?
                            items.has_fire :
                            items.lamp && items.somaria) ?
                        'available' : 'possible') :
                    'unavailable';
            }
        },
        turtle: {
            caption: medallion_caption('Turtle Rock {medallion}{lamp}', 'turtle'),
            darkworld: true,
            chest_limit: 5,
            can_enter(items) {
                return items.moonpearl && items.hammer && items.glove === 2 && items.somaria && (items.hookshot || items.mirror);
            },
            can_complete(items) {
                return this.can_enter(items) && items.icerod && items.firerod ?
                    items.medallion_check(this.medallion) || (items.byrna || items.cape || items.shield === 3 ?
                        items.lamp ? 'available' : 'dark' :
                        'possible') :
                'unavailable';
            },
            can_progress(items) {
                const state = this.can_enter(items) ? items.medallion_check(this.medallion) : 'unavailable';
                if (state) return state;

                const laser_safety = items.byrna || items.cape || items.shield === 3;
                const dark_room = items.lamp ? 'available' : 'dark';
                if (this.chests <= 1) return !laser_safety ? 'unavailable' : items.firerod && items.icerod ? dark_room : 'possible';
                if (this.chests <= 2) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
                if (this.chests <= 4) return laser_safety && items.firerod && items.lamp ? 'available' : 'possible';
                return items.firerod && items.lamp ? 'available' : 'possible';
            }
        }
    };

    const encounters = {
        agahnim: {
            caption: 'Agahnim {mastersword}/ ({cape}{fightersword}){lamp}',
            can_complete(items) {
                return items.sword >= 2 || items.cape && items.sword ?
                    items.lamp ? 'available' : 'dark' :
                    'unavailable';
            }
        }
    };

    const overworld_region = {
        build() {
            return update(this, {
                locations: x => _.mapValues(x, o => _.create(o, { marked: false }))
            });
        }
    };

    const lightworld_deathmountain_west = { ...overworld_region,
        can_enter({ items }) {
            return items.can_flute || items.can_lift_light && items.lamp;
        },
        can_enter_dark({ items }) {
            return items.can_lift_light;
        },
        locations: {
            ether: {
                caption: 'Ether Tablet {mastersword}{book}',
                can_access({ items, mode }) {
                    return items.book && (items.mirror || items.hammer && items.hookshot) &&
                        ((items.mastersword /*|| (mode.swordless && items.hammer)*/) || 'viewable');
                }
            },
            spectacle_rock: {
                caption: 'Spectacle Rock {mirror}',
                can_access({ items }) {
                    return items.mirror || 'viewable';
                }
            },
            spectacle_cave: {
                caption: 'Spectacle Rock Cave'
            },
            old_man: {
                caption: 'Lost Old Man {lamp}',
                can_access({ items }) {
                    return items.lamp || 'dark';
                }
            }
        }
    };

    const lightworld_deathmountain_east = { ...overworld_region,
        can_enter({ items, model }) {
            return (items.hammer && items.mirror || items.hookshot) && model.lightworld_deathmountain_west.can_enter(...arguments);
        },
        can_enter_dark({ items, model }) {
            return (items.hammer && items.mirror || items.hookshot) && model.lightworld_deathmountain_west.can_enter_dark(...arguments);
        },
        locations: {
            island_dm: {
                caption: 'Floating Island {mirror}',
                    can_access({ items }) {
                        return items.mirror && items.moonpearl && items.can_lift_heavy || 'viewable';
                }
            },
            spiral: {
                caption: 'Spiral Cave'
            },
            paradox: {
                caption: 'Death Mountain East (5 + 2 {bomb})'
            },
            mimic: {
                caption: medallion_caption('Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion} unkown OR possible w/out {firerod})', 'turtle'),
                can_access({ items, model, mode }) {
                    const turtle = model.dungeons.turtle;
                    const state = turtle.can_enter(items) && items.mirror && (
                        items.medallion_check(turtle.medallion) || mode.keysanity ?
                            turtle.keys >= 2 :
                            items.firerod || 'possible'
                    );
                    return state !== 'unavailable' ? state : false;
                }
            }
        }
    };

    const lightworld_northwest = { ...overworld_region,
        locations: {
            altar: {
                caption: 'Master Sword Pedestal {pendant-courage}{pendant-power}{pendant-wisdom} (can check with {book})',
                can_access({ items, model }) {
                    // PendantOfPower && PendantOfWisdom && PendantOfCourage
                    const pendants = _.reduce(model.dungeons,
                        (s, dungeon) => dungeon.completed && _.includes(['pendant', 'pendant-green'], dungeon.prize) ? s + 1 : s, 0);
                    return pendants >= 3 || items.book && 'viewable';
                }
            },
            mushroom: {
                caption: 'Mushroom'
            },
            hideout: {
                caption: 'Forest Hideout'
            },
            tree: {
                caption: 'Lumberjack Tree {agahnim}{boots}',
                can_access({ items, model }) {
                    // DefeatAgahnim && items.boots
                    return model.agahnim() && items.boots || 'viewable';
                }
            },
            graveyard_w: {
                caption: 'West of Sanctuary {boots}',
                    can_access({ items }) {
                        return items.boots;
                }
            },
            graveyard_n: {
                caption: 'Graveyard Cliff Cave {mirror}',
                can_access({ items, model }) {
                    return items.mirror && model.darkworld_northwest.can_enter(...arguments);
                }
            },
            graveyard_e: {
                caption: 'King\'s Tomb {boots} + {mitts}/{mirror}',
                    can_access({ items, model }) {
                        return items.boots && (items.can_lift_heavy || items.mirror && model.darkworld_northwest.can_enter(...arguments));
                }
            },
            well: {
                caption: 'Kakariko Well (4 + {bomb})'
            },
            thief_hut: {
                caption: 'Thieve\'s Hut (4 + {bomb})'
            },
            bottle: {
                caption: 'Bottle Vendor: Pay 100 rupees'
            },
            chicken: {
                caption: 'Chicken House {bomb}'
            },
            kid: {
                caption: 'Dying Boy: Distract him with {bottle} so that you can rob his family!',
                can_access({ items }) {
                    return items.has_bottle;
                }
            },
            tavern: {
                caption: 'Tavern'
            },
            // We have chosen to show the frog on light world map
            frog: {
                caption: 'Take the frog home {mirror} / Save+Quit',
                can_access({ items, model }) {
                    return model.darkworld_northwest.can_enter(...arguments) && items.can_lift_heavy;
                }
            },
            bat: {
                caption: 'Mad Batter {hammer}/{mirror} + {powder}',
                can_access({ items }) {
                    return items.powder && (items.hammer || items.moonpearl && items.mirror && items.can_lift_heavy);
                }
            }
        }
    };

    const lightworld_northeast = { ...overworld_region,
        locations: {
            zora: {
                caption: 'King Zora: Pay 500 rupees',
                can_access({ items }) {
                    return items.flippers || items.can_lift_light;
                }
            },
            river: {
                caption: 'Zora River Ledge {flippers}',
                can_access({ items }) {
                    return items.flippers || items.can_lift_light && 'viewable';
                }
            },
            fairy_lw: {
                caption: 'Waterfall of Wishing (2) {flippers}',
                can_access({ items }) {
                    return items.flippers;
                }
            },
            witch: {
                caption: 'Witch: Give her {mushroom}',
                can_access({ items }) {
                    return items.mushroom;
                }
            },
            sahasrahla_hut: {
                    caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}'
            },
            sahasrahla: {
                caption: 'Sahasrahla {pendant-courage}',
                can_access({ model }) {
                    // PendantOfCourage
                    return _.some(model.dungeons, dungeon => dungeon.completed && dungeon.prize === 'pendant-green');
                }
            }
        }
    };

    const lightworld_south = { ...overworld_region,
        locations: {
            maze: {
                    caption: 'Race Minigame {bomb}/{boots}'
            },
            library: {
                caption: 'Library {boots}',
                can_access({ items }) {
                    return items.boots || 'viewable';
                }
            },
            grove_n: {
                caption: 'Buried Itam {shovel}',
                can_access({ items }) {
                    return items.shovel;
                }
            },
            grove_s: {
                caption: 'South of Grove {mirror}',
                can_access({ items, model }) {
                    return items.mirror && model.darkworld_south.can_enter(...arguments);
                }
            },
            link_house: {
                caption: 'Stoops Lonk\'s Hoose'
            },
            desert_w: {
                caption: 'Desert West Ledge {book}/{mirror}',
                can_access({ items }) {  
                    // world.'Desert Palace'.canEnter
                    return items.book || items.can_flute && items.can_lift_heavy && items.mirror || 'viewable';
                }
            },
            desert_ne: {
                caption: 'Checkerboard Cave {mirror}',
                can_access({ items, model }) {
                    return model.darkworld_mire.can_enter(...arguments) && items.mirror;
                }
            },
            aginah: {
                caption: 'Aginah\'s Cave {bomb}'
            },
            bombos: {
                caption: 'Bombos Tablet {mirror}{mastersword}{book}',
                can_access({ items, model, mode }) {
                    return items.book && items.mirror && model.darkworld_south.can_enter(...arguments) &&
                        (items.mastersword /*|| mode.swordless && items.hammer*/ || 'viewable');
                }
            },
            dam: {
                caption: 'Light World Swamp (2)'
            },
            lake_sw: {
                caption: 'Minimoldorm Cave (NPC + 4) {bomb}'
            },
            island_lake: {
                caption: 'Lake Hylia Island {mirror}',
                can_access({ items, model }) {
                    return items.flippers && items.moonpearl && items.mirror && (
                        model.darkworld_south.can_enter(...arguments) ||
                        model.darkworld_northwest.can_enter(...arguments)
                    ) || 'viewable';
                }
            },
            hobo: {
                caption: 'Fugitive under the bridge {flippers}',
                can_access({ items }) {
                    return items.flippers;
                }
            },
            ice_cave: {
                caption: 'Ice Rod Cave {bomb}'
            }
        }
    };

    const lightworld_south_standard = update(lightworld_south, {
        build: build => function() {
            return update(build.call(this), {
                locations: { link_house: { $merge: { marked: true } } }
            });
        }
    });

    const darkworld_deathmountain_west = { ...overworld_region,
        can_enter({ model }) {
            return model.lightworld_deathmountain_west.can_enter(...arguments);
        },
        can_enter_dark({ model }) {
            return model.lightworld_deathmountain_west.can_enter_dark(...arguments);
        },
        locations: {
            spike: {
                caption: 'Byrna Spike Cave',
                    can_access({ items }) {
                        return items.moonpearl && items.hammer && items.can_lift_light && (items.cape || items.byrna);
                }
            }
        }
    };

    const darkworld_deathmountain_east = { ...overworld_region,
        can_enter({ items, model }) {
            return items.can_lift_heavy && model.lightworld_deathmountain_east.can_enter(...arguments);
        },
        can_enter_dark({ items, model }) {
            return items.can_lift_heavy && model.lightworld_deathmountain_east.can_enter_dark(...arguments);
        },
        locations: {
            rock_hook: {
                caption: 'Cave Under Rock (3 top chests) {hookshot}',
                    can_access({ items }) {
                        return items.moonpearl && items.hookshot;
                }
            },
            rock_boots: {
                caption: 'Cave Under Rock (bottom chest) {hookshot}/{boots}',
                    can_access({ items }) {
                        return items.moonpearl && (items.hookshot || items.boots);
                }
            },
            bunny: {
                caption: 'Super Bunny Chests (2)',
                can_access({ items }) {
                    return items.moonpearl;
                }
            }
        }
    };

    const darkworld_northwest = { ...overworld_region,
        can_enter({ items, model }) {
            return items.moonpearl && (
                model.darkworld_northeast.can_enter(...arguments) && items.hookshot && (items.flippers || items.can_lift_light || items.hammer) ||
                items.can_lift_light && items.hammer ||
                items.can_lift_heavy
            );
        },
        locations: {
            bumper: {
                caption: 'Bumper Cave {cape}',
                can_access({ items }) {
                    return items.can_lift_light && items.cape || 'viewable';
                }
            },
            chest_game: {
                caption: 'Treasure Chest Minigame: Pay 30 rupees'
            },
            c_house: {
                caption: 'C House'
            },
            bomb_hut: {
                caption: 'Bombable Hut {bomb}'
            },
            purple: {
                caption: 'Gary\'s Lunchbox (save the frog first)',
                can_access({ items }) {
                    return items.can_lift_heavy;
                }
            },
            pegs: {
                caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
                can_access({ items }) {
                    return items.can_lift_heavy && items.hammer;
                }
            }
        }
    };

    const darkworld_northeast = { ...overworld_region,
        can_enter({ items, model }) {
            // DefeatAgahnim
            return model.agahnim() || items.moonpearl && (
                items.can_lift_light && items.hammer ||
                items.can_lift_heavy && items.flippers
            );
        },
        locations: {
            catfish: {
                caption: 'Catfish',
                can_access({ items, model }) {
                    return items.moonpearl && items.can_lift_light;
                }
            },
            pyramid: {
                caption: 'Pyramid'
            },
            fairy_dw: {
                caption: 'Pyramid Faerie: Buy OJ bomb from Dark Link\'s House after {red-crystal}5 {red-crystal}6 (2 items)',
                can_access({ items, model }) {
                    // Crystal5 && Crystal6
                    const crystals = _.reduce(model.dungeons,
                        (s, dungeon) => dungeon.completed && dungeon.prize === 'crystal-red' ? s + 1 : s, 0);
                    return crystals >= 2 && items.moonpearl && model.darkworld_south.can_enter(...arguments) &&
                        (items.hammer || items.mirror && model.agahnim());
                }
            }
        }
    };

    const darkworld_south = { ...overworld_region,
        can_enter({ items, model }) {
            return items.moonpearl && (
                model.darkworld_northeast.can_enter(...arguments) && (
                    items.hammer ||
                    items.hookshot && (items.can_lift_light || items.flippers)
                ) ||
                items.can_lift_light && items.hammer ||
                items.can_lift_heavy
            );
        },
        locations: {
            dig_game: {
                caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees'
            },
            stumpy: {
                caption: 'Ol\' Stumpy'
            },
            swamp_ne: {
                caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})'
            }
        }
    };

    const darkworld_mire = { ...overworld_region,
        can_enter({ items }) {
            return items.can_flute && items.can_lift_heavy;
        },
        locations: {
            mire_w: {
                caption: 'West of Mire (2)',
                can_access({ items }) {
                    return items.moonpearl;
                }
            }
        }
    };

    const castle_escape = {
        key_limit: 1,
        locations: {
            sanctuary: {
                caption: 'Sanctuary'
            },
            escape_side: {
                caption: 'Escape Sewer Side Room (3) {bomb}/{boots}'
            },
            escape_dark: {
                caption: 'Escape Sewer Dark Room {lamp}'
            },
            castle: {
                caption: 'Hyrule Castle Dungeon (3)'
            },
            secret: {
                caption: 'Castle Secret Entrance (Uncle + 1)'
            }
        }
    };

    const keys_region = {
        build() {
            return update(
                _.create(this, { keys: 0 }), {
                locations: x => _.mapValues(x, o => _.create(o, { marked: false }))
            });
        }
    }

    const castle_escape_open = update({ ...keys_region, ...castle_escape}, {
        locations: {
            escape_side: {
                caption: text => ({ mode }) => mode.keysanity ? text : `${text} (yellow = need small key)`,
                $merge: {
                    can_access({ items, region, mode }) {
                        return items.can_lift_light || (mode.keysanity ?
                            region.keys >= 1 && (items.lamp || 'dark') :
                            items.lamp ? 'possible' : 'dark'
                        );
                    }
                }
            },
            escape_dark: { $merge: {
                can_access({ items }) {
                    return items.lamp || 'dark';
                }
            } }
        }
    });

    const castle_escape_standard = { ...castle_escape,
        build() {
            return update(this, {
                locations: {
                    $apply: x => _.mapValues(x, o => _.create(o, { marked: true })),
                    escape_side: { $merge: { marked: false } }
                }
            });
        }
    };

    function medallion_caption(caption, name) {
        return ({ model }) => caption.replace('{medallion}', `{medallion--${model.dungeons[name].medallion}}`);
    }

    window.location_model = (mode, opts) => {
        const location = {
            dungeons: dungeons,
            encounters: encounters,
            world: {
                lightworld_deathmountain_west,
                lightworld_deathmountain_east,
                lightworld_northwest,
                lightworld_northeast,
                lightworld_south,
                darkworld_deathmountain_west,
                darkworld_deathmountain_east,
                darkworld_northwest,
                darkworld_northeast,
                darkworld_south,
                darkworld_mire,
                castle_escape: castle_escape_open
            }
        };
        const model = { open: open, standard: standard, keysanity: keysanity };
        return {
            ...model[mode](location, build, opts),
            agahnim() { return this.encounters.agahnim.completed; }
        };
    };

    function open(location, build) {
        return {
            dungeons: build.dungeons(location.dungeons),
            encounters: build.encounters(location.encounters),
            ..._.mapValues(location.world, x => x.build())
        };
    }

    function standard(location, build) {
        return open({ ...location, world: {
            ...location.world,
            lightworld_south: lightworld_south_standard,
            castle_escape: castle_escape_standard
        } }, build);
    }

    const build = {
        dungeons(dungeons) {
            return update(_.mapValues(dungeons, (dungeon) =>
                _.create(dungeon, { chests: dungeon.chest_limit, completed: false, prize: 'unknown' })), {
                mire:   { $merge: { medallion: 'unknown' } },
                turtle: { $merge: { medallion: 'unknown' } }
            });
        },

        encounters(encounters) {
            return _.mapValues(encounters, (encounter) =>
                _.create(encounter, { completed: false }));
        }
    };
}(window));
