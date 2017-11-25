(function(window) {
    'use strict';

    var model_changed = announcer();

    var MapChest = createReactClass({
        getInitialState: function() {
            return { highlighted: false };
        },

        componentDidMount: function() { model_changed.on(this.handle_change); },
        componentWillUnmount: function() { model_changed.off(this.handle_change); },

        handle_change: function(which) {
            which === 'tracker' && this.forceUpdate();
        },

        render: function() {
            var name = this.props.name,
                marked = chests[name].marked;
            return div('.chest', {
                className: classNames(
                    as_location(name),
                    marked || chests[name].is_available(), {
                        marked: marked,
                        highlight: this.state.highlighted
                    }),
                onClick: this.handle_click,
                onMouseOver: this.handle_over,
                onMouseOut: this.handle_out
            });
        },

        handle_click: function() {
            var name = this.props.name;
            chests = Object.assign({}, chests);
            chests[name] = create(chests[name].__proto__, chests[name]);
            chests[name].marked = !chests[name].marked;
            this.forceUpdate();
        },

        handle_over: function() {
            model_changed('caption', chests[this.props.name].caption);
            this.setState({ highlighted: true });
        },
        
        handle_out: function() {
            model_changed('caption', null);
            this.setState({ highlighted: false });
        }
    });

    var MapDungeon = createReactClass({
        getInitialState: function() {
            return { highlighted: false };
        },

        componentDidMount: function() { model_changed.on(this.handle_change); },
        componentWillUnmount: function() { model_changed.off(this.handle_change); },

        handle_change: function(which) {
            which === 'tracker' && this.forceUpdate();
        },

        render: function() {
            var name = this.props.name,
                dungeon = dungeons[name];
            return [
                div('.boss', {
                    className: classNames(
                        as_location(name),
                        dungeon.completed || dungeon.is_completable(),
                        { marked: dungeon.completed }),
                    onMouseOver: this.handle_over,
                    onMouseOut: this.handle_out
                }),
                div('.dungeon', {
                    className: classNames(
                        as_location(name),
                        dungeon.chests === 0 || dungeon.is_progressable(), {
                            marked: dungeon.chests === 0,
                            highlight: this.state.highlighted
                        }),
                    onMouseOver: this.handle_over,
                    onMouseOut: this.handle_out
                })
            ];
        },

        handle_over: function() {
            model_changed('caption', dungeons[this.props.name].caption);
            this.setState({ highlighted: true });
        },
        
        handle_out: function() {
            model_changed('caption', null);
            this.setState({ highlighted: false });
        }
    });

    var Caption = createReactClass({
        getInitialState: function() {
            return { caption: null };
        },

        componentDidMount: function() { model_changed.on(this.handle_change); },
        componentWillUnmount: function() { model_changed.off(this.handle_change); },

        handle_change: function(which, caption) {
            which === 'caption' && this.setState({ text: caption });
        },

        render: function() {
            var each_part = /[^{]+|\{[\w]+\}/g,
                text = this.state.text;
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

    var query = uri_query();
    window.mode = query.mode;
    window.map_enabled = query.map;

    function toggle_item(target) {
        var name = item_name(target.classList),
            is_toggle = typeof items[name] === 'boolean',
            value = is_toggle ? !items[name] : items.inc(name);

        items = create(items.__proto__, items);
        items[name] = value;

        target.className = target.className.replace(/ ?active(-\w+)?/, '');
        if (value) target.classList.add(is_toggle ? 'active' : 'active-' + value);

        // Initiate bunny graphics!
        if (['moonpearl', 'tunic'].includes(name)) {
            document.querySelector('#tracker .tunic').classList[!items.moonpearl ? 'add' : 'remove']('bunny');
        }

        if (map_enabled) {
            model_changed('tracker');
            if (['agahnim', 'cape', 'sword', 'lantern'].includes(name)) {
                document.querySelector('#map .encounter.agahnim').className = classNames('encounter', 'agahnim',
                    items.agahnim ? 'marked' : encounters.agahnim.is_completable());
            }
        }
    }

    function item_name(class_list) {
        var terms = ['item', 'active', 'bunny'];
        return Array.from(class_list).filter(function(x) { return !(terms.includes(x) || x.match(/^active-/)); })[0];
    }

    function toggle_chest(target) {
        var name = dungeon_name(target.classList),
            dungeon = dungeons[name],
            value = counter(dungeon.chests, -1, dungeon.chest_limit);

        update_dungeon(name, 'chests', value);
        target.className = classNames('chest', 'chest-'+value, name);

        if (map_enabled)
            model_changed('tracker');
    }

    function toggle_boss(target) {
        var name = dungeon_name(target.classList),
            value = !dungeons[name].completed;

        update_dungeon(name, 'completed', value);
        target.classList[value ? 'add' : 'remove']('defeated');

        if (map_enabled)
            model_changed('tracker');
    }

    function toggle_prize(target) {
        var name = dungeon_name(target.classList),
            value = counter(dungeons[name].prize, 1, 4);

        update_dungeon(name, 'prize', value);
        target.className = classNames('prize', 'prize-'+value, name);

        if (map_enabled)
            model_changed('tracker');
    }

    function toggle_medallion(target) {
        var name = dungeon_name(target.classList),
            value = counter(dungeons[name].medallion, 1, 3);

        update_dungeon(name, 'medallion', value);
        target.className = classNames('medallion', 'medallion-'+value, name);

        if (map_enabled) {
            model_changed('tracker');
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

    function highlight(target, source) {
        document.querySelector('#map .encounter.agahnim').classList.add('highlight');
        model_changed('caption', encounters.agahnim.caption);
    }

    function unhighlight(target) {
        document.querySelector('#map .encounter.agahnim').classList.remove('highlight');
        model_changed('caption', null);
    }

    window.start = function() {
        ReactDOM.render([
                Object.keys(chests).map(function(name) { return t(MapChest, { name: name }); }),
                Object.keys(dungeons).map(function(name) { return t(MapDungeon, { name: name }); })
            ],
            document.getElementById('locations-rjs'));
        ReactDOM.render(t(Caption), document.getElementById('caption-rjs'));

        if (mode !== 'open') {
            document.getElementsByClassName('sword')[0].classList.add('active-1');
        }

        document.getElementById('tracker').addEventListener('click', function(event) {
            var target = event.target;
            if (target.classList.contains('item')) toggle_item(target);
            if (target.classList.contains('chest')) toggle_chest(target);
            if (target.classList.contains('boss')) toggle_boss(target);
            if (target.classList.contains('prize')) toggle_prize(target);
            if (target.classList.contains('medallion')) toggle_medallion(target);
        });

        if (map_enabled) {
            var map = document.getElementById('map');
            map.addEventListener('mouseover', function(event) { 
                event.target.classList.contains('agahnim') && highlight(event.target, encounters);
            });
            map.addEventListener('mouseout', function(event) {
                event.target.classList.contains('agahnim') && unhighlight(event.target);
            });

            document.querySelector('#map .encounter.agahnim').classList.add(encounters.agahnim.is_completable());
        } else {
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
