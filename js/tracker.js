(function(window) {
    'use strict';

    window.prizes = [];
    window.medallions = [0, 0];
    window.mode = get_query_variable('mode');
    window.map_enabled = get_query_variable('map') === 'true';

    // Event of clicking on the item tracker
    window.toggle = function(label) {
        var node = document.getElementById(label),
            is_boss = node.classList.contains('boss');
        if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
            node.className = 'chest-' + value;
            if (map_enabled) {
                var x = label.substring(5);
                document.getElementById('dungeon'+x).className = 'dungeon ' +
                    (value ? dungeons[x].can_get_chest() : 'opened');
            }
            return;
        }
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
            document.getElementById('tunic').classList[!items.moonpearl ? 'add' : 'remove']('bunny');
        }

        if (map_enabled) {
            for (var k = 0; k < chests.length; k++) {
                if (!chests[k].is_opened)
                    document.getElementById('chestMap'+k).className = 'chest ' + chests[k].is_available();
            }
            for (var k = 0; k < dungeons.length; k++) {
                if (!dungeons[k].is_beaten)
                    document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
                if (items['chest'+k])
                    document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
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
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendant_chests = [25, 61, 62];
            for (var k = 0; k < pendant_chests.length; k++) {
                if (!chests[pendant_chests[k]].is_opened)
                    document.getElementById('chestMap'+pendant_chests[k]).className = 'chest ' + chests[pendant_chests[k]].is_available();
            }
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
                document.getElementById('dungeon'+(8+n)).className = 'dungeon ' + dungeons[8+n].can_get_chest();
            // TRock medallion affects Mimic Cave
            if (n === 1) {
                chests[4].is_opened = !chests[4].is_opened;
                toggle_chest(4);
            }
            // Change the mouseover text on the map
            var dungeon_name = n === 0 ? 'Misery Mire' : 'Turtle Rock';
            dungeons[8+n].name = dungeon_name + ' <img src="images/dungeons/medallion'+medallions[n]+'.png" class="mini"><img src="images/items/lantern.png" class="mini">';
        }
    };

    if (map_enabled) {
        // Event of clicking a chest on the map
        window.toggle_chest = function(x) {
            chests[x].is_opened = !chests[x].is_opened;
            var highlight = document.getElementById('chestMap'+x).classList.contains('highlight');
            document.getElementById('chestMap'+x).className = 'chest ' +
                (chests[x].is_opened ? 'opened' : chests[x].is_available()) +
                (highlight ? ' highlight' : '');
        };
        // Event of clicking a dungeon location (not really)
        window.toggle_boss = function(x) {
            dungeons[x].is_beaten = !dungeons[x].is_beaten;
            document.getElementById('bossMap'+x).className = 'boss ' +
                (dungeons[x].is_beaten ? 'opened' : dungeons[x].is_beatable());
        };
        window.toggle_agahnim = function() {
            document.getElementById('castle').className = 'castle ' +
                (items.agahnim ? 'opened' : agahnim.is_available());
        };
        // Highlights a chest location and shows the name as caption
        window.highlight = function(x) {
            document.getElementById('chestMap'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = chests[x].name;
        };
        window.unhighlight = function(x) {
            document.getElementById('chestMap'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
        // Highlights a chest location and shows the name as caption (but for dungeons)
        window.highlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = dungeons[x].name;
        };
        window.unhighlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
        window.highlight_agahnim = function() {
            document.getElementById('castle').classList.add('highlight');
            document.getElementById('caption').innerHTML = agahnim.name;
        };
        window.unhighlight_agahnim = function() {
            document.getElementById('castle').classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
    }

    window.start = function() {
        for (var k = 0; k < dungeons.length; k++) {
            prizes[k] = 0;
        }

        if (mode !== 'open') {
            document.getElementById('sword').classList.add('active-1');
        }

        if (map_enabled) {
            for (k = 0; k < chests.length; k++) {
                document.getElementById('chestMap'+k).className = 'chest ' + (chests[k].is_opened ? 'opened' : chests[k].is_available());
            }
            document.getElementById('bossMapAgahnim').className = 'boss';
            document.getElementById('castle').className = 'castle ' + agahnim.is_available();
            for (k = 0; k < dungeons.length; k++) {
                document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
                document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
            }
        } else {
            document.getElementById('map').style.display = 'none';
        }
    };
}(window));
