(function(window) {
    const always = () => 'available';
    const can_enter = function(items, model) { return this.can_enter(items, model) ? 'available' : 'unavailable'; };
    const can_enter_and = (cond) =>
        function(items, model) {
            return this.can_enter(items, model) && cond.call(this, items, model) ? 'available' : 'unavailable';
        };
    const can_enter_and_then = (cond, then) =>
        function(items, model) {
            return this.can_enter(items, model) && cond.call(this, items, model) ? then.call(this, items, model) : 'unavailable';
        };
    const can_enter_state = function(items, model) { return this.can_enter_state(items, model); };
    const can_enter_state_if = (cond) =>
        function(items, model) {
            return cond.call(this, items, model) ? this.can_enter_state(items, model) : 'unavailable';
        };
    const has_keys = function() { return this.keys; };
    const has_big_key = function() { return this.big_key; };
    const available_or_dark = (items) => items.lantern ? 'available' : 'dark';
    const medallion_or_dark = (items) => items.medallion_check(this.medallion) || (items.lantern ? 'available' : 'dark');

    function update_keysanity_dungeons(dungeons, opts) {
        dungeons = update(dungeons, {
            eastern: { $merge: {
                chest_limit: 6,
                key_limit: 0,
                // Todo: verify
                locations: {
                    compass: {
                        caption: 'Compass Chest',
                        can_reach: always
                    },
                    cannonball: {
                        caption: 'Bowling Room',
                        can_reach: always
                    },
                    map: {
                        caption: 'Map Chest',
                        can_reach: always
                    },
                    big_chest: {
                        caption: 'Big Chest',
                        can_reach() {
                            return this.big_key ? 'available' : 'unavailable';
                        }
                    },
                    big_key: {
                        caption: 'Big Key Chest',
                        can_reach: available_or_dark
                    },
                    boss: {
                        caption: 'Armos Knights',
                        second_map: true,
                        can_reach(items) {
                            return this.big_key && items.has_bow ?
                                available_or_dark(items) :
                                'unavailable';
                        }
                    }
                }
            } },

            desert: { $merge: {
                chest_limit: 6,
                key_limit: 1,
                // Todo: verify
                doors: {
                    north: {
                        caption: 'North',
                        can_reach: can_enter_and(function(items) {
                            return items.glove && (this.keys || !this.doors.south.opened);
                        })
                    },
                    south: {
                        caption: 'South',
                        second_map: true,
                        can_reach: can_enter_and(function(items) {
                            return this.keys || items.glove && !this.doors.north.opened;
                        })
                    }
                },
                locations: (() => {
                    const reach_east_wing = function(items) {
                        return this.doors.south.opened || !this.doors.north.opened && items.glove || this.keys;
                    };

                    return {
                        map: {
                            caption: 'Map Chest',
                            second_map: true,
                            can_reach: can_enter
                        },
                        big_chest: {
                            caption: 'Big Chest',
                            second_map: true,
                            can_reach: can_enter_and(has_big_key)
                        },
                        torch: {
                            caption: 'Item on Torch',
                            second_map: true,
                            can_reach: can_enter_and(has => has.boots)
                        },
                        big_key: {
                            caption: 'Big Key Chest',
                            second_map: true,
                            can_reach: can_enter_and(reach_east_wing)
                        },
                        compass: {
                            caption: 'Compass Chest',
                            second_map: true,
                            can_reach: can_enter_and(reach_east_wing)
                        },
                        boss: {
                            caption: 'Lanmolas',
                            can_reach: can_enter_and(function(items) {
                                return (items.has_melee_bow || items.has_cane || items.has_rod) &&
                                    items.glove && (this.doors.north.opened || !this.doors.south.opened || this.keys) &&
                                    items.has_fire && this.big_key;
                            })
                        }
                    };
                })()
            } },

            hera: { $merge: {
                chest_limit: 6,
                key_limit: 1,
                // Todo: verify
                can_enter_state(items) {
                    return this.can_enter(items) ?
                        items.flute || items.lantern ? 'available' : 'dark' :
                        'unavailable';
                },
                locations: {
                    cage: {
                        caption: 'Basement Cage',
                        second_map: true,
                        can_reach: can_enter_state
                    },
                    map: {
                        caption: 'Map Chest',
                        second_map: true,
                        can_reach: can_enter_state
                    },
                    compass: {
                        caption: 'Compass Chest',
                        can_reach: can_enter_state_if(has_big_key)
                    },
                    big_chest: {
                        caption: 'Big Chest',
                        can_reach: can_enter_state_if(has_big_key)
                    },
                    big_key: {
                        caption: 'Big Key Chest',
                        second_map: true,
                        can_reach: can_enter_state_if(function(items) { return this.keys && items.has_fire; })
                    },
                    boss: {
                        caption: 'Moldorm',
                        can_reach: can_enter_state_if(function(items) { return this.big_key && items.has_melee; })
                    }
                }
            } },

            darkness: { $merge: {
                chest_limit: 14,
                key_limit: 6,
                // Todo: verify
                hammery_jump: opts.podbj,
                keys_left() {
                    return this.keys - _.sum(_.map(this.doors, x => x.opened));
                },
                doors: (() => {
                    const keys_left = function() {
                            return this.keys_left();
                    };
                    const reach_arena = function(items) {
                        const keys = this.keys_left();
                        return keys >= 2 || keys && (this.doors.front.opened || items.has_bow && items.hammer);
                    };
                    const reach_back = function(items) {
                        const keys = this.keys_left();
                            return keys >= 3 ||
                                (keys >= 2 || keys && this.doors.arena.opened) &&
                            (this.doors.front.opened || items.has_bow && items.hammer);
                    };

                    return {
                        front: {
                            caption: 'Front',
                            second_map: true,
                            can_reach: can_enter_and(keys_left)
                        },
                        big_key: {
                            caption: 'Big Key',
                            second_map: true,
                            can_reach: can_enter_and(reach_arena)
                        },
                        arena: {
                            caption: 'Arena',
                            can_reach: can_enter_and(reach_arena)
                        },
                        maze: {
                            caption: 'Dark Maze',
                            can_reach: can_enter_and(reach_back)
                        },
                        hellway: {
                            caption: 'Hellway',
                            can_reach: can_enter_and(reach_back)
                        },
                        boss: {
                            caption: 'Boss',
                            can_reach: can_enter_and_then(function(items) {
                                const keys = this.keys_left();
                                return items.has_bow && items.hammer && this.keys_left();
                            }, available_or_dark)
                        }
                    };
                })(),
                locations: (() => {
                    const reach_arena = function(items) { return this.doors.front.opened || this.keys_left() || items.has_bow && items.hammer; };
                    const hammery_or_dark = function(items) { return this.hammery_jump || items.lantern ? 'available' : 'dark'; };

                    return {
                        shooter: {
                            caption: 'Shooter Room',
                            second_map: true,
                            can_reach: can_enter
                        },
                        map: {
                            caption: 'Map Chest',
                            can_reach: can_enter_and(items => items.has_bow)
                        },
                        arena_ledge: {
                            caption: 'Statler & Waldorf',
                            can_reach: can_enter_and(items => items.has_bow)
                        },
                        arena_bridge: {
                            caption: 'Arena Bridge',
                            can_reach: can_enter_and(reach_arena)
                        },
                        stalfos: {
                            caption: 'Southern Cross',
                            second_map: true,
                            can_reach: can_enter_and(reach_arena)
                        },
                        big_key: {
                            caption: 'Big Key Chest',
                            second_map: true,
                            can_reach: can_enter_and(function(items) { return 2
                                - (this.doors.front.opened || items.has_bow && items.hammer)
                                - this.doors.big_key.opened
                                <= this.keys_left();
                            })
                        },
                        compass: {
                            caption: 'Compass Chest (Terrorpin Station)',
                            can_reach: can_enter_and(function(items) { return 2
                                - (this.doors.front.opened || items.has_bow && items.hammer)
                                - this.doors.arena.opened
                                <= this.keys_left();
                            })
                        },
                        basement_left: {
                            caption: 'Treasury - Left Chest',
                            can_reach: can_enter_and_then(function(items) { return 2
                                - (this.doors.front.opened || items.has_bow && items.hammer)
                                - this.doors.arena.opened
                                <= this.keys_left();
                            }, available_or_dark)
                        },
                        basement_right: {
                            caption: 'Treasury - Right Chest',
                            can_reach: can_enter_and_then(function(items) { return 2
                                - (this.doors.front.opened || items.has_bow && items.hammer)
                                - this.doors.arena.opened
                                <= this.keys_left();
                            }, available_or_dark)
                        },
                        big_chest: {
                            caption: 'Big Chest',
                            can_reach: can_enter_and_then(function(items) {
                                return this.big_key && 3
                                    - (this.doors.front.opened || items.has_bow && items.hammer)
                                    - this.doors.arena.opened
                                    - (this.doors.maze.opened || this.hammery_jump)
                                    <= this.keys_left();
                            }, hammery_or_dark)
                        },
                        hellway: {
                            caption: 'Harmless Hellway',
                            can_reach: can_enter_and(function(items) { return 3
                                - (this.doors.front.opened || items.has_bow && items.hammer)
                                - this.doors.arena.opened
                                - this.doors.hellway.opened
                                <= this.keys_left();
                            })
                        },
                        maze_top: {
                            caption: 'Dark Maze - Top Chest',
                            can_reach: can_enter_and_then(function(items) { return 3
                                - (this.doors.front.opened || items.has_bow && items.hammer)
                                - this.doors.arena.opened
                                - (this.doors.maze.opened || this.hammery_jump)
                                <= this.keys_left();
                            }, available_or_dark)
                        },
                        maze_bottom: {
                            caption: 'Dark Maze - Bottom Chest',
                            can_reach: can_enter_and_then(function(items) { return 3
                                - (this.doors.front.opened || items.has_bow && items.hammer)
                                - this.doors.arena.opened
                                - (this.doors.maze.opened || this.hammery_jump)
                                <= this.keys_left();
                            }, available_or_dark)
                        },
                        boss: {
                            caption: 'Helmasaur King',
                            can_reach: can_enter_and_then(function(items) {
                                return items.has_bow && items.hammer && (this.doors.boss.opened || this.keys_left()) && this.big_key;
                            }, available_or_dark)
                        }
                    };
                })()
            } },

            swamp: { $merge: {
                chest_limit: 10,
                key_limit: 1,
                // Todo: verify
                locations: (() => {
                    const has_keys_hammer = function(items) { return this.keys && items.hammer; };
                    const has_keys_hammer_big_key = function(items) { return this.keys && items.hammer && this.big_key; };
                    const has_keys_hammer_hookshot = function(items) { return this.keys && items.hammer && items.hookshot; };

                    return {
                        entrance: {
                            caption: 'Entrance',
                            second_map: true,
                            can_reach: can_enter
                        },
                        map: {
                            caption: 'Map Chest',
                            second_map: true,
                            can_reach: can_enter_and(has_keys)
                        },
                        big_key: {
                            caption: 'Big Key Chest',
                            second_map: true,
                            can_reach: can_enter_and(has_keys_hammer)
                        },
                        west: {
                            caption: 'West Wing',
                            second_map: true,
                            can_reach: can_enter_and(has_keys_hammer)
                        },
                        compass: {
                            caption: 'Compass Chest',
                            second_map: true,
                            can_reach: can_enter_and(has_keys_hammer)
                        },
                        big_chest: {
                            caption: 'Big Chest',
                            second_map: true,
                            can_reach: can_enter_and(has_keys_hammer_big_key)
                        },
                        toilet_left: {
                            caption: 'Toilet - Left Chest',
                            can_reach: can_enter_and(has_keys_hammer_hookshot)
                        },
                        toilet_right: {
                            caption: 'Toilet - Right Chest',
                            can_reach: can_enter_and(has_keys_hammer_hookshot)
                        },
                        waterfall: {
                            caption: 'Waterfall Room',
                            can_reach: can_enter_and(has_keys_hammer_hookshot)
                        },
                        boss: {
                            caption: 'Arrghus',
                            can_reach: can_enter_and(has_keys_hammer_hookshot)
                        }
                    };
                })()
            } },

            skull: { $merge: {
                chest_limit: 7,
                key_limit: 2,
                // Todo: verify
                locations: {
                    big_key: {
                        caption: 'Big Key Chest',
                        second_map: true,
                        can_reach: can_enter
                    },
                    compass: {
                        caption: 'Compass Chest',
                        second_map: true,
                        can_reach: can_enter
                    },
                    map: {
                        caption: 'Map Chest',
                        second_map: true,
                        can_reach: can_enter
                    },
                    pot_prison: {
                        caption: 'Pot Prison',
                        second_map: true,
                        can_reach: can_enter
                    },
                    big_chest: {
                        caption: 'Big Chest',
                        second_map: true,
                        can_reach: can_enter_and(has_big_key)
                    },
                    bridge: {
                        caption: 'Bridge Room',
                        can_reach: can_enter_and(has => has.firerod)
                    },
                    boss: {
                        caption: 'Mothula',
                        can_reach: can_enter_and(function(items) { return items.firerod && items.sword; })
                    }
                }
            } },

            thieves: { $merge: {
                chest_limit: 8,
                key_limit: 1,
                // Todo: verify
                locations: {
                    big_key: {
                        caption: 'Big Key Chest',
                        second_map: true,
                        can_reach: can_enter
                    },
                    map: {
                        caption: 'Map Chest',
                        second_map: true,
                        can_reach: can_enter
                    },
                    compass: {
                        caption: 'Compass Chest',
                        second_map: true,
                        can_reach: can_enter
                    },
                    ambush: {
                        caption: 'Ambush Chest',
                        second_map: true,
                        can_reach: can_enter
                    },
                    attic: {
                        caption: 'Attic',
                        second_map: true,
                        can_reach: can_enter_and(has_big_key)
                    },
                    cell: {
                        caption: "Blind's Cell",
                        can_reach: can_enter_and(has_big_key)
                    },
                    big_chest: {
                        caption: 'Big Chest',
                        can_reach: can_enter_and(function(items) { return this.big_key && this.keys && items.hammer; })
                    },
                    boss: {
                        caption: 'Blind',
                        can_reach: can_enter_and(function(items) { return this.big_key && (items.has_melee || items.has_cane); })
                    }
                }
            } },

            ice: { $merge: {
                chest_limit: 8,
                key_limit: 2,
                // Todo: verify
                bomb_jump: opts.ipbj,
                locations: function() {
                    const reach_east_wing = function(items) {
                        return this.can_enter(items) ?
                            this.bomb_jump || items.hookshot ? 'available' : 'possible' :
                            'unavailable';
                    };

                    return {
                        compass: {
                            caption: 'Compass Chest',
                            second_map: true,
                            can_reach: can_enter
                        },
                        freezor: {
                            caption: 'Freezor Room',
                            can_reach: can_enter
                        },
                        iced_t: {
                            caption: 'Iced T Room',
                            can_reach: can_enter
                        },
                        big_chest: {
                            caption: 'Big Chest',
                            can_reach: can_enter_and(has_big_key)
                        },
                        spike: {
                            caption: function(model) {
                                return 'Spike Room' + (model.dungeons.ice.bomb_jump ? '' : ' (yellow = might waste key without {hammer}, or need bomb jump)');
                            },
                            can_reach: reach_east_wing
                        },
                        big_key: {
                            caption: 'Big Key Chest',
                            second_map: true,
                            can_reach: function(items) {
                                return items.hammer ? reach_east_wing.call(this, items) : 'unavailable';
                            }
                        },
                        map: {
                            caption: 'Map Chest',
                            second_map: true,
                            can_reach: function(items) {
                                return items.hammer ? reach_east_wing.call(this, items) : 'unavailable';
                            }
                        },
                        boss: {
                            caption: function(model) {
                                return 'Kholdstare' + (model.dungeons.ice.bomb_jump ? '' : ' (yellow = might need bomb jump for a small key)');
                            },
                            second_map: true,
                            can_reach: function(items) {
                                return this.can_enter(items) && items.hammer ?
                                    this.bomb_jump ||
                                        this.big_key && (this.keys && items.somaria || this.keys === 2) ?
                                        'available' : 'possible' :
                                    'unavailable';
                            }
                        }
                    };
                }()
            } },

            mire: { $merge: {
                chest_limit: 8,
                key_limit: 3,
                // Todo: verify
                locations: (() => {
                    const can_enter_with_medallion = function(items) {
                        return this.can_enter(items) ? items.medallion_check(this.medallion) || 'available' : 'unavailable';
                    };
                    const can_enter_with_medallion_and = (cond) =>
                        function(items) {
                            return this.can_enter(items) && cond.call(this, items) ? items.medallion_check(this.medallion) || 'available' : 'unavailable';
                        };

                    return {
                        main: {
                            caption: 'Main Lobby',
                            can_reach: can_enter_with_medallion
                        },
                        bridge: {
                            caption: 'Docaty Bridge',
                            can_reach: can_enter_with_medallion
                        },
                        map: {
                            caption: 'Map Chest',
                            can_reach: can_enter_with_medallion
                        },
                        spike: {
                            caption: 'Spike Chest',
                            can_reach: can_enter_with_medallion
                        },
                        compass: {
                            caption: 'Compass Chest',
                            can_reach: can_enter_with_medallion_and(items => items.has_fire)
                        },
                        big_key: {
                            caption: 'Big Key Chest',
                            can_reach: can_enter_with_medallion_and(items => items.has_fire)
                        },
                        big_chest: {
                            caption: 'Big Chest',
                            can_reach: can_enter_with_medallion_and(has_big_key)
                        },
                        boss: {
                            caption: 'Vitreous',
                            second_map: true,
                            can_reach: can_enter_and_then(function(items) { return this.big_key && items.somaria; }, medallion_or_dark)
                        }
                    };
                })()
            } },

            turtle: { $merge: {
                chest_limit: 12,
                key_limit: 4,
                // Todo: verify
                can_enter_state(items) {
                    return this.can_enter(items) ?
                        items.medallion_check(this.medallion) || (items.flute || items.lantern ? 'available' : 'dark') :
                        'unavailable';
                },
                keys_left() {
                    return this.keys + !this.locations.big_key.marked - _.sum(_.map(this.doors, x => x.opened));
                },
                doors: {
                    crystaroller: {
                        caption: 'Crystaroller',
                        can_reach: can_enter_state_if(function() {
                            return this.keys_left() >= 3 && this.big_key;
                        })
                    },
                    boss: {
                        caption: 'Boss',
                        can_reach: can_enter_and_then(function() {
                            const keys = this.keys_left();
                            return (keys >= 4 || keys >= 3 && this.doors.crystaroller.opened) && this.big_key;
                        }, medallion_or_dark)
                    }
                },
                locations: (() => {
                    const laser_bridge = can_enter_and_then(function(items) {
                        return (this.doors.crystaroller.opened || this.keys_left() >= 3) && this.big_key &&
                            (items.cape || items.byrna || items.shield === 3);
                    }, medallion_or_dark);

                    return {
                        compass: {
                            caption: 'Compass Chest',
                            second_map: true,
                            can_reach: can_enter_state
                        },
                        roller_left: {
                            caption: 'Roller Room - Left Chest',
                            second_map: true,
                            can_reach: can_enter_state_if((has) => has.firerod)
                        },
                        roller_right: {
                            caption: 'Roller Room - Right Chest',
                            second_map: true,
                            can_reach: can_enter_state_if((has) => has.firerod)
                        },
                        chain_chomps: {
                            caption: 'Chain Chomps',
                            second_map: true,
                            can_reach: can_enter_state_if(has_keys)
                        },
                        big_key: {
                            caption: 'Big Key Chest',
                            can_reach: can_enter_state_if(function() { return this.keys_left() >= 3; })
                        },
                        big_chest: {
                            caption: 'Big Chest',
                            can_reach: can_enter_state_if(function() { return this.keys >= 2 && this.big_key })
                        },
                        crystaroller: {
                            caption: 'Crystaroller Room',
                            can_reach: can_enter_state_if(function() { return this.keys >= 2 && this.big_key })
                        },
                        eye_bl: {
                            caption: 'Laser Bridge - Bottom Left Chest',
                            can_reach: laser_bridge
                        },
                        eye_br: {
                            caption: 'Laser Bridge - Bottom Right Chest',
                            can_reach: laser_bridge
                        },
                        eye_tl: {
                            caption: 'Laser Bridge - Top Left Chest',
                            can_reach: laser_bridge
                        },
                        eye_tr: {
                            caption: 'Laser Bridge - Top Right Chest',
                            can_reach: laser_bridge
                        },
                        boss: {
                            caption: 'Trinexx',
                            second_map: true,
                            can_reach: can_enter_and_then(function(items) {
                                return 4
                                    - this.doors.crystaroller.opened
                                    - this.doors.boss.opened
                                    <= this.keys_left() && this.big_key && items.firerod && items.icerod;
                            }, medallion_or_dark)
                        }
                    };
                })()
            } }
        });

        return _.mapValues(dungeons, dungeon =>
            update(dungeon, { $merge: {
                can_complete: can_complete,
                can_progress: can_progress,
                is_deviating: is_deviating
            } })
        );
    }

    function can_complete(items, model) {
        return this.locations.boss.can_reach.call(this, items, model);
    }

    function can_progress(items, model) {
        const locations = _.filter(this.locations, location => !location.marked);
        const states = _.map(locations, (location) => location.can_reach.call(this, items, model));
        return _.maxBy(states, state => ['unavailable', 'dark', 'possible', 'available'].indexOf(state));
    }

    function is_deviating() {
        return this.chests !== _.filter(this.locations, x => !x.marked).length;
    }

    function update_keysanity_encounters(encounters) {
        return update(encounters, {
            agahnim: { $merge: {
                can_complete(items, model) {
                    return model.regions.castle_tower.keys === 2 ?
                        encounters.agahnim.can_complete.call(this, items) :
                        'unavailable';
                }
            } }
        });
    }

    const keysanity_regions = {
        escape: { key_limit: 1 },
        castle_tower: { key_limit: 2 },
        ganon_tower: { key_limit: 4, chest_limit: 27 }
    };

    // Todo: verify
    function update_keysanity_chests(chests) {
        return update(chests, {
            mimic: { $merge: {
                is_available(items, model) {
                    return items.moonpearl && items.hammer && items.glove === 2 && items.somaria && items.mirror ?
                        items.medallion_check(model.dungeons.turtle.medallion) ||
                            (model.dungeons.turtle.keys > 1 ? 'available' : 'unavailable') :
                        'unavailable';
                }
            } },
            escape_side: { $merge: {
                is_available(items, model) {
                    return items.glove || model.regions.escape.keys ?
                        items.glove || items.lantern ? 'available' : 'dark' :
                        'unavailable';
                }
            } },
            $merge: {
                castle_foyer: {
                    caption: 'Castle Tower Foyer',
                    is_available(items) {
                        return items.sword >= 2 || items.cape ? 'available' : 'unavailable';
                    }
                },
                castle_maze: {
                    caption: 'Castle Tower Dark Maze',
                    is_available(items, model) {
                        return model.regions.castle_tower.keys && (items.sword >= 2 || items.cape) ?
                            items.lantern ? 'available' : 'dark' :
                            'unavailable';
                    }
                }
            }
        });
    }

    window.keysanity = function(location, build, opts) {
        return {
            dungeons: build_keysanity_dungeons(build.dungeons(update_keysanity_dungeons(location.dungeons, opts))),
            encounters: build.encounters(update_keysanity_encounters(location.encounters)),
            regions: build_regions(keysanity_regions),
            chests: build.chests(update_keysanity_chests(location.chests))
        };
    };

    function build_keysanity_dungeons(dungeons) {
        return _.mapValues(dungeons, dungeon =>
            update(dungeon, {
                $merge: { keys: 0, big_key: false },
                doors: doors => doors && _.mapValues(doors, door => _.create(door, { opened: false })),
                locations: locations => _.mapValues(locations, location => _.create(location, { marked: false }))
            })
        );
                }

    function build_regions(regions) {
        return update(_.mapValues(regions, region => _.create(region)), {
            escape: { $merge: { keys: 0 } },
            castle_tower: { $merge: { keys: 0 } },
            ganon_tower: {
                $merge: { keys: 0, big_key: false },
                $apply: x => update(x, { $merge: { chests: x.chest_limit } })
            }
        });
    }
}(window));
