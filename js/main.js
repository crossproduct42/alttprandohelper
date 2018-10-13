(function(window) {
    'use strict';

    var slice = Array.prototype.slice;

    var Item = function(props) {
        var name = props.name,
            value = props.value;
        return div('.item', {
            className: classNames(name,
                value === true ? 'active' :
                value > 0 ? 'active-'+value : null),
            onClick: function() { props.onClick(name); }
        });
    };

    var TunicItem = function(props) {
        var value = props.items.tunic,
            has_pearl = props.items.moonpearl;
        return div('.item.tunic', {
            className: classNames('active-'+value, { bunny: !has_pearl }),
            onClick: function() { props.onClick('tunic'); }
        });
    };

    var Dungeon = function(props) {
        var name = props.name,
            dungeon = props.value;
        return [
            div('.boss', {
                className: classNames(name, { defeated: dungeon.completed }),
                onClick: function() { props.onCompletionClick(name); }
            }),
            div('.prize', {
                className: 'prize-'+dungeon.prize,
                onClick: function() { props.onPrizeClick(name); }
            })
        ];
    };

    var WithMedallion = function(Wrapped) {
        return function(props) {
            var name = props.name,
                dungeon = props.value;
            return [
                t(Wrapped, props),
                div('.medallion', {
                    className: 'medallion-'+dungeon.medallion,
                    onClick: function() { props.onMedallionClick(name); }
                })
            ];
        };
    };

    var DungeonWithMedallion = WithMedallion(Dungeon);

    var Keys = function(props) {
        var name = props.name,
            source = props.value;
        return !source.key_limit ?
            div('.keys', span('\u2014')) :
            div('.keys',
                { onClick: function() { props.onClick(name); } },
                span(source.keys+'/'+source.key_limit));
    };

    var BigKey = function(props) {
        var name = props.name,
            source = props.value;
        return div('.big-key', {
            className: classNames({ collected: source.big_key }),
            onClick: function() { props.onClick(name); }
        })
    };

    var WithBigKey = function(Wrapped) {
        return function(props) {
            var name = props.name,
                dungeon = props.value;
            return [
                t(Wrapped, props),
                t(BigKey, { name: props.name, value: props.value, onClick: props.onBigKeyClick })
            ];
        };
    };

    var DungeonWithBigkey = WithBigKey(Dungeon),
        DungeonWithMedallionWithBigkey = WithBigKey(DungeonWithMedallion);

    var SingleChest = function(props) {
        var name = props.name,
            dungeon = props.value;
        return div('.chest', {
                className: classNames({ empty: !dungeon.chests }),
                onClick: function() { props.onClick(name); }
            }, span(''+dungeon.chests));
    }

    var Chests = function(props) {
        var name = props.name,
            dungeon = props.value;
        return div('.chest', {
            className: 'chest-'+dungeon.chests,
            onClick: function() { props.onClick(name); }
        });
    };

    var _tracker = {
        render: function() {
            return div('#tracker', { className: classNames({ cell: this.props.horizontal })},
                grid([
                    grid([
                        this.corner()
                    ], [
                        this.dungeon_boss('eastern'),
                        this.dungeon('eastern')
                    ], [
                        this.dungeon_boss('desert'),
                        this.dungeon('desert')
                    ], [
                        this.dungeon_boss('hera'),
                        this.dungeon('hera')
                    ]),
                    grid([
                        this.item('bow'),
                        this.item('boomerang'),
                        this.item('hookshot'),
                        this.item('mushroom'),
                        this.item('powder')
                    ], [
                        this.item('firerod'),
                        this.item('icerod'),
                        this.item('bombos'),
                        this.item('ether'),
                        this.item('quake')
                    ], [
                        this.item('lantern'),
                        this.item('hammer'),
                        this.item('shovel'),
                        this.item('net'),
                        this.item('book')
                    ], [
                        this.item('bottle'),
                        this.item('somaria'),
                        this.item('byrna'),
                        this.item('cape'),
                        this.item('mirror')
                    ], [
                        this.item('boots'),
                        this.item('glove'),
                        this.item('flippers'),
                        this.item('flute'),
                        this.agahnim()
                    ])
                ], [
                    this.dungeon_boss('darkness'),
                    this.dungeon_boss('swamp'),
                    this.dungeon_boss('skull'),
                    this.dungeon_boss('thieves'),
                    this.dungeon_boss('ice'),
                    this.medallion_dungeon_boss('mire'),
                    this.medallion_dungeon_boss('turtle')
                ], [
                    this.dungeon('darkness'),
                    this.dungeon('swamp'),
                    this.dungeon('skull'),
                    this.dungeon('thieves'),
                    this.dungeon('ice'),
                    this.dungeon('mire'),
                    this.dungeon('turtle')
                ]));
        },

        corner: function() {
            return [
                this.tunic(),
                this.item('sword'),
                this.item('shield'),
                this.item('moonpearl')
            ];
        },

        tunic: function() {
            return t(TunicItem, { items: this.props.model.items, onClick: this.props.item_click });
        },

        item: function(name) {
            return t(Item, { name: name, value: this.props.model.items[name], onClick: this.props.item_click });
        }
    };

    var Tracker = createReactClass(Object.assign({}, _tracker, {
        dungeon_boss: function(name) {
            return t(Dungeon, {
                name: name,
                value: this.props.model.dungeons[name],
                onCompletionClick: partial(this.props.completion_click, 'dungeons'),
                onPrizeClick: this.props.prize_click
            });
        },

        medallion_dungeon_boss: function(name) {
            return t(DungeonWithMedallion, {
                name: name,
                value: this.props.model.dungeons[name],
                onCompletionClick: partial(this.props.completion_click, 'dungeons'),
                onPrizeClick: this.props.prize_click,
                onMedallionClick: this.props.medallion_click
            });
        },

        agahnim: function() {
            return t(Item, {
                name: 'agahnim',
                value: this.props.model.encounters.agahnim.completed,
                onClick: partial(this.props.completion_click, 'encounters')
            });
        },

        dungeon: function(name) {
            return t(Chests, {
                name: name,
                value: this.props.model.dungeons[name],
                onClick: partial(this.props.chest_click, 'dungeons')
            });
        }
    }));

    var KeysanityTracker = createReactClass(Object.assign({}, _tracker, {
        corner: function() {
            var value = this.props.model.regions.ganon_tower;
            return [
                div('.avatar',
                    this.tunic(),
                    this.item('sword'),
                    this.item('shield'),
                    this.item('moonpearl')),
                div('.ganon-tower',
                    t(SingleChest, { name: 'ganon_tower', value: value, onClick: partial(this.props.chest_click, 'regions') }),
                    t(Keys, { name: 'ganon_tower', value: value, onClick: partial(this.props.key_click, 'regions') }),
                    t(BigKey, {name: 'ganon_tower', value: value, onClick: partial(this.props.big_key_click, 'regions') }))
            ];
        },

        dungeon_boss: function(name) {
            return t(DungeonWithBigkey, {
                name: name,
                value: this.props.model.dungeons[name],
                onCompletionClick: partial(this.props.completion_click, 'dungeons'),
                onPrizeClick: this.props.prize_click,
                onBigKeyClick: partial(this.props.big_key_click, 'dungeons')
            });
        },

        medallion_dungeon_boss: function(name) {
            return t(DungeonWithMedallionWithBigkey, {
                name: name,
                value: this.props.model.dungeons[name],
                onCompletionClick: partial(this.props.completion_click, 'dungeons'),
                onPrizeClick: this.props.prize_click,
                onMedallionClick: this.props.medallion_click,
                onBigKeyClick: partial(this.props.big_key_click, 'dungeons')
            });
        },

        agahnim: function() {
            var key_click = partial(this.props.key_click, 'regions'),
                model = this.props.model;
            return [
                t(Item, {
                    name: 'agahnim',
                    value: model.encounters.agahnim.completed,
                    onClick: partial(this.props.completion_click, 'encounters')
                }),
                div('.agahnim-keys',
                    t(Keys, { name: 'castle_tower', value: model.regions.castle_tower, onClick: key_click }),
                    t(Keys, { name: 'escape', value: model.regions.escape, onClick: key_click }))
            ];
        },

        dungeon: function(name) {
            return div('.dungeon',
                t(Keys, { name: name, value: this.props.model.dungeons[name], onClick: partial(this.props.key_click, 'dungeons') }),
                t(SingleChest, { name: name, value: this.props.model.dungeons[name], onClick: partial(this.props.chest_click, 'dungeons') }));
        }
    }));

    var MapChest = function(props) {
        var name = props.name,
            model = props.model,
            chest = model.chests[name];
        return div('.chest', {
            className: classNames(
                as_location(name),
                chest.marked || chest.is_available(model.items, model), {
                    marked: chest.marked,
                    highlight: props.highlighted
                }),
            onClick: function() { props.onClick(name) },
            onMouseOver: function() { props.onHighlight(true); },
            onMouseOut: function() { props.onHighlight(false); }
        });
    };

    MapChest.source = function(props) {
        return get(props.model, ['chests', props.name]);
    };

    var MapEncounter = function(props) {
        var name = props.name,
            model = props.model,
            encounter = model.encounters[name];
        return [
            div('.boss', {
                className: as_location(name),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            }),
            div('.encounter', {
                className: classNames(
                    as_location(name),
                    encounter.completed || encounter.can_complete(model.items, model), {
                        marked: encounter.completed,
                        highlight: props.highlighted
                    }),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            })
        ];
    };

    MapEncounter.source = function(props) {
        return get(props.model, ['encounters', props.name]);
    };

    var MapDungeon = function(props) {
        var name = props.name,
            model = props.model,
            deviated = props.deviated,
            dungeon = model.dungeons[name];
        return [
            div('.boss', {
                className: classNames(
                    as_location(name),
                    !deviated && !dungeon.completed && dungeon.can_complete(model.items, model), {
                        marked: dungeon.completed,
                        possible: deviated && !dungeon.completed,
                    }),
                onClick: function() { props.onClick(name); },
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            }),
            div('.dungeon', {
                className: classNames(
                    as_location(name),
                    !deviated && dungeon.chests !== 0 && dungeon.can_progress(model.items, model), {
                        marked: dungeon.chests === 0,
                        possible: deviated && dungeon.chests !== 0,
                        highlight: props.highlighted
                    }),
                onClick: function() { props.onClick(name); },
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            })
        ];
    };

    MapDungeon.source = function(props) {
        return get(props.model, ['dungeons', props.name]);
    };

    var MapChestWithHighlight = WithHighlight(MapChest),
        MapEncounterWithHighlight = WithHighlight(MapEncounter),
        MapDungeonWithHighlight = WithHighlight(MapDungeon);

    var MiniMapDoor = function(props) {
        var name = props.name,
            dungeon_name = props.dungeon,
            model = props.model,
            dungeon = model.dungeons[dungeon_name],
            door = dungeon.doors[name];
        return div('.door', {
            className: classNames(
                as_location(name),
                props.dungeon,
                !props.deviated && !door.opened && door.can_reach.call(dungeon, model.items, model), {
                    marked: door.opened,
                    possible: props.deviated && !door.opened,
                    highlight: props.highlighted
                }),
            onClick: function() { props.onClick(dungeon_name, name); },
            onMouseOver: function() { props.onHighlight(true); },
            onMouseOut: function() { props.onHighlight(false); }
            },
            div('.image')
        );
    };

    MiniMapDoor.source = function(props) {
        return get(props.model, ['dungeons', props.dungeon, 'doors', props.name]);
    };

    var MiniMapLocation = function(props) {
        var name = props.name,
            dungeon_name = props.dungeon,
            model = props.model,
            dungeon = model.dungeons[dungeon_name],
            location = dungeon.locations[name];
        return div('.location', {
            className: classNames(
                as_location(name),
                !props.deviated && !location.marked && location.can_reach.call(dungeon, model.items, model), {
                    marked: location.marked,
                    possible: props.deviated && !location.marked,
                    highlight: props.highlighted
                }),
            onClick: function() { props.onClick(dungeon_name, name); },
            onMouseOver: function() { props.onHighlight(true); },
            onMouseOut: function() { props.onHighlight(false); }
            },
            name === 'big_chest' && div('.image'),
            name === 'boss' && div('.image.boss', { className: props.dungeon })
        );
    };

    MiniMapLocation.source = function(props) {
        return get(props.model, ['dungeons', props.dungeon, 'locations', props.name]);
    };

    var MiniMapDoorWithHighlight = WithHighlight(MiniMapDoor),
        MiniMapLocationWithHighlight = WithHighlight(MiniMapLocation);

    function WithHighlight(Wrapped) {
        return createReactClass({
            getInitialState: function() {
                return { highlighted: false };
            },

            render: function() {
                return t(Wrapped, Object.assign({
                        highlighted: this.state.highlighted,
                        onHighlight: this.onHighlight
                    }, this.props));
            },

            onHighlight: function(highlighted) {
                var name = this.props.name,
                    model = this.props.model,
                    location = Wrapped.source(this.props);
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption(model) : location.caption :
                    null);
                this.setState({ highlighted: highlighted });
            }
        });
    }

    var Caption = createReactClass({
        render: function() {
            var each_part = /[^{]+|\{[\w]+\}/g,
                text = this.props.text;
            return div('#caption', !text ? '\u00a0' : text.match(each_part).map(this.parse));
        },

        parse: function(part) {
            var dm = part.match(/^\{(medallion|pendant)(\d+)\}/),
                pm = part.match(/^\{(\w+?)(\d+)?\}/),
                m = dm || pm;
            return !m ? part : div('.icon', { className: dm ?
                m[1]+'-'+m[2] :
                classNames(m[1], m[2] && 'active-'+m[2])
            });
        }
    });

    var Map = createReactClass({
        getInitialState: function() {
            return { caption: null };
        },

        render: function() {
            var dungeon = this.props.dungeon,
                points = partition(
                    dungeon ? this.dungeon_locations() : this.world_locations(),
                    property('second')),
                maps = [
                    div('.first', { className: dungeon || 'world' }, points[1].map(property('tag'))),
                    div('.second', { className: dungeon || 'world' }, points[0].map(property('tag')))
                ];

            var dungeon_click = this.props.dungeon_click;
            return div('#map', { className: classNames({ cell: this.props.horizontal }) },
                this.props.horizontal ? grid.call(null, maps) : maps,
                dungeon && span('.close', { onClick: function() { dungeon_click(null); } }, '\u00d7'),
                t(Caption, { text: this.state.caption })
            );
        },

        world_locations: function() {
            var model = this.props.model,
                keysanity = this.props.keysanity,
                chest_click = this.props.chest_click,
                dungeon_click = this.dungeon_click,
                change_caption = this.change_caption;

            return flatten([
                map(model.chests, function(chest, name) {
                    return { second: chest.darkworld,
                        tag: t(MapChestWithHighlight, { name: name, model: model, onClick: chest_click, change_caption: change_caption }) };
                }),
                map(model.encounters, function(encounter, name) {
                    return { second: encounter.darkworld,
                        tag: t(MapEncounterWithHighlight, { name: name, model: model, change_caption: change_caption }) };
                }),
                map(model.dungeons, function(dungeon, name) {
                    return {
                        second: dungeon.darkworld,
                        tag: t(MapDungeonWithHighlight, {
                            name: name, model: model, deviated: keysanity && dungeon.is_deviating(),
                            onClick: dungeon_click, change_caption: change_caption })
                    };
                })
            ]);
        },

        dungeon_locations: function(dungeon_name) {
            var model = this.props.model,
                dungeon_name = this.props.dungeon,
                dungeon = model.dungeons[dungeon_name],
                deviated = dungeon.is_deviating(),
                door_click = this.props.door_click,
                location_click = this.props.location_click,
                change_caption = this.change_caption;

            return flatten([
                map(dungeon.doors, function(door, name) {
                    return {
                        second: door.second_map,
                        tag: t(MiniMapDoorWithHighlight, {
                            name: name, dungeon: dungeon_name, model: model, deviated: deviated,
                            onClick: door_click, change_caption: change_caption })
                    };
                }),
                map(dungeon.locations, function(location, name) {
                    return {
                        second: location.second_map,
                        tag: t(MiniMapLocationWithHighlight, {
                            name: name, dungeon: dungeon_name, model: model, deviated: deviated,
                            onClick: location_click, change_caption: change_caption })
                    };
                })
            ]);
        },

        dungeon_click: function(name) {
            if (this.props.dungeon_click) {
                this.props.dungeon_click(name);
                this.change_caption(null);
            }
        },

        change_caption: function(caption) {
            this.setState({ caption: caption });
        }
    });

    function grid(rows) {
        rows = slice.call(arguments);
        return rows.map(function(row) {
            return div('.row', row.map(function(cell) {
                return div('.cell', cell);
            }));
        });
    }

    var App = createReactClass({
        getInitialState: function() {
            var q = this.props.query,
                opts = { ipbj: !!q.ipbj, podbj: !!q.podbj };
            return { model: Object.assign(item_model(q.mode), location_model(q.mode, opts)) };
        },

        render: function() {
            var query = this.props.query,
                keysanity = query.mode === 'keysanity';
            return div('#page', {
                    className: classNames({
                        row: query.hmap,
                        hmap: query.hmap,
                        vmap: query.vmap,
                        keysanity: keysanity
                    }, query.sprite),
                    style: query.bg && { 'background-color': query.bg }
                },
                t(keysanity ? KeysanityTracker : Tracker, Object.assign({
                        item_click: this.item_click,
                        completion_click: this.completion_click,
                        prize_click: this.prize_click,
                        medallion_click: this.medallion_click,
                        chest_click: this.chest_click,
                        horizontal: query.hmap,
                        model: this.state.model
                    }, !keysanity ? null : {
                        big_key_click: this.big_key_click,
                        key_click: this.key_click
                    })),
                (query.hmap || query.vmap) && t(Map, Object.assign({
                    chest_click: this.map_chest_click,
                    horizontal: query.hmap,
                    model: this.state.model
                }, !keysanity ? null : {
                    dungeon_click: this.map_dungeon_click,
                    door_click: this.door_click,
                    location_click: this.location_click,
                    dungeon: this.state.dungeon,
                    keysanity: true
                }))
            );
        },

        map_dungeon_click: function(name) {
            this.setState({ dungeon: name });
        },

        item_click: function(name) {
            var items = this.state.model.items,
                change = typeof items[name] === 'boolean' ?
                    update.toggle(name) :
                    at(name, { $set: items.inc(name) });
            this.setState({ model: update(this.state.model, { items: change }) });
        },

        completion_click: function(source, name) {
            var query = this.props.query,
                model = this.state.model,
                target = model[source][name],
                completed = target.completed;

            this.setState({ model: update(model, at(source, at(name, Object.assign(
                { completed: { $set: !completed } },
                query.mode === 'keysanity' && source === 'dungeons' && {
                    locations: { boss: { marked: { $set: !completed } } },
                    chests: target.is_deviating() ? {} : function(x) { return x - (!completed ? 1 : -1); }
                }))))
            });
        },

        prize_click: function(name) {
            var value = counter(this.state.model.dungeons[name].prize, 1, 4);
            this.setState({ model: update(this.state.model, { dungeons: at(name, { prize: { $set: value } }) }) });
        },

        medallion_click: function(name) {
            var value = counter(this.state.model.dungeons[name].medallion, 1, 3);
            this.setState({ model: update(this.state.model, { dungeons: at(name, { medallion: { $set: value } }) }) });
        },

        door_click: function(dungeon, name) {
            this.setState({ model: update(this.state.model, { dungeons: at(dungeon, { doors: at(name, update.toggle('opened')) }) }) });
        },

        location_click: function(dungeon, name) {
            var target = this.state.model.dungeons[dungeon],
                marked = target.locations[name].marked;
            
            this.setState({ model: update(this.state.model, { dungeons: at(dungeon, {
                locations: at(name, { marked: { $set: !marked } }),
                completed: name !== 'boss' ? {} : { $set: !marked },
                chests: target.is_deviating() ? {} : function(x) { return x - (!marked ? 1 : -1); }
            }) }) });
        },

        big_key_click: function(source, name) {
            this.setState({ model: update(this.state.model, at(source, at(name, update.toggle('big_key')))) });
        },

        key_click: function(source, name) {
            var target = this.state.model[source][name],
                value = counter(target.keys, 1, target.key_limit);
            this.setState({ model: update(this.state.model, at(source, at(name, { keys: { $set: value } }))) });
        },

        chest_click: function(source, name) {
            var target = this.state.model[source][name],
                value = counter(target.chests, -1, target.chest_limit);
            this.setState({ model: update(this.state.model, at(source, at(name, { chests: { $set: value } }))) });
        },

        map_chest_click: function(name) {
            this.setState({ model: update(this.state.model, { chests: at(name, update.toggle('marked')) }) });
        }
    });

    window.start = function() {
        ReactDOM.render(t(App, { query: uri_query() }), document.getElementById('app'));
    };

    function as_location(s) {
        return s.replace(/_/, '-');
    }
}(window));
