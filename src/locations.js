(function(window) {
    'use strict';

    const dungeon_region = {
        build() {
            return _.create(this, { chests: this.chest_limit, completed: false, prize: 'unknown' });
        }
    };

    const dungeon_medallion_region = {
        build() {
            return _.create(this, { chests: this.chest_limit, completed: false, prize: 'unknown', medallion: 'unknown' });
        }
    };

    const with_keysanity = (dungeon_region) =>
        update(dungeon_region, {
            build: build => function() {
                return update(build.call(this), {
                    $merge: {
                        keys: 0,
                        big_key: false,
                        can_complete({ region }) {
                            return region.locations.boss.can_access(...arguments);
                        },
                        can_progress({ region }) {
                            return _.maxBy(_.map(_.pickBy(region.locations,
                                x => x.marked === false),
                                x => !x.can_access || x.can_access(...arguments)),
                                x => [false, 'dark', 'possible', true, 'medallion'].indexOf(x));
                        },
                        has_deviating_counts() {
                            return this.chests !== _.filter(this.locations, { marked: false }).length;
                        }
                    },
                    doors: this.doors && (x => _.mapValues(x, o => _.create(o, { opened: false }))),
                    locations: x => _.mapValues(x, o => _.create(o, { marked: false }))
                });
            }
        });

    const eastern = { ...dungeon_region,
        caption: 'Eastern Palace {lamp}',
        chest_limit: 3,
        can_complete({ items }) {
            return items.can_shoot_bow && (items.lamp || 'dark');
        },
        can_progress({ items, region }) {
            return (region.chests > 2 || items.lamp) &&
                (region.chests > 1 || items.can_shoot_bow) || 'possible';
        }
    };

    const eastern_keysanity = with_keysanity({ ...eastern,
        chest_limit: 6,
        key_limit: 0,
        locations: {
            compass: {
                caption: 'Compass Chest'
            },
            cannonball: {
                caption: 'Bowling Room'
            },
            map: {
                caption: 'Map Chest'
            },
            big_chest: {
                caption: 'Big Chest',
                can_access({ region }) {
                    return region.big_key;
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access({ items }) {
                    return items.lamp || 'dark';
                }
            },
            boss: {
                caption: 'Armos Knights',
                second_map: true,
                can_access({ items, region }) {
                    return region.big_key && items.can_shoot_bow && (items.lamp || 'dark');
                }
            }
        }
    });

    const desert = { ...dungeon_region,
        caption: 'Desert Palace',
        chest_limit: 2,
        can_enter({ items }) {
            return items.book || items.mirror && items.can_lift_heavy && items.can_flute;
        },
        can_complete({ items }) {
            return items.can_lift_light && items.can_light_torch &&
                (items.fightersword || items.hammer || items.can_shoot_bow || items.has_rod || items.has_cane) &&
                (items.boots || 'possible');
        },
        can_progress({ items, region }) {
            return items.boots && (items.can_lift_light && items.can_light_torch || region.chests > 1) || 'possible';
        }
    };

    const desert_keysanity = with_keysanity({ ...desert,
        chest_limit: 6,
        key_limit: 1,
        doors: {
            north: {
                caption: 'North',
                can_access({ items, region }) {
                    return items.can_lift_light && (region.keys >= 1 || !region.doors.south.opened);
                }
            },
            south: {
                caption: 'South',
                second_map: true,
                can_access({ items, region }) {
                    return region.keys >= 1 || items.can_lift_light && !region.doors.north.opened;
                }
            }
        },
        locations: {
            map: {
                caption: 'Map Chest',
                second_map: true
            },
            torch: {
                caption: 'Item on Torch',
                second_map: true,
                can_access({ items }) {
                    return items.boots;
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                second_map: true,
                can_access({ items, region }) {
                    return region.keys >= 1 || region.doors.south.opened || !region.doors.north.opened && items.can_lift_light;
                }
            },
            compass: {
                caption: 'Compass Chest',
                second_map: true,
                can_access({ region }) { return region.locations.big_key.can_access(...arguments); }
            },
            big_chest: {
                caption: 'Big Chest',
                second_map: true,
                can_access({ region }) {
                    return region.big_key;
                }
            },
            boss: {
                caption: 'Lanmolas',
                can_access({ items, region }) {
                    return items.can_lift_light && items.can_light_torch &&
                        region.big_key && (region.keys >= 1 || region.doors.north.opened || !region.doors.south.opened) &&
                        (items.fightersword || items.hammer || items.can_shoot_bow || items.has_rod || items.has_cane);
                }
            }
        }
    });

    const hera = { ...dungeon_region,
        caption: 'Tower of Hera',
        chest_limit: 2,
        can_enter({ items, model }) {
            return (items.mirror || items.hookshot && items.hammer) &&
                model.lightworld_deathmountain_west.can_enter(...arguments);
        },
        can_enter_dark({ items, model }) {
            return (items.mirror || items.hookshot && items.hammer) &&
                model.lightworld_deathmountain_west.can_enter_dark(...arguments);
        },
        can_complete({ items }) {
            return (items.fightersword || items.hammer) && (items.can_light_torch || 'possible');
        },
        can_progress({ items }) {
            return items.can_light_torch || 'possible';
        }
    };

    const hera_keysanity = with_keysanity({ ...hera,
        chest_limit: 6,
        key_limit: 1,
        locations: {
            cage: {
                caption: 'Basement Cage',
                second_map: true
            },
            map: {
                caption: 'Map Chest',
                second_map: true
            },
            compass: {
                caption: 'Compass Chest',
                can_access({ region }) {
                    return region.big_key;
                }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access({ region }) { return region.locations.compass.can_access(...arguments); }
            },
            big_key: {
                caption: 'Big Key Chest',
                second_map: true,
                can_access({ items, region }) {
                    return region.keys >= 1 && items.can_light_torch;
                }
            },
            boss: {
                caption: 'Moldorm',
                can_access({ items, region }) {
                    return region.big_key && (items.fightersword || items.hammer);
                }
            }
        }
    });

    const darkness = { ...dungeon_region,
        caption: 'Palace of Darkness {lamp}',
        chest_limit: 5,
        can_enter({ items, model }) {
            return items.moonpearl && model.darkworld_northeast.can_enter(...arguments);
        },
        can_complete({ items }) {
            return items.can_shoot_bow && items.hammer && (items.lamp || 'dark');
        },
        can_progress({ items, region }) {
            return items.can_shoot_bow && items.lamp && (region.chests > 1 || items.hammer) || 'possible';
        }
    };

    const darkness_keysanity = with_keysanity({ ...darkness,
        chest_limit: 14,
        key_limit: 6,
        ...(() => {
            const keys_left = (region) => region.keys - _.sum(_.map(region.doors, x => x.opened));
            return {
                doors: {
                    front: {
                        caption: 'Front',
                        second_map: true,
                        can_access({ region }) {
                            return keys_left(region) >= 1;
                        }
                    },
                    arena: {
                        caption: 'Arena',
                        can_access({ items, region }) {
                            const keys = keys_left(region);
                            return keys >= 2 || keys >= 1 && (region.doors.front.opened || items.can_shoot_bow && items.hammer);
                        }
                    },
                    big_key: {
                        caption: 'Big Key',
                        second_map: true,
                        can_access({ region }) { return region.doors.arena.can_access(...arguments); }
                    },
                    hellway: {
                        caption: 'Hellway',
                        can_access({ items, region }) {
                            const keys = keys_left(region);
                            return keys >= 3 ||
                                (keys >= 2 || keys >= 1 && region.doors.arena.opened) &&
                                (region.doors.front.opened || items.can_shoot_bow && items.hammer);
                        }
                    },
                    maze: {
                        caption: 'Dark Maze',
                        can_access({ region }) { return region.doors.hellway.can_access(...arguments); }
                    },
                    boss: {
                        caption: 'Boss',
                        can_access({ items, region }) {
                            return items.can_shoot_bow && items.hammer && keys_left(region) >= 1 && (items.lamp || 'dark');
                        }
                    }
                },
                locations: {
                    shooter: {
                        caption: 'Shooter Room',
                        second_map: true
                    },
                    arena_ledge: {
                        caption: 'Statler & Waldorf',
                        can_access({ items }) {
                            return items.can_shoot_bow;
                        }
                    },
                    map: {
                        caption: 'Map Chest',
                        can_access({ region }) { return region.locations.arena_ledge.can_access(...arguments); }
                    },
                    arena_bridge: {
                        caption: 'Arena Bridge',
                        can_access({ items, region }) {
                            return region.doors.front.opened || keys_left(region) >= 1 || items.can_shoot_bow && items.hammer;
                        }
                    },
                    stalfos: {
                        caption: 'Southern Cross',
                        second_map: true,
                        can_access({ region }) { return region.locations.arena_bridge.can_access(...arguments); }
                    },
                    big_key: {
                        caption: 'Big Key Chest',
                        second_map: true,
                        can_access({ items, region}) {
                            return keys_left(region) >= 2
                                - (region.doors.front.opened || items.can_shoot_bow && items.hammer)
                                - region.doors.big_key.opened;
                        }
                    },
                    compass: {
                        caption: 'Compass Chest (Terrorpin Station)',
                        can_access({ items, region }) {
                            return keys_left(region) >= 2
                                - (region.doors.front.opened || items.can_shoot_bow && items.hammer)
                                - region.doors.arena.opened;
                        }
                    },
                    basement_left: {
                        caption: 'Treasury - Left Chest',
                        can_access({ items, region }) {
                            return keys_left(region) >= 2
                                - (region.doors.front.opened || items.can_shoot_bow && items.hammer)
                                - region.doors.arena.opened
                                && (items.lamp || 'dark');
                        }
                    },
                    basement_right: {
                        caption: 'Treasury - Right Chest',
                        can_access({ region }) { return region.locations.basement_left.can_access(...arguments); }
                    },
                    hellway: {
                        caption: 'Harmless Hellway',
                        can_access({ items, region }) {
                            return keys_left(region) >= 3
                                - (region.doors.front.opened || items.can_shoot_bow && items.hammer)
                                - region.doors.arena.opened
                                - region.doors.hellway.opened;
                        }
                    },
                    big_chest: {
                        caption: 'Big Chest',
                        can_access({ items, region, mode }) {
                            return region.big_key && keys_left(region) >= 3
                                - (region.doors.front.opened || items.can_shoot_bow && items.hammer)
                                - region.doors.arena.opened
                                - (region.doors.maze.opened || mode.hammery_jump)
                                && (mode.hammery_jump || items.lamp || 'dark');
                        }
                    },
                    maze_top: {
                        caption: 'Dark Maze - Top Chest',
                        can_access({ items, region, mode }) {
                            return keys_left(region) >= 3
                                - (region.doors.front.opened || items.can_shoot_bow && items.hammer)
                                - region.doors.arena.opened
                                - (region.doors.maze.opened || mode.hammery_jump)
                                && (items.lamp || 'dark');
                        }
                    },
                    maze_bottom: {
                        caption: 'Dark Maze - Bottom Chest',
                        can_access({ region }) { return region.locations.maze_top.can_access(...arguments); }
                    },
                    boss: {
                        caption: 'Helmasaur King',
                        can_access({ items, region }) {
                            return items.can_shoot_bow && items.hammer &&
                                region.big_key && (region.doors.boss.opened || keys_left(region) >= 1) &&
                                (items.lamp || 'dark');
                        }
                    }
                }
            };
        })()
    });

    const swamp = { ...dungeon_region,
        caption: 'Swamp Palace {mirror}',
        chest_limit: 6,
        can_enter({ items, model }) {
            return items.moonpearl && items.mirror && items.flippers &&
                model.darkworld_south.can_enter(...arguments);
        },
        can_complete({ items }) {
            return items.hammer && items.hookshot;
        },
        can_progress({ items, region }) {
            return region.chests <= 4 ? items.hammer && (
                items.hookshot || region.chests > 2 && 'possible') :
                items.hammer || region.chests > 5 && 'possible';
        }
    };

    const swamp_keysanity = with_keysanity({ ...swamp,
        chest_limit: 10,
        key_limit: 1,
        locations: {
            entrance: {
                caption: 'Entrance',
                second_map: true
            },
            map: {
                caption: 'Map Chest',
                second_map: true,
                can_access({ region }) {
                    return region.keys >= 1;
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                second_map: true,
                can_access({ items, region }) {
                    return region.keys >= 1 && items.hammer;
                }
            },
            west: {
                caption: 'West Wing',
                second_map: true,
                can_access({ region }) { return region.locations.big_key.can_access(...arguments); }
            },
            compass: {
                caption: 'Compass Chest',
                second_map: true,
                can_access({ region }) { return region.locations.big_key.can_access(...arguments); }
            },
            big_chest: {
                caption: 'Big Chest',
                second_map: true,
                can_access({ items, region }) {
                    return region.keys >= 1 && items.hammer && region.big_key;
                }
            },
            waterfall: {
                caption: 'Waterfall Room',
                can_access({ items, region }) {
                    return region.keys >= 1 && items.hammer && items.hookshot;
                }
            },
            toilet_left: {
                caption: 'Toilet - Left Chest',
                can_access({ region }) { return region.locations.waterfall.can_access(...arguments); }
            },
            toilet_right: {
                caption: 'Toilet - Right Chest',
                can_access({ region }) { return region.locations.waterfall.can_access(...arguments); }
            },
            boss: {
                caption: 'Arrghus',
                can_access({ region }) { return region.locations.waterfall.can_access(...arguments); }
            }
        }
    });

    const skull = { ...dungeon_region,
        caption: 'Skull Woods',
        chest_limit: 2,
        can_enter({ items, model }) {
            return items.moonpearl && model.darkworld_northwest.can_enter(...arguments);
        },
        can_complete({ items }) {
            return items.firerod && (/*mode.swordless ||*/ items.fightersword);
        },
        can_progress({ items, region }) {
            return items.firerod && (region.chests > 1 || /*mode.swordless ||*/ items.fightersword) || 'possible';
        }
    };

    const skull_keysanity = with_keysanity({ ...skull,
        chest_limit: 7,
        key_limit: 2,
        locations: {
            big_key: {
                caption: 'Big Key Chest',
                second_map: true
            },
            compass: {
                caption: 'Compass Chest',
                second_map: true
            },
            map: {
                caption: 'Map Chest',
                second_map: true
            },
            pot_prison: {
                caption: 'Pot Prison',
                second_map: true
            },
            big_chest: {
                caption: 'Big Chest',
                second_map: true,
                can_access({ region }) {
                    return region.big_key;
                }
            },
            bridge: {
                caption: 'Bridge Room',
                can_access({ items }) {
                    return items.firerod;
                }
            },
            boss: {
                caption: 'Mothula',
                can_access({ items }) {
                    return items.firerod && (/*mode.swordless ||*/ items.fightersword);
                }
            }
        }
    });

    const thieves = { ...dungeon_region,
        caption: 'Thieves\' Town',
        chest_limit: 4,
        can_enter({ items, model }) {
            return items.moonpearl && model.darkworld_northwest.can_enter(...arguments);
        },
        can_complete({ items }) {
            return items.fightersword || items.hammer || items.has_cane;
        },
        can_progress({ items, region }) {
            // Since all items could be before big_chest/blind, sword/canes logic is canceled out
            return region.chests > 1 || items.hammer || 'possible';
        }
    };

    const thieves_keysanity = with_keysanity({ ...thieves,
        chest_limit: 8,
        key_limit: 1,
        locations: {
            big_key: {
                caption: 'Big Key Chest',
                second_map: true
            },
            map: {
                caption: 'Map Chest',
                second_map: true
            },
            compass: {
                caption: 'Compass Chest',
                second_map: true
            },
            ambush: {
                caption: 'Ambush Chest',
                second_map: true
            },
            attic: {
                caption: 'Attic',
                second_map: true,
                can_access({ region }) {
                    return region.big_key;
                }
            },
            cell: {
                caption: "Blind's Cell",
                can_access({ region }) { return region.locations.attic.can_access(...arguments); }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access({ items, region }) {
                    return region.big_key && region.keys >= 1 && items.hammer;
                }
            },
            boss: {
                caption: 'Blind',
                can_access({ items, region }) {
                    return region.big_key && (items.fightersword || items.hammer || items.has_cane);
                }
            }
        }
    });

    const ice = { ...dungeon_region,
        caption: 'Ice Palace (yellow = might need bomb jump)',
        chest_limit: 3,
        can_enter({ items }) {
            return items.moonpearl && items.flippers && items.can_lift_heavy && items.can_melt;
        },
        can_complete({ items }) {
            return items.hammer && (items.somaria || items.hookshot || 'possible');
        },
        can_progress({ items }) {
            return items.hammer || 'possible';
        }
    };

    const ice_keysanity = with_keysanity({ ...ice,
        chest_limit: 8,
        key_limit: 2,
        locations: {
            compass: {
                caption: 'Compass Chest',
                second_map: true
            },
            freezor: {
                caption: 'Freezor Room'
            },
            iced_t: {
                caption: 'Iced T Room'
            },
            big_chest: {
                caption: 'Big Chest',
                can_access({ region }) {
                    return region.big_key;
                }
            },
            spike: {
                caption: ({ mode }) => mode.bomb_jump ? 'Spike Room' : 'Spike Room (yellow = might waste key without {hammer}, or need bomb jump)',
                can_access({ items, mode }) {
                    return mode.bomb_jump || items.hookshot || 'possible';
                }
            },
            map: {
                caption: 'Map Chest',
                second_map: true,
                can_access({ items, region }) {
                    return items.hammer && region.locations.spike.can_access(...arguments);
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                second_map: true,
                can_access({ region }) { return region.locations.map.can_access(...arguments); }
            },
            boss: {
                caption: ({ mode }) => mode.bomb_jump ? 'Kholdstare' : 'Kholdstare (yellow = might need bomb jump for a small key)',
                second_map: true,
                can_access({ items, region, mode }) {
                    return items.hammer && (mode.bomb_jump ||
                        region.big_key && (region.keys >= 1 && items.somaria || region.keys >= 2) ||
                        'possible'
                    );
                }
            }
        }
    });

    const medallion_caption = (region, caption) => caption.replace('{medallion}', `{medallion--${region.medallion}}`);

    const medallion_access = ({ items, region }, then = () => true) =>
        !items.has_medallion(region.medallion) ?
            items.might_have_medallion(region.medallion) && 'medallion' : then();

    const mire = { ...dungeon_medallion_region,
        caption: ({ model }) => medallion_caption(model.mire, 'Misery Mire {medallion}{lamp}'),
        chest_limit: 2,
        can_enter({ items, model }) {
            return items.moonpearl && (items.boots || items.hookshot) && (/*mode.swordless ||*/ items.fightersword) &&
                model.darkworld_mire.can_enter(...arguments);
        },
        can_complete({ items }) {
            return items.somaria &&
                // (items.fightersword || items.hammer || items.can_shoot_bow) && // swordless checks
                medallion_access(...arguments, () => items.can_light_torch ? items.lamp || 'dark' : 'possible');
        },
        can_progress({ items, region }) {
            return medallion_access(...arguments, () =>
                (region.chests > 1 ? items.can_light_torch : items.lamp && items.somaria) ||
                'possible');
        }
    };

    const mire_keysanity = with_keysanity({ ...mire,
        chest_limit: 8,
        key_limit: 3,
        locations: {
            main: {
                caption: 'Main Lobby',
                can_access() {
                    return medallion_access(...arguments);
                }
            },
            bridge: {
                caption: 'Docaty Bridge',
                can_access({ region }) { return region.locations.main.can_access(...arguments); }
            },
            map: {
                caption: 'Map Chest',
                can_access({ region }) { return region.locations.main.can_access(...arguments); }
            },
            spike: {
                caption: 'Spike Chest',
                can_access({ region }) { return region.locations.main.can_access(...arguments); }
            },
            compass: {
                caption: 'Compass Chest',
                can_access({ items }) {
                    return items.can_light_torch && medallion_access(...arguments);
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access({ region }) { return region.locations.compass.can_access(...arguments); }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access({ region }) {
                    return region.big_key && medallion_access(...arguments);
                }
            },
            boss: {
                caption: 'Vitreous',
                second_map: true,
                can_access({ items, region }) {
                    return items.somaria && region.big_key &&
                        // (items.fightersword || items.hammer || items.can_shoot_bow) && // swordless checks
                        medallion_access(...arguments, () => items.lamp || 'dark');
                }
            }
        }
    });

    const turtle = { ...dungeon_medallion_region,
        caption: ({ model }) => medallion_caption(model.turtle, 'Turtle Rock {medallion}{lamp}'),
        chest_limit: 5,
        can_enter({ items, model }) {
            return items.moonpearl && items.can_lift_heavy && items.hammer && items.somaria && (/*mode.swordless ||*/ items.fightersword) &&
                model.lightworld_deathmountain_east.can_enter(...arguments);
        },
        can_enter_dark({ items, model }) {
            return items.moonpearl && items.can_lift_heavy && items.hammer && items.somaria && (/*mode.swordless ||*/ items.fightersword) &&
                model.lightworld_deathmountain_east.can_enter_dark(...arguments);
        },
        can_complete({ items, region }) {
            return items.icerod && items.firerod &&
                medallion_access(...arguments, () =>
                    items.can_avoid_laser ? items.lamp || 'dark' : 'possible');
        },
        can_progress({ items, region }) {
            return medallion_access(...arguments, () =>
                (region.chests > 4 || items.can_avoid_laser) &&
                (region.chests > 2 ? items.firerod && items.lamp || 'possible' :
                (region.chests > 1 || items.icerod) && items.firerod ? items.lamp || 'dark' : 'possible'));
        }
    };

    const turtle_keysanity = with_keysanity({ ...turtle,
        chest_limit: 12,
        key_limit: 4,
        ...(() => {
            const keys_left = (region) => region.keys + !region.locations.big_key.marked - _.sum(_.map(region.doors, x => x.opened));
            return {
                doors: {
                    crystaroller: {
                        caption: 'Crystaroller',
                        can_access({ region }) {
                            return keys_left(region) >= 3 && region.big_key && medallion_access(...arguments);
                        }
                    },
                    boss: {
                        caption: 'Boss',
                        can_access({ items, region }) {
                            const keys = keys_left(region);
                            return (keys >= 4 || keys >= 3 && region.doors.crystaroller.opened) && region.big_key &&
                                medallion_access(...arguments, () => items.lamp || 'dark');
                        }
                    }
                },
                locations: {
                    compass: {
                        caption: 'Compass Chest',
                        second_map: true,
                        can_access() {
                            return medallion_access(...arguments);
                        }
                    },
                    roller_left: {
                        caption: 'Roller Room - Left Chest',
                        second_map: true,
                        can_access({ items }) {
                            return items.firerod && medallion_access(...arguments);
                        }
                    },
                    roller_right: {
                        caption: 'Roller Room - Right Chest',
                        second_map: true,
                        can_access({ region }) { return region.locations.roller_left.can_access(...arguments); }
                    },
                    chain_chomps: {
                        caption: 'Chain Chomps',
                        second_map: true,
                        can_access({ region }) {
                            return region.keys >= 1 && medallion_access(...arguments);
                        }
                    },
                    big_key: {
                        caption: 'Big Key Chest',
                        can_access({ region }) {
                            return keys_left(region) >= 3 && medallion_access(...arguments);
                        }
                    },
                    big_chest: {
                        caption: 'Big Chest',
                        can_access({ region }) {
                            return region.big_key && region.keys >= 2 && medallion_access(...arguments);
                        }
                    },
                    crystaroller: {
                        caption: 'Crystaroller Room',
                        can_access({ region }) { return region.locations.big_chest.can_access(...arguments); }
                    },
                    eye_bl: {
                        caption: 'Laser Bridge - Bottom Left Chest',
                        can_access({ items, region }) {
                            return region.big_key && (region.doors.crystaroller.opened || keys_left(region) >= 3) &&
                                items.can_avoid_laser && medallion_access(...arguments, () => items.lamp || 'dark');
                        }
                    },
                    eye_br: {
                        caption: 'Laser Bridge - Bottom Right Chest',
                        can_access({ region }) { return region.locations.eye_bl.can_access(...arguments); }
                    },
                    eye_tl: {
                        caption: 'Laser Bridge - Top Left Chest',
                        can_access({ region }) { return region.locations.eye_bl.can_access(...arguments); }
                    },
                    eye_tr: {
                        caption: 'Laser Bridge - Top Right Chest',
                        can_access({ region }) { return region.locations.eye_bl.can_access(...arguments); }
                    },
                    boss: {
                        caption: 'Trinexx',
                        second_map: true,
                        can_access({ items, region }) {
                            return region.big_key && keys_left(region) >= 4
                                - region.doors.crystaroller.opened
                                - region.doors.boss.opened
                                && items.firerod && items.icerod && medallion_access(...arguments, () => items.lamp || 'dark');
                        }
                    }
                }
            };
        })()
    });

    const encounter_with_keys_region = {
        build() {
            return update(
                _.create(this, { completed: false, keys: 0 }), {
                locations: x => _.mapValues(x, o => _.create(o, { marked: false }))
            });
        }
    };

    const castle_tower = { ...encounter_with_keys_region,
        caption: 'Agahnim {mastersword}/ ({cape}{fightersword}){lamp}',
        key_limit: 2,
        can_enter({ items }) {
            return items.cape || items.mastersword /*|| mode.swordless && items.hammer*/;
        },
        can_complete({ items, region, mode }) {
            return (!mode.keysanity || region.keys >= 2) &&
                (items.fightersword /*|| mode.swordless && (items.hammer || items.net)*/) &&
                (items.lamp || 'dark');
        },
        locations: {
            castle_foyer: {
                caption: 'Castle Tower Foyer'
            },
            castle_maze: {
                caption: 'Castle Tower Dark Maze',
                can_access({ items, region }) {
                    return region.keys >= 1 && (items.lamp || 'dark');
                }
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
                        (items.mastersword /*|| mode.swordless && items.hammer*/ || 'viewable');
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
                caption: ({ model, mode }) => medallion_caption(model.turtle,
                    `Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion} unknown${mode.keysanity ? '' : ' OR possible w/out {firerod}'})`),
                can_access({ items, model: { turtle }, mode }) {
                    // turtle.can_enter_dark to check basic access,
                    // actual dark state from lightworld_deathmountain_east
                    return turtle.can_enter_dark(...arguments) && items.mirror && medallion_access({ items, region: turtle }, () =>
                        mode.keysanity ? turtle.keys >= 2 : items.firerod || 'possible');
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
                    const pendants = _.reduce(model,
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
                can_access({ items }) {
                    return items.moonpearl && items.can_lift_heavy;
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
                    return _.some(model, dungeon => dungeon.completed && dungeon.prize === 'pendant-green');
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
                can_access({ model }) {  
                    return model.desert.can_enter(...arguments) || 'viewable';
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
                    const crystals = _.reduce(model,
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

    const ganon_tower = {
        key_limit: 4,
        chest_limit: 27,
        build() {
            return _.create(this, { keys: 0, big_key: false, chests: this.chest_limit });
        }
    };

    window.location_model = ({ standard, keysanity }) => {
        return {
            ..._.mapValues(_.pickBy({
                eastern: keysanity ? eastern_keysanity : eastern,
                desert: keysanity ? desert_keysanity : desert,
                hera: keysanity ? hera_keysanity : hera,
                darkness: keysanity ? darkness_keysanity : darkness,
                swamp: keysanity ? swamp_keysanity : swamp,
                skull: keysanity ? skull_keysanity : skull,
                thieves: keysanity ? thieves_keysanity : thieves,
                ice: keysanity ? ice_keysanity : ice,
                mire: keysanity ? mire_keysanity : mire,
                turtle: keysanity ? turtle_keysanity : turtle,
                lightworld_deathmountain_west,
                lightworld_deathmountain_east,
                lightworld_northwest,
                lightworld_northeast,
                lightworld_south: standard ? lightworld_south_standard : lightworld_south,
                darkworld_deathmountain_west,
                darkworld_deathmountain_east,
                darkworld_northwest,
                darkworld_northeast,
                darkworld_south,
                darkworld_mire,
                castle_escape: standard ? castle_escape_standard : castle_escape_open,
                castle_tower,
                ganon_tower: keysanity && ganon_tower,
            }), x => x.build()),
            agahnim() { return this.castle_tower.completed; }
        };
    };
}(window));
