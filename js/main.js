(function(window) {
    'use strict';

    var model_changed = announcer();

    var Item = createReactClass({
        render: function() {
            var name = this.props.name,
                value = items[name];
            return div('.item', {
                className: classNames(name,
                    value === true ? 'active' :
                    value > 0 ? 'active-'+value : null),
                onClick: this.onClick
            });
        },

        onClick: function() {
            var name = this.props.name,
                is_toggle = typeof items[name] === 'boolean';

            items = update(items, is_toggle ? { $toggle: [name] } :
                at(name, { $set: items.inc(name) }));

            this.forceUpdate();
            model_changed();
        }
    });

    var TunicItem = createReactClass({
        componentDidMount: function() { model_changed.on(this.handle_change); },
        componentWillUnmount: function() { model_changed.off(this.handle_change); },
        handle_change: function() { this.forceUpdate(); },

        render: function() {
            var value = items.tunic;
            return div('.item.tunic', {
                className: classNames('active-'+value, { bunny: !items.moonpearl }),
                onClick: this.onClick
            });
        },

        onClick: function() {
            var value = items.inc('tunic');

            items = update(items, { tunic: { $set: value } });

            model_changed();
        }
    });

    var Dungeon = createReactClass({
        render: function() {
            var name = this.props.name,
                dungeon = dungeons[name];
            return [
                div('.boss', {
                    className: classNames(name, { defeated: dungeon.completed }),
                    onClick: this.onBossClick
                }),
                div('.prize', {
                    className: 'prize-'+dungeon.prize,
                    onClick: this.onPrizeClick
                })
            ];
        },

        onBossClick: function() {
            var name = this.props.name,
                value = !dungeons[name].completed;

            dungeons = update(dungeons, at(name, { completed: { $set: value } }));

            this.forceUpdate();
            model_changed();
        },

        onPrizeClick: function() {
            var name = this.props.name,
                value = counter(dungeons[name].prize, 1, 4);

            dungeons = update(dungeons, at(name, { prize: { $set: value } }));

            this.forceUpdate();
            model_changed();
        }
    });

    var WithMedallion = function(Wrapped) {
        return createReactClass({
            render: function() {
                var name = this.props.name,
                    dungeon = dungeons[name];
                return [
                    t(Wrapped, this.props),
                    div('.medallion', {
                        className: 'medallion-'+dungeon.medallion,
                        onClick: this.onMedallionClick
                    })
                ];
            },

            onMedallionClick: function() {
                var name = this.props.name,
                    value = counter(dungeons[name].medallion, 1, 3);

                dungeons = update(dungeons, at(name, { medallion: { $set: value } }));

                this.forceUpdate();
                model_changed();
            }
        });
    };

    var DungeonWithMedallion = WithMedallion(Dungeon);

    var TrackerChest = createReactClass({
        render: function() {
            var name = this.props.name,
                value = dungeons[name].chests;
            return div('.chest', {
                className: classNames('chest-'+value),
                onClick: this.onClick
            });
        },

        onClick: function() {
            var name = this.props.name,
                dungeon = dungeons[name],
                value = counter(dungeon.chests, -1, dungeon.chest_limit);

            dungeons = update(dungeons, at(name, { chests: { $set: value } }));

            this.forceUpdate();
            model_changed();
        }
    });

    var Tracker = createReactClass({
        render: function() {
            return div('#tracker.cell',
                div('.row',
                    div('.cell',
                        div('.row',
                            div('.cell',
                                t(TunicItem),
                                t(Item, { name: 'sword' }),
                                t(Item, { name: 'shield' }),
                                t(Item, { name: 'moonpearl' }),
                            )
                        ),
                        div('.row',
                            div('.cell', t(Dungeon, { name: 'eastern' })),
                            div('.cell', t(TrackerChest, { name: 'eastern' }))
                        ),
                        div('.row',
                            div('.cell', t(Dungeon, { name: 'desert' })),
                            div('.cell', t(TrackerChest, { name: 'desert' }))
                        ),
                        div('.row',
                            div('.cell', t(Dungeon, { name: 'hera' })),
                            div('.cell', t(TrackerChest, { name: 'hera' }))
                        )
                    ),
                    div('.cell',
                        div('.row',
                            div('.cell', t(Item, { name: 'bow' })),
                            div('.cell', t(Item, { name: 'boomerang' })),
                            div('.cell', t(Item, { name: 'hookshot' })),
                            div('.cell', t(Item, { name: 'mushroom' })),
                            div('.cell', t(Item, { name: 'powder' }))
                        ),
                        div('.row',
                            div('.cell', t(Item, { name: 'firerod' })),
                            div('.cell', t(Item, { name: 'icerod' })),
                            div('.cell', t(Item, { name: 'bombos' })),
                            div('.cell', t(Item, { name: 'ether' })),
                            div('.cell', t(Item, { name: 'quake' }))
                        ),
                        div('.row',
                            div('.cell', t(Item, { name: 'lantern' })),
                            div('.cell', t(Item, { name: 'hammer' })),
                            div('.cell', t(Item, { name: 'shovel' })),
                            div('.cell', t(Item, { name: 'net' })),
                            div('.cell', t(Item, { name: 'book' }))
                        ),
                        div('.row',
                            div('.cell', t(Item, { name: 'bottle' })),
                            div('.cell', t(Item, { name: 'somaria' })),
                            div('.cell', t(Item, { name: 'byrna' })),
                            div('.cell', t(Item, { name: 'cape' })),
                            div('.cell', t(Item, { name: 'mirror' }))
                        ),
                        div('.row',
                            div('.cell', t(Item, { name: 'boots' })),
                            div('.cell', t(Item, { name: 'glove' })),
                            div('.cell', t(Item, { name: 'flippers' })),
                            div('.cell', t(Item, { name: 'flute' })),
                            div('.cell', t(Item, { name: 'agahnim' }))
                        )
                    )
                ),
                div('.row',
                    div('.cell', t(Dungeon, { name: 'darkness' })),
                    div('.cell', t(Dungeon, { name: 'swamp' })),
                    div('.cell', t(Dungeon, { name: 'skull' })),
                    div('.cell', t(Dungeon, { name: 'thieves' })),
                    div('.cell', t(Dungeon, { name: 'ice' })),
                    div('.cell', t(DungeonWithMedallion, { name: 'mire' })),
                    div('.cell', t(DungeonWithMedallion, { name: 'turtle' }))
                ),
                div('.row',
                    div('.cell', t(TrackerChest, { name: 'darkness' })),
                    div('.cell', t(TrackerChest, { name: 'swamp' })),
                    div('.cell', t(TrackerChest, { name: 'skull' })),
                    div('.cell', t(TrackerChest, { name: 'thieves' })),
                    div('.cell', t(TrackerChest, { name: 'ice' })),
                    div('.cell', t(TrackerChest, { name: 'mire' })),
                    div('.cell', t(TrackerChest, { name: 'turtle' }))
                )
            );
        }
    });

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
                    location = source(name);
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption() : location.caption :
                    null);
                this.setState({ highlighted: highlighted });
            }
        })
    }

    var MapChest = createReactClass({
        render: function() {
            var name = this.props.name,
                onHighlight = this.props.onHighlight,
                marked = chests[name].marked;
            return div('.chest', {
                className: classNames(
                    as_location(name),
                    marked || chests[name].is_available(), {
                        marked: marked,
                        highlight: this.props.highlighted
                    }),
                onClick: this.handle_click,
                onMouseOver: function() { onHighlight(true); },
                onMouseOut: function() { onHighlight(false); }
            });
        },

        handle_click: function() {
            var name = this.props.name;
            chests = update(chests, at(name, { $toggle: ['marked'] }));
            this.forceUpdate();
        }
    });

    var MapEncounter = createReactClass({
        render: function() {
            var name = this.props.name,
                onHighlight = this.props.onHighlight,
                encounter = encounters[name],
                completed = items[name];
            return [
                div('.boss', {
                    className: as_location(name),
                    onMouseOver: function() { onHighlight(true); },
                    onMouseOut: function() { onHighlight(false); }
                }),
                div('.encounter', {
                    className: classNames(
                        as_location(name),
                        completed || encounter.is_completable(), {
                            marked: completed,
                            highlight: this.props.highlighted
                        }),
                    onMouseOver: function() { onHighlight(true); },
                    onMouseOut: function() { onHighlight(false); }
                })
            ];
        }
    });

    var MapDungeon = createReactClass({
        render: function() {
            var name = this.props.name,
                onHighlight = this.props.onHighlight,
                dungeon = dungeons[name];
            return [
                div('.boss', {
                    className: classNames(
                        as_location(name),
                        dungeon.completed || dungeon.is_completable(),
                        { marked: dungeon.completed }),
                    onMouseOver: function() { onHighlight(true); },
                    onMouseOut: function() { onHighlight(false); }
                }),
                div('.dungeon', {
                    className: classNames(
                        as_location(name),
                        dungeon.chests === 0 || dungeon.is_progressable(), {
                            marked: dungeon.chests === 0,
                            highlight: this.props.highlighted
                        }),
                    onMouseOver: function() { onHighlight(true); },
                    onMouseOut: function() { onHighlight(false); }
                })
            ];
        }
    });

    var MapChestWithHighlight = WithHighlight(MapChest, function(name) { return chests[name]; }),
        MapEncounterWithHighlight = WithHighlight(MapEncounter, function(name) { return encounters[name]; }),
        MapDungeonWithHighlight = WithHighlight(MapDungeon, function(name) { return dungeons[name]; });

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

        componentDidMount: function() { model_changed.on(this.handle_change); },
        componentWillUnmount: function() { model_changed.off(this.handle_change); },
        handle_change: function() { this.forceUpdate(); },

        render: function() {
            var change_caption = this.change_caption;
            return div('#map.cell',
                Object.keys(chests).map(function(name) {
                    return t(MapChestWithHighlight, { name: name, change_caption: change_caption });
                }),
                Object.keys(encounters).map(function(name) {
                    return t(MapEncounterWithHighlight, { name: name, change_caption: change_caption });
                }),
                Object.keys(dungeons).map(function(name) {
                    return t(MapDungeonWithHighlight, { name: name, change_caption: change_caption });
                }),
                t(Caption, { text: this.state.caption })
            );
        },

        change_caption: function(caption) {
            this.setState({ caption: caption });
        }
    });

    var query = uri_query();
    window.mode = query.mode;
    window.map_enabled = query.map;

    window.start = function() {
        ReactDOM.render(t(Tracker), document.getElementById('tracker-rjs'));
        ReactDOM.render(t(Map), document.getElementById('map-rjs'));

        if (!map_enabled) {
            document.getElementById('app').classList.add('mapless');
            document.getElementById('map').style.display = 'none';
        }
    };

    function as_location(s) {
        return s.replace(/_/, '-');
    }

    function as_identifier(s) {
        return s.replace(/^\./, '').replace(/-/, '_');
    }
}(window));
