(function(window) {
    'use strict';

    var query = uri_query();
    window.prizes = [];
    window.medallions = [0, 0];
    window.mode = query.mode;
    window.map_enabled = query.map;

    // Event of clicking on the item tracker
    window.toggle = function(label) {
        if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
            document.getElementById(label).className = 'chest-' + value;
            if (map_enabled) {
                var x = label.substring(5);
                document.getElementById('dungeon'+x).className = classNames('dungeon',
                    value ? dungeons[x].can_get_chest() : 'opened');
            }
            return;
        }
        var node = document.getElementsByClassName(label)[0],
            is_boss = node.classList.contains('boss');
        if ((typeof items[label]) === 'boolean') {
            items[label] = !items[label];
            node.classList[items[label] ? 'add' : 'remove'](is_boss ? 'defeated' : 'active');
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
            for (var k = 0; k < dungeons.length; k++) {
                if (!dungeons[k].is_beaten)
                    document.getElementById('bossMap'+k).className = classNames('boss', dungeons[k].is_beatable());
                if (items['chest'+k])
                    document.getElementById('dungeon'+k).className = classNames('dungeon', dungeons[k].can_get_chest());
            }
            // Clicking a boss on the tracker will check it off on the map!
            if (is_boss) {
                toggle_boss(label.substring(4));
            }
            if (label === 'agahnim' || label === 'cape' || label === 'sword' || label === 'lantern') {
                toggle_agahnim();
            }
        }
    };

    // event of clicking on a boss's pendant/crystal subsquare
    window.toggle_dungeon = function(n) {
        prizes[n] += 1;
        if (prizes[n] === 5) prizes[n] = 0;

        document.getElementById('dungeonPrize'+n).className = 'prize-' + prizes[n];

        if (map_enabled) {
            // Update pendant dependant locations
            ['sahasrahla', 'fairy_dw', 'altar'].forEach(function(name) {
                var location = as_location(name);
                if (!chests[name].is_opened)
                    document.querySelector('#map .' + location).className = classNames('chest', location, chests[name].is_available());
            });
        }
    };

    // event of clicking on Mire/TRock's medallion subsquare
    window.toggle_medallion = function(n) {
        medallions[n] += 1;
        if (medallions[n] === 4) medallions[n] = 0;

        document.getElementById('medallion'+n).className = 'medallion-' + medallions[n];

        if (map_enabled) {
            // Update availability of dungeon boss AND chests
            dungeons[8+n].is_beaten = !dungeons[8+n].is_beaten;
            toggle_boss(8+n);
            if (items['chest'+(8+n)] > 0)
                document.getElementById('dungeon'+(8+n)).className = classNames('dungeon', dungeons[8+n].can_get_chest());
            // TRock medallion affects Mimic Cave
            if (n === 1) {
                document.querySelector('#map .mimic').className = classNames('chest', 'mimic',
                    chests.mimic.is_opened ? 'opened' : chests.mimic.is_available());
            }
            // Change the mouseover text on the map
            dungeons[8+n].caption = dungeons[8+n].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[n]+'}');
        }
    };

    if (map_enabled) {
        // Event of clicking a dungeon location (not really)
        window.toggle_boss = function(x) {
            dungeons[x].is_beaten = !dungeons[x].is_beaten;
            document.getElementById('bossMap'+x).className = classNames('boss',
                dungeons[x].is_beaten ? 'opened' : dungeons[x].is_beatable());
        };
        window.toggle_agahnim = function() {
            document.querySelector('#map .encounter.agahnim').className = classNames('encounter', 'agahnim',
                items.agahnim ? 'opened' : encounters.agahnim.is_available());
        };
        // Highlights a chest location and shows the caption (but for dungeons)
        window.highlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(dungeons[x].caption);
        };
        window.unhighlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
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
        var terms = ['boss', 'encounter', 'chest', 'highlight', 'opened', 'unavailable', 'available', 'possible', 'dark'];
        return Array.from(class_list).filter(function(x) { return !terms.includes(x); })[0];
    }

    function location_target(target, location) {
        return target.classList.contains('boss') ?
            document.querySelector('#map .encounter.' + location) :
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
        for (var k = 0; k < dungeons.length; k++) {
            prizes[k] = 0;
        }

        if (mode !== 'open') {
            document.getElementsByClassName('sword')[0].classList.add('active-1');
        }

        if (map_enabled) {
            var map = document.getElementById('map');
            map.addEventListener('mouseover', function(event) { 
                event.target.classList.contains('chest') && highlight(event.target, chests);
                event.target.classList.contains('agahnim') && highlight(event.target, encounters);
            });
            map.addEventListener('mouseout', function(event) {
                if (event.target.classList.contains('chest') ||
                    event.target.classList.contains('agahnim'))
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
            for (k = 0; k < dungeons.length; k++) {
                document.getElementById('bossMap'+k).className = classNames('boss', dungeons[k].is_beatable());
                document.getElementById('dungeon'+k).className = classNames('dungeon', dungeons[k].can_get_chest());
            }
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
