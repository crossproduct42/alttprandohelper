(function(window) {
    'use strict';

    var model_changed = announcer();

    var Item = function(props) {
        var name = props.name,
            value = items[name];
        return div('.item', {
            className: classNames(name,
                value === true ? 'active' :
                value > 0 ? 'active-'+value : null),
            onClick: function() { props.onClick(name); }
        });
    };

    var TunicItem = function(props) {
        var value = items.tunic;
        return div('.item.tunic', {
            className: classNames('active-'+value, { bunny: !items.moonpearl }),
            onClick: function() { props.onClick('tunic'); }
        });
    };

    var Dungeon = function(props) {
        var name = props.name,
            dungeon = dungeons[name];
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
                dungeon = dungeons[name];
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

    var TrackerChest = function(props) {
        var name = props.name,
            value = dungeons[name].chests;
        return div('.chest', {
            className: 'chest-'+value,
            onClick: function() { props.onClick(name); }
        });
    };

    var Tracker = createReactClass({
        componentDidMount: function() { model_changed.on(this.handle_change); },
        componentWillUnmount: function() { model_changed.off(this.handle_change); },
        handle_change: function() { this.forceUpdate(); },

        render: function() {
            return div('#tracker.cell',
                div('.row',
                    div('.cell',
                        div('.row',
                            div('.cell',
                                this.tunic(),
                                this.item('sword'),
                                this.item('shield'),
                                this.item('moonpearl'),
                            )
                        ),
                        div('.row',
                            div('.cell', this.dungeon('eastern')),
                            div('.cell', this.chest('eastern'))
                        ),
                        div('.row',
                            div('.cell', this.dungeon('desert')),
                            div('.cell', this.chest('desert'))
                        ),
                        div('.row',
                            div('.cell', this.dungeon('hera')),
                            div('.cell', this.chest('hera'))
                        )
                    ),
                    div('.cell',
                        div('.row',
                            div('.cell', this.item('bow')),
                            div('.cell', this.item('boomerang')),
                            div('.cell', this.item('hookshot')),
                            div('.cell', this.item('mushroom')),
                            div('.cell', this.item('powder'))
                        ),
                        div('.row',
                            div('.cell', this.item('firerod')),
                            div('.cell', this.item('icerod')),
                            div('.cell', this.item('bombos')),
                            div('.cell', this.item('ether')),
                            div('.cell', this.item('quake'))
                        ),
                        div('.row',
                            div('.cell', this.item('lantern')),
                            div('.cell', this.item('hammer')),
                            div('.cell', this.item('shovel')),
                            div('.cell', this.item('net')),
                            div('.cell', this.item('book'))
                        ),
                        div('.row',
                            div('.cell', this.item('bottle')),
                            div('.cell', this.item('somaria')),
                            div('.cell', this.item('byrna')),
                            div('.cell', this.item('cape')),
                            div('.cell', this.item('mirror'))
                        ),
                        div('.row',
                            div('.cell', this.item('boots')),
                            div('.cell', this.item('glove')),
                            div('.cell', this.item('flippers')),
                            div('.cell', this.item('flute')),
                            div('.cell', this.item('agahnim'))
                        )
                    )
                ),
                div('.row',
                    div('.cell', this.dungeon('darkness')),
                    div('.cell', this.dungeon('swamp')),
                    div('.cell', this.dungeon('skull')),
                    div('.cell', this.dungeon('thieves')),
                    div('.cell', this.dungeon('ice')),
                    div('.cell', this.medallion_dungeon('mire')),
                    div('.cell', this.medallion_dungeon('turtle'))
                ),
                div('.row',
                    div('.cell', this.chest('darkness')),
                    div('.cell', this.chest('swamp')),
                    div('.cell', this.chest('skull')),
                    div('.cell', this.chest('thieves')),
                    div('.cell', this.chest('ice')),
                    div('.cell', this.chest('mire')),
                    div('.cell', this.chest('turtle'))
                )
            );
        },

        tunic: function() {
            return t(TunicItem, { onClick: this.item_click });
        },

        item: function(name) {
            return t(Item, { name: name, onClick: this.item_click });
        },

        dungeon: function(name) {
            return t(Dungeon, { name: name, onBossClick: this.boss_click, onPrizeClick: this.prize_click });
        },

        medallion_dungeon: function(name) {
            return t(DungeonWithMedallion, { name: name, onBossClick: this.boss_click,
                onPrizeClick: this.prize_click, onMedallionClick: this.medallion_click });
        },

        chest: function(name) {
            return t(TrackerChest, { name: name, onClick: this.chest_click });
        },

        item_click: function(name) {
            items = update(items, typeof items[name] === 'boolean' ?
                { $toggle: [name] } :
                at(name, { $set: items.inc(name) }));
            model_changed();
        },

        boss_click: function(name) {
            dungeons = update(dungeons, at(name, { $toggle: ['completed'] }));
            model_changed();
        },

        prize_click: function(name) {
            var value = counter(dungeons[name].prize, 1, 4);
            dungeons = update(dungeons, at(name, { prize: { $set: value } }));
            model_changed();
        },

        medallion_click: function(name) {
            var value = counter(dungeons[name].medallion, 1, 3);
            dungeons = update(dungeons, at(name, { medallion: { $set: value } }));
            model_changed();
        },

        chest_click: function(name) {
            var value = counter(dungeons[name].chests, -1, dungeons[name].chest_limit);
            dungeons = update(dungeons, at(name, { chests: { $set: value } }));
            model_changed();
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

    var App = createReactClass({
        render: function() {
            var map = this.props.map;
            return div('#page.row', { className: classNames({ mapless: !map }) },
                t(Tracker),
                map && t(Map));
        }
    });

    window.start = function() {
        var map = uri_query().map;
        ReactDOM.render(t(App, { map: map }), document.getElementById('app'));
    };

    function as_location(s) {
        return s.replace(/_/, '-');
    }
}(window));
