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
                onClick: function() { props.onBossClick(name); }
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
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click
            });
        },

        medallion_dungeon_boss: function(name) {
            return t(DungeonWithMedallion, {
                name: name,
                value: this.props.model.dungeons[name],
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click,
                onMedallionClick: this.props.medallion_click
            });
        },

        agahnim: function() {
            return t(Item, {
                name: 'agahnim',
                value: this.props.model.encounters.agahnim.completed,
                onClick: this.props.encounter_click
            });
        },

        dungeon: function(name) {
            return t(Chests, { name: name, value: this.props.model.dungeons[name], onClick: this.props.chest_click });
        }
    }));

    var KeysanityTracker = createReactClass(Object.assign({}, _tracker, {
        corner: function() {
            var region_big_key_click = this.props.region_big_key_click,
                region_key_click = this.props.region_key_click,
                region_chest_click = this.props.region_chest_click,
                value = this.props.model.regions.ganon_tower;
            return [
                div('.avatar',
                    this.tunic(),
                    this.item('sword'),
                    this.item('shield'),
                    this.item('moonpearl')),
                div('.ganon-tower',
                    t(SingleChest, { name: 'ganon_tower', value: value, onClick: region_chest_click }),
                    t(Keys, { name: 'ganon_tower', value: value, onClick: region_key_click }),
                    t(BigKey, {name: 'ganon_tower', value: value, onClick: region_big_key_click }))
            ];
        },

        dungeon_boss: function(name) {
            return t(DungeonWithBigkey, {
                name: name,
                value: this.props.model.dungeons[name],
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click,
                onBigKeyClick: this.props.big_key_click
            });
        },

        medallion_dungeon_boss: function(name) {
            return t(DungeonWithMedallionWithBigkey, {
                name: name,
                value: this.props.model.dungeons[name],
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click,
                onMedallionClick: this.props.medallion_click,
                onBigKeyClick: this.props.big_key_click
            });
        },

        agahnim: function() {
            var region_key_click = this.props.region_key_click,
                model = this.props.model;
            return [
                t(Item, {
                    name: 'agahnim',
                    value: model.encounters.agahnim.completed,
                    onClick: this.props.encounter_click
                }),
                div('.agahnim-keys',
                    t(Keys, { name: 'castle_tower', value: model.regions.castle_tower, onClick: region_key_click }),
                    t(Keys, { name: 'escape', value: model.regions.escape, onClick: region_key_click }))
            ];
        },

        dungeon: function(name) {
            return div('.dungeon',
                t(Keys, { name: name, value: this.props.model.dungeons[name], onClick: this.props.dungeon_key_click }),
                t(SingleChest, { name: name, value: this.props.model.dungeons[name], onClick: this.props.chest_click }));
        }
    }));

    function WithHighlight(Wrapped, source) {
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
                    location = model[source][name];
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption(model) : location.caption :
                    null);
                this.setState({ highlighted: highlighted });
            }
        });
    }

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
                    encounter.completed || encounter.is_completable(model.items, model), {
                        marked: encounter.completed,
                        highlight: props.highlighted
                    }),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            })
        ];
    };

    var MapDungeon = function(props) {
        var name = props.name,
            model = props.model,
            dungeon = model.dungeons[name];
        return [
            div('.boss', {
                className: classNames(
                    as_location(name),
                    dungeon.completed || dungeon.is_completable(model.items, model),
                    { marked: dungeon.completed }),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            }),
            div('.dungeon', {
                className: classNames(
                    as_location(name),
                    dungeon.chests === 0 || dungeon.is_progressable(model.items, model), {
                        marked: dungeon.chests === 0,
                        highlight: props.highlighted
                    }),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            })
        ];
    };

    var MapChestWithHighlight = WithHighlight(MapChest, 'chests'),
        MapEncounterWithHighlight = WithHighlight(MapEncounter, 'encounters'),
        MapDungeonWithHighlight = WithHighlight(MapDungeon, 'dungeons');

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
            var model = this.props.model,
                chest_click = this.props.chest_click,
                change_caption = this.change_caption;

            var locations = partition(flatten([
                    map(model.chests, function(chest, name) {
                        return { darkworld: chest.darkworld,
                            tag: t(MapChestWithHighlight, { name: name, model: model, onClick: chest_click, change_caption: change_caption }) };
                    }),
                    map(model.encounters, function(encounter, name) {
                        return { darkworld: encounter.darkworld,
                            tag: t(MapEncounterWithHighlight, { name: name, model: model, change_caption: change_caption }) };
                    }),
                    map(model.dungeons, function(dungeon, name) {
                        return { darkworld: dungeon.darkworld,
                            tag: t(MapDungeonWithHighlight, { name: name, model: model, change_caption: change_caption }) };
                    })
                ]), function(x) { return !x.darkworld; }),
                worlds = [
                    div('.world-light', locations[0].map(property('tag'))),
                    div('.world-dark', locations[1].map(property('tag')))
                ];

            return div('#map', { className: classNames({ cell: this.props.horizontal }) },
                this.props.horizontal ? grid.call(null, worlds) : worlds,
                t(Caption, { text: this.state.caption })
            );
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
            var mode = this.props.query.mode;
            return { model: Object.assign(item_model(mode), location_model(mode)) };
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
                t(keysanity ? KeysanityTracker : Tracker, Object.assign(
                    this.tracker_handlers(),
                    keysanity ? this.keysanity_tracker_handlers() : null, {
                        horizontal: query.hmap,
                        model: this.state.model
                    })),
                (query.hmap || query.vmap) && t(Map, {
                    chest_click: this.map_chest_click,
                    horizontal: query.hmap,
                    model: this.state.model
                }));
        },

        tracker_handlers: function() {
            return {
                item_click: this.item_click,
                boss_click: this.boss_click,
                prize_click: this.prize_click,
                medallion_click: this.medallion_click,
                encounter_click: this.encounter_click,
                chest_click: this.chest_click
            };
        },

        item_click: function(name) {
            var items = this.state.model.items,
                change = typeof items[name] === 'boolean' ?
                    { $toggle: [name] } :
                    at(name, { $set: items.inc(name) });
            this.setState({ model: update(this.state.model, { items: change }) });
        },

        boss_click: function(name) {
            this.setState({ model: update(this.state.model, { dungeons: at(name, { $toggle: ['completed'] }) }) });
        },

        prize_click: function(name) {
            var value = counter(this.state.model.dungeons[name].prize, 1, 4);
            this.setState({ model: update(this.state.model, { dungeons: at(name, { prize: { $set: value } }) }) });
        },

        medallion_click: function(name) {
            var value = counter(this.state.model.dungeons[name].medallion, 1, 3);
            this.setState({ model: update(this.state.model, { dungeons: at(name, { medallion: { $set: value } }) }) });
        },

        encounter_click: function(name) {
            this.setState({ model: update(this.state.model, { encounters: at(name, { $toggle: ['completed'] }) }) });
        },

        chest_click: function(name) {
            var dungeon = this.state.model.dungeons[name],
                value = counter(dungeon.chests, -1, dungeon.chest_limit);
            this.setState({ model: update(this.state.model, { dungeons: at(name, { chests: { $set: value } }) }) });
        },

        map_chest_click: function(name) {
            this.setState({ model: update(this.state.model, { chests: at(name, { $toggle: ['marked'] }) }) });
        },

        keysanity_tracker_handlers: function() {
            return {
                big_key_click: this.big_key_click,
                dungeon_key_click: this.dungeon_key_click,
                region_big_key_click: this.region_big_key_click,
                region_key_click: this.region_key_click,
                region_chest_click: this.region_chest_click
            };
        },

        big_key_click: function(name) {
            this.setState({ model: update(this.state.model, { dungeons: at(name, { $toggle: ['big_key'] }) }) });
        },

        dungeon_key_click: function(name) {
            var dungeon = this.state.model.dungeons[name],
                value = counter(dungeon.keys, 1, dungeon.key_limit);
            this.setState({ model: update(this.state.model, { dungeons: at(name, { keys: { $set: value } }) }) });
        },

        region_big_key_click: function(name) {
            this.setState({ model: update(this.state.model, { regions: at(name, { $toggle: ['big_key'] }) }) });
        },

        region_key_click: function(name) {
            var region = this.state.model.regions[name],
                value = counter(region.keys, 1, region.key_limit);
            this.setState({ model: update(this.state.model, { regions: at(name, { keys: { $set: value } }) }) });
        },

        region_chest_click: function(name) {
            var region = this.state.model.regions[name],
                value = counter(region.chests, -1, region.chest_limit);
            this.setState({ model: update(this.state.model, { regions: at(name, { chests: { $set: value } }) }) });
        }
    });

    window.start = function() {
        ReactDOM.render(t(App, { query: uri_query() }), document.getElementById('app'));
    };

    function as_location(s) {
        return s.replace(/_/, '-');
    }
}(window));
