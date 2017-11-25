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
            which === 'chest' && this.forceUpdate();
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
            model_changed('chest');
            Object.keys(dungeons).forEach(function(name, index) {
                var location = as_location(name);
                if (!dungeons[name].completed)
                    document.querySelector('#map .boss.' + location).className = classNames('boss', location, dungeons[name].is_completable());
                if (dungeons[name].chests)
                    document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location, dungeons[name].is_progressable());
            });
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

        if (map_enabled) {
            var location = as_location(name);
            document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location,
                value ? dungeons[name].is_progressable() : 'marked');
        }
    }

    function toggle_boss(target) {
        var name = dungeon_name(target.classList),
            value = !dungeons[name].completed;

        update_dungeon(name, 'completed', value);
        target.classList[value ? 'add' : 'remove']('defeated');

        // Clicking a boss on the tracker will check it off on the map!
        if (map_enabled) {
            update_boss(name);
            model_changed('chest');
        }
    }

    function toggle_prize(target) {
        var name = dungeon_name(target.classList),
            value = counter(dungeons[name].prize, 1, 4);

        update_dungeon(name, 'prize', value);
        target.className = classNames('prize', 'prize-'+value, name);

        if (map_enabled)
            model_changed('chest');
    }

    function toggle_medallion(target) {
        var name = dungeon_name(target.classList),
            value = counter(dungeons[name].medallion, 1, 3);

        update_dungeon(name, 'medallion', value);
        target.className = classNames('medallion', 'medallion-'+value, name);

        if (map_enabled) {
            // Update availability of dungeon boss AND chests
            var location = as_location(name);
            update_boss(name);
            if (dungeons[name].chests)
                document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location, dungeons[name].is_progressable());
            // TRock medallion affects Mimic Cave
            model_changed('chest');
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

    function update_boss(name) {
        var location = as_location(name);
        document.querySelector('#map .boss.' + location).className = classNames('boss', location,
            dungeons[name].completed ? 'marked' : dungeons[name].is_completable());
    }

    function highlight(target, source) {
        var location = location_name(target.classList),
            name = as_identifier(location);
        location_target(target, location).classList.add('highlight');
        model_changed('caption', source[name].caption);
    }

    function unhighlight(target) {
        var location = location_name(target.classList)
        location_target(target, location).classList.remove('highlight');
        model_changed('caption', null);
    }

    function location_name(class_list) {
        var terms = ['boss', 'dungeon', 'encounter', 'highlight',
            'marked', 'unavailable', 'available', 'possible', 'dark'];
        return Array.from(class_list).filter(function(x) { return !terms.includes(x); })[0];
    }

    function location_target(target, location) {
        return target.classList.contains('boss') ?
            document.querySelector('#map ' + (location === 'agahnim' ? '.encounter.' : '.dungeon.') + location) :
            target;
    }

    window.start = function() {
        ReactDOM.render(
            Object.keys(chests).map(function(name) { return t(MapChest, { name: name }); }),
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
                // Check Agahnim first since his .boss div might be highlighted
                var source = event.target.classList.contains('agahnim') ? encounters :
                    event.target.classList.contains('boss') ||
                    event.target.classList.contains('dungeon') ? dungeons : null;
                source && highlight(event.target, source);
            });
            map.addEventListener('mouseout', function(event) {
                if (event.target.classList.contains('boss') ||
                    event.target.classList.contains('dungeon') ||
                    event.target.classList.contains('agahnim'))
                    unhighlight(event.target);
            });

            document.querySelector('#map .encounter.agahnim').classList.add(encounters.agahnim.is_completable());
            Object.keys(dungeons).forEach(function(name) {
                var dungeon = dungeons[name],
                    location = as_location(name);
                document.querySelector('#map .boss.' + location).classList.add(dungeon.is_completable());
                document.querySelector('#map .dungeon.' + location).classList.add(dungeon.is_progressable());
            });
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
