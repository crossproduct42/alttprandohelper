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
                is_toggle = typeof items[name] === 'boolean',
                value = is_toggle ? !items[name] : items.inc(name);

            items = create(items.__proto__, items);
            items[name] = value;

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

            items = create(items.__proto__, items);
            items.tunic = value;

            model_changed();
        }
    });

    var Avatar = createReactClass({
        render: function() {
            return [
                t(TunicItem),
                t(Item, { name: 'sword' }),
                t(Item, { name: 'shield' }),
                t(Item, { name: 'moonpearl' }),
            ];
        }
    });

    var ItemGrid = createReactClass({
        render: function() {
            return [
                div('.row',
                    div('.cell', t(Item, { name: 'bow' })),
                    div('.cell', t(Item, { name: 'boomerang' })),
                    div('.cell', t(Item, { name: 'hookshot' })),
                    div('.cell', t(Item, { name: 'mushroom' })),
                    div('.cell', t(Item, { name: 'powder' }))),
                div('.row',
                    div('.cell', t(Item, { name: 'firerod' })),
                    div('.cell', t(Item, { name: 'icerod' })),
                    div('.cell', t(Item, { name: 'bombos' })),
                    div('.cell', t(Item, { name: 'ether' })),
                    div('.cell', t(Item, { name: 'quake' }))),
                div('.row',
                    div('.cell', t(Item, { name: 'lantern' })),
                    div('.cell', t(Item, { name: 'hammer' })),
                    div('.cell', t(Item, { name: 'shovel' })),
                    div('.cell', t(Item, { name: 'net' })),
                    div('.cell', t(Item, { name: 'book' }))),
                div('.row',
                    div('.cell', t(Item, { name: 'bottle' })),
                    div('.cell', t(Item, { name: 'somaria' })),
                    div('.cell', t(Item, { name: 'byrna' })),
                    div('.cell', t(Item, { name: 'cape' })),
                    div('.cell', t(Item, { name: 'mirror' }))),
                div('.row',
                    div('.cell', t(Item, { name: 'boots' })),
                    div('.cell', t(Item, { name: 'glove' })),
                    div('.cell', t(Item, { name: 'flippers' })),
                    div('.cell', t(Item, { name: 'flute' })),
                    div('.cell', t(Item, { name: 'agahnim' })))
            ];
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
                var name = this.props.name;
                this.props.change_caption(highlighted ? source(name).caption : null);
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
            chests = Object.assign({}, chests);
            chests[name] = create(chests[name].__proto__, chests[name]);
            chests[name].marked = !chests[name].marked;
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

    function toggle_chest(target) {
        var name = dungeon_name(target.classList),
            dungeon = dungeons[name],
            value = counter(dungeon.chests, -1, dungeon.chest_limit);

        update_dungeon(name, 'chests', value);
        target.className = classNames('chest', 'chest-'+value, name);

        if (map_enabled)
            model_changed();
    }

    function toggle_boss(target) {
        var name = dungeon_name(target.classList),
            value = !dungeons[name].completed;

        update_dungeon(name, 'completed', value);
        target.classList[value ? 'add' : 'remove']('defeated');

        if (map_enabled)
            model_changed();
    }

    function toggle_prize(target) {
        var name = dungeon_name(target.classList),
            value = counter(dungeons[name].prize, 1, 4);

        update_dungeon(name, 'prize', value);
        target.className = classNames('prize', 'prize-'+value, name);

        if (map_enabled)
            model_changed();
    }

    function toggle_medallion(target) {
        var name = dungeon_name(target.classList),
            value = counter(dungeons[name].medallion, 1, 3);

        update_dungeon(name, 'medallion', value);
        target.className = classNames('medallion', 'medallion-'+value, name);

        if (map_enabled) {
            model_changed();
            // Change the mouseover text on the map
            dungeons[name].caption = dungeons[name].caption.replace(/\{medallion\d+\}/, '{medallion'+value+'}');
        }
    }

    function dungeon_name(class_list) {
        var terms = ['boss', 'chest', 'prize', 'medallion', 'defeated'];
        return Array.from(class_list).filter(function(x) {
            return !(terms.includes(x) || x.match(/^(chest|prize|medallion)-?/));
        })[0];
    }

    function update_dungeon(name, key, value) {
        dungeons = Object.assign({}, dungeons);
        dungeons[name] = create(dungeons[name].__proto__, dungeons[name]);
        dungeons[name][key] = value;
    }

    window.start = function() {
        ReactDOM.render(t(Avatar), document.getElementById('avatar-rjs'));
        ReactDOM.render(t(ItemGrid), document.getElementById('item-grid-rjs'));
        ReactDOM.render(t(Map), document.getElementById('map-rjs'));

        if (mode !== 'open') {
            document.getElementsByClassName('sword')[0].classList.add('active-1');
        }

        document.getElementById('tracker').addEventListener('click', function(event) {
            var target = event.target;
            if (target.classList.contains('chest')) toggle_chest(target);
            if (target.classList.contains('boss')) toggle_boss(target);
            if (target.classList.contains('prize')) toggle_prize(target);
            if (target.classList.contains('medallion')) toggle_medallion(target);
        });

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
