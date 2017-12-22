(function(window) {
    'use strict';

    var model_changed = announcer();

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

    var TrackerChest = function(props) {
        var name = props.name,
            dungeon = props.value;
        return div('.chest', {
            className: 'chest-'+dungeon.chests,
            onClick: function() { props.onClick(name); }
        });
    };

    var Tracker = createReactClass({
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
            return t(TunicItem, { items: this.props.items, onClick: this.props.item_click });
        },

        item: function(name) {
            return t(Item, { name: name, value: this.props.items[name], onClick: this.props.item_click });
        },

        dungeon: function(name) {
            return t(Dungeon, {
                name: name,
                value: this.props.dungeons[name],
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click });
        },

        medallion_dungeon: function(name) {
            return t(DungeonWithMedallion, {
                name: name,
                value: this.props.dungeons[name],
                onBossClick: this.props.boss_click,
                onPrizeClick: this.props.prize_click,
                onMedallionClick: this.props.medallion_click });
        },

        chest: function(name) {
            return t(TrackerChest, { name: name, value: this.props.dungeons[name], onClick: this.props.chest_click });
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
            encounter = model.encounters[name],
            completed = model.items[name];
        return [
            div('.boss', {
                className: as_location(name),
                onMouseOver: function() { props.onHighlight(true); },
                onMouseOut: function() { props.onHighlight(false); }
            }),
            div('.encounter', {
                className: classNames(
                    as_location(name),
                    completed || encounter.is_completable(model.items, model), {
                        marked: completed,
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
            var model = this.props,
                chest_click = this.props.chest_click,
                change_caption = this.change_caption;
            return div('#map.cell',
                Object.keys(model.chests).map(function(name) {
                    return t(MapChestWithHighlight, { name: name, model: model, onClick: chest_click, change_caption: change_caption });
                }),
                Object.keys(model.encounters).map(function(name) {
                    return t(MapEncounterWithHighlight, { name: name, model: model, change_caption: change_caption });
                }),
                Object.keys(model.dungeons).map(function(name) {
                    return t(MapDungeonWithHighlight, { name: name, model: model, change_caption: change_caption });
                }),
                t(Caption, { text: this.state.caption })
            );
        },

        change_caption: function(caption) {
            this.setState({ caption: caption });
        }
    });

    var App = createReactClass({
        getInitialState: function() {
            var mode = uri_query().mode;
            return Object.assign(item_model(mode), location_model(mode));
        },

        render: function() {
            var map = uri_query().map;
            return div('#page.row', { className: classNames({ mapless: !map }) },
                t(Tracker, Object.assign({
                    item_click: this.item_click,
                    boss_click: this.boss_click,
                    prize_click: this.prize_click,
                    medallion_click: this.medallion_click,
                    chest_click: this.chest_click
                }, this.state)),
                map && t(Map, Object.assign({ chest_click: this.map_chest_click }, this.state)));
        },

        item_click: function(name) {
            var items = this.state.items,
                change = typeof items[name] === 'boolean' ?
                    { $toggle: [name] } :
                    at(name, { $set: items.inc(name) });
            this.setState(update(this.state, { items: change }));
        },

        boss_click: function(name) {
            this.setState(update(this.state, { dungeons: at(name, { $toggle: ['completed'] }) }));
        },

        prize_click: function(name) {
            var value = counter(this.state.dungeons[name].prize, 1, 4);
            this.setState(update(this.state, { dungeons: at(name, { prize: { $set: value } }) }));
        },

        medallion_click: function(name) {
            var value = counter(this.state.dungeons[name].medallion, 1, 3);
            this.setState(update(this.state, { dungeons: at(name, { medallion: { $set: value } }) }));
        },

        chest_click: function(name) {
            var dungeon = this.state.dungeons[name],
                value = counter(dungeon.chests, -1, dungeon.chest_limit);
            this.setState(update(this.state, { dungeons: at(name, { chests: { $set: value } }) }));
        },

        map_chest_click: function(name) {
            this.setState(update(this.state, { chests: at(name, { $toggle: ['marked'] }) }));
        }
    });

    window.start = function() {
        ReactDOM.render(t(App), document.getElementById('app'));
    };

    function as_location(s) {
        return s.replace(/_/, '-');
    }
}(window));
