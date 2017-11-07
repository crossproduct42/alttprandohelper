(function(window) {
    'use strict';

    var query = uri_query();
    window.prizes = {};
    window.medallions = {};
    window.mode = query.mode;
    window.map_enabled = query.map;

    function toggle_chest(target) {
        var name = dungeon_name(target.classList),
            value = count.chests.dec(name);

        target.className = classNames('chest', 'chest-'+value, name);

        if (map_enabled) {
            var location = as_location(name);
            document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location,
                value ? dungeons[name].can_get_chest() : 'opened');
        }
    }

    function toggle_boss(target) {
        var name = dungeon_name(target.classList);
        items[name] = !items[name];
        target.classList[items[name] ? 'add' : 'remove']('defeated');

        // Clicking a boss on the tracker will check it off on the map!
        if (map_enabled) {
            dungeons[name].is_beaten = !dungeons[name].is_beaten;
            update_boss(name);
            update_prize_locations();
        }
    }

    function toggle_item(target) {
        var name = item_name(target.classList);
        if ((typeof items[name]) === 'boolean') {
            items[name] = !items[name];
            target.classList[items[name] ? 'add' : 'remove']('active');
        } else {
            var value = items.inc(name);
            target.className = target.className.replace(/ ?active-\w+/, '');
            if (value) target.classList.add('active-' + value);
        }
        // Initiate bunny graphics!
        if (['moonpearl', 'tunic'].includes(name)) {
            document.querySelector('#tracker .tunic').classList[!items.moonpearl ? 'add' : 'remove']('bunny');
        }

        if (map_enabled) {
            Object.keys(chests).forEach(function(name) {
                var location = as_location(name);
                if (!chests[name].is_opened)
                    document.querySelector('#map .' + location).className = classNames('chest', location, chests[name].is_available());
            });
            Object.keys(dungeons).forEach(function(name, index) {
                var location = as_location(name);
                if (!dungeons[name].is_beaten)
                    document.querySelector('#map .boss.' + location).className = classNames('boss', location, dungeons[name].is_beatable());
                if (count.chests[name])
                    document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location, dungeons[name].can_get_chest());
            });
            if (['agahnim', 'cape', 'sword', 'lantern'].includes(name)) {
                document.querySelector('#map .encounter.agahnim').className = classNames('encounter', 'agahnim',
                    items.agahnim ? 'opened' : encounters.agahnim.is_available());
            }
        }
    }

    function item_name(class_list) {
        var terms = ['item', 'active', 'bunny'];
        return Array.from(class_list).filter(function(x) { return !(terms.includes(x) || x.match(/^active-/)); })[0];
    }

    function toggle_prize(target) {
        var name = dungeon_name(target.classList);
        prizes[name] += 1;
        if (prizes[name] === 5) prizes[name] = 0;

        target.className = classNames('prize', 'prize-'+prizes[name], name);

        if (map_enabled)
            update_prize_locations();
    }


    function toggle_medallion(target) {
        var name = dungeon_name(target.classList);
        medallions[name] += 1;
        if (medallions[name] === 4) medallions[name] = 0;

        target.className = classNames('medallion', 'medallion-'+medallions[name], name);

        if (map_enabled) {
            // Update availability of dungeon boss AND chests
            var location = as_location(name);
            update_boss(name);
            if (count.chests[name])
                document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location, dungeons[name].can_get_chest());
            // TRock medallion affects Mimic Cave
            if (name === 'turtle') {
                document.querySelector('#map .mimic').className = classNames('chest', 'mimic',
                    chests.mimic.is_opened ? 'opened' : chests.mimic.is_available());
            }
            // Change the mouseover text on the map
            dungeons[name].caption = dungeons[name].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[name]+'}');
        }
    }

    function dungeon_name(class_list) {
        var terms = ['boss', 'chest', 'prize', 'medallion', 'defeated'];
        return Array.from(class_list).filter(function(x) {
            return !(terms.includes(x) || x.match(/^(chest|prize|medallion)-?/));
        })[0];
    }

    function update_boss(name) {
        var location = as_location(name);
        document.querySelector('#map .boss.' + location).className = classNames('boss', location,
            dungeons[name].is_beaten ? 'opened' : dungeons[name].is_beatable());
    }

    function update_prize_locations() {
        ['sahasrahla', 'fairy_dw', 'altar'].forEach(function(name) {
            var location = as_location(name);
            if (!chests[name].is_opened)
                document.querySelector('#map .' + location).className = classNames('chest', location, chests[name].is_available());
        });
    }

    function toggle_map(target) {
        var location = location_name(target.classList),
            name = as_identifier(location);
        chests[name].is_opened = !chests[name].is_opened;
        target.className = classNames('chest', location,
            chests[name].is_opened ? 'opened' : chests[name].is_available(),
            'highlight');
    }

    function highlight(target, source) {
        var location = location_name(target.classList),
            name = as_identifier(location);
        location_target(target, location).classList.add('highlight');
        document.getElementById('caption').innerHTML = caption_to_html(source[name].caption);
    }

    function unhighlight(target) {
        var location = location_name(target.classList)
        location_target(target, location).classList.remove('highlight');
        document.getElementById('caption').innerHTML = '&nbsp;';
    }

    function location_name(class_list) {
        var terms = ['boss', 'dungeon', 'encounter', 'chest', 'highlight',
            'opened', 'unavailable', 'available', 'possible', 'dark'];
        return Array.from(class_list).filter(function(x) { return !terms.includes(x); })[0];
    }

    function location_target(target, location) {
        return target.classList.contains('boss') ?
            document.querySelector('#map ' + (location === 'agahnim' ? '.encounter.' : '.dungeon.') + location) :
            target;
    }

    function caption_to_html(caption) {
        return caption.replace(/\{(\w+?)(\d+)?\}/g, function(__, name, n) {
            var dash = /medallion|pendant/.test(name)
            return '<div class="icon ' +
                (dash ? name + '-' + n :
                n ? name + ' active-' + n :
                name) + '"></div>';
        });
    }

    window.start = function() {
        Object.keys(dungeons).forEach(function(name) { prizes[name] = 0; });
        ['mire', 'turtle'].forEach(function(name) { medallions[name] = 0; });

        if (mode !== 'open') {
            document.getElementsByClassName('sword')[0].classList.add('active-1');
        }

        document.getElementById('tracker').addEventListener('click', function(event) {
            var target = event.target;
            if (target.classList.contains('boss')) toggle_boss(target);
            if (target.classList.contains('item')) toggle_item(target);
            if (target.classList.contains('chest')) toggle_chest(target);
            if (target.classList.contains('prize')) toggle_prize(target);
            if (target.classList.contains('medallion')) toggle_medallion(target);
        });

        if (map_enabled) {
            var map = document.getElementById('map');
            map.addEventListener('mouseover', function(event) { 
                // Check Agahnim first since his .boss div might be highlighted
                var source = event.target.classList.contains('agahnim') ? encounters :
                    event.target.classList.contains('boss') ||
                    event.target.classList.contains('dungeon') ? dungeons :
                    event.target.classList.contains('chest') ? chests : null;
                source && highlight(event.target, source);
            });
            map.addEventListener('mouseout', function(event) {
                if (event.target.classList.contains('boss') ||
                    event.target.classList.contains('dungeon') ||
                    event.target.classList.contains('agahnim') ||
                    event.target.classList.contains('chest'))
                    unhighlight(event.target);
            });
            map.addEventListener('click', function(event) {
                event.target.classList.contains('chest') && toggle_map(event.target);
            });

            Object.keys(chests).forEach(function(name) {
                var chest = chests[name];
                document.querySelector('#map .' + as_location(name)).classList.add(chest.is_opened ? 'opened' : chest.is_available());
            });
            document.querySelector('#map .encounter.agahnim').classList.add(encounters.agahnim.is_available());
            Object.keys(dungeons).forEach(function(name) {
                var dungeon = dungeons[name],
                    location = as_location(name);
                document.querySelector('#map .boss.' + location).classList.add(dungeon.is_beatable());
                document.querySelector('#map .dungeon.' + location).classList.add(dungeon.can_get_chest());
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
