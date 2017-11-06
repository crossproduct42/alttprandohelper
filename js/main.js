(function(window) {
    'use strict';

    var query = uri_query();
    window.prizes = [];
    window.medallions = [0, 0];
    window.mode = query.mode;
    window.map_enabled = query.map;

    function toggle_chest(target) {
        var name = target.id;
        var value = items.dec(name);
        target.className = 'chest-' + value;
        if (map_enabled) {
            var index = name.replace(/^chest/, ''),
                name = dungeon_names[index],
                location = as_location(name);
            document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location,
                value ? dungeons[name].can_get_chest() : 'opened');
        }
    }

    function toggle_boss(target) {
        var label = boss_name(target.classList);
        items[label] = !items[label];
        target.classList[items[label] ? 'add' : 'remove']('defeated');

        // Clicking a boss on the tracker will check it off on the map!
        if (map_enabled) {
            var index = label.replace(/^boss/, ''),
                name = dungeon_names[index];
            dungeons[name].is_beaten = !dungeons[name].is_beaten;
            update_boss(name);
            update_prize_locations();
        }
    }

    function boss_name(class_list) {
        var terms = ['boss', 'defeated'];
        return Array.from(class_list).filter(function(x) { return !terms.includes(x); })[0];
    }

    // Event of clicking on the item tracker
    window.toggle = function(label) {
        var node = document.getElementsByClassName(label)[0];
        if ((typeof items[label]) === 'boolean') {
            items[label] = !items[label];
            node.classList[items[label] ? 'add' : 'remove']('active');
        } else {
            var value = items.inc(label);
            node.className = node.className.replace(/ ?active-\w+/, '');
            if (value) node.classList.add('active-' + value);
        }
        // Initiate bunny graphics!
        if (label === 'moonpearl' || label === 'tunic') {
            document.getElementsByClassName('tunic')[0].classList[!items.moonpearl ? 'add' : 'remove']('bunny');
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
                if (items['chest'+index])
                    document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location, dungeons[name].can_get_chest());
            });
            if (['agahnim', 'cape', 'sword', 'lantern'].includes(label)) {
                document.querySelector('#map .encounter.agahnim').className = classNames('encounter', 'agahnim',
                    items.agahnim ? 'opened' : encounters.agahnim.is_available());
            }
        }
    };

    // event of clicking on a boss's pendant/crystal subsquare
    window.toggle_dungeon = function(n) {
        prizes[n] += 1;
        if (prizes[n] === 5) prizes[n] = 0;

        document.getElementById('dungeonPrize'+n).className = 'prize-' + prizes[n];

        if (map_enabled)
            update_prize_locations();
    };

    // event of clicking on Mire/TRock's medallion subsquare
    window.toggle_medallion = function(n) {
        medallions[n] += 1;
        if (medallions[n] === 4) medallions[n] = 0;

        document.getElementById('medallion'+n).className = 'medallion-' + medallions[n];

        if (map_enabled) {
            // Update availability of dungeon boss AND chests
            var index = 8 + n,
                name = dungeon_names[index],
                location = as_location(name);
            update_boss(name);
            if (items['chest'+index])
                document.querySelector('#map .dungeon.' + location).className = classNames('dungeon', location, dungeons[name].can_get_chest());
            // TRock medallion affects Mimic Cave
            if (name === 'turtle') {
                document.querySelector('#map .mimic').className = classNames('chest', 'mimic',
                    chests.mimic.is_opened ? 'opened' : chests.mimic.is_available());
            }
            // Change the mouseover text on the map
            dungeons[name].caption = dungeons[name].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[n]+'}');
        }
    };

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
        dungeon_names.forEach(function() { prizes.push(0); });

        if (mode !== 'open') {
            document.getElementsByClassName('sword')[0].classList.add('active-1');
        }

        document.getElementById('tracker').addEventListener('click', function(event) {
            var target = event.target;
            if (target.classList.contains('boss')) toggle_boss(target);
            if ((target.id || '').startsWith('chest')) toggle_chest(target);
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
