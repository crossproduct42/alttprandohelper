(function(window) {
    'use strict';

    var query = uri_query();
    window.prizes = [];
    window.medallions = [0, 0];
    window.mode = query.mode;
    window.map_enabled = query.map;
    window.gomode_indicator = (query.gomode !== "no");
    window.gomode_mode = query.gomode;

    // Utility function: remove item from array.
    window.arr_remove = function(array, element) {
        const index = array.indexOf(element);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    // Event of clicking on the item tracker
    window.toggle = function(label) {
        if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
            document.getElementById(label).className = 'chest-' + value;
            if (map_enabled) {
                var x = label.substring(5);
                document.getElementById('dungeon'+x).className = 'dungeon ' +
                    (value ? dungeons[x].can_get_chest() : 'opened');
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
        if (gomode_indicator) {
            update_gomode_list()
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
        if (gomode_indicator) {
            update_gomode_list()
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
            dungeons[8+n].caption = dungeons[8+n].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[n]+'}');
        }
        if (gomode_indicator) {
            update_gomode_list()
        }
    };


    if (gomode_indicator) {
        // The list of gomode items required in all runs.
        // Gomode lists in this document assumes that the player is capable of the most common skips: fake flippers, bomb jumps and navigating dark rooms
        // if they choose minor glitches logic. If they choose no glitches logic, flippers and lamp is displayed where relevant.
        // The minor glitches logic does require hovering, as it is a very difficult skip.
        // The list shows hard required items in order to access all crystal bosses and all 22 items on the bottom floor of Ganon's Tower.
        // The list does explicitly lists items which circumstantially block access to bosses;
        // There are two instances of this in minor glitches: Boots for DP, fire source for ToH. In addition, no glitches requires hookshot or cane for IP.
        // These measures are done to differentiate between Schrodinger's Go Mode and proper Go Mode. An experienced runner should be able to identify these items,
        // while a less experienced runner may be confused by the list not containing an item required in their specific seed.
        // Since these items however, are already required by the definition of the gomode list logic, they will be shown for different reasons.
        // Items are defined as a list of [item name, item level]. For progressive items, the item level is a level that we must at least have in order to qualify
        // (eg. 1 for fighter sword/power gloves). The level of bow follows the UI - 1 is silver arrows no bow, 2 is bow, 3 is bow with silver arrows.
        // Items that are not progressive must have a negative number, I use -1 for this purpose. Negative numbers are not checked for levels, only for existence.
        // Possible future TODO: Highlight Schrodinger's gomode - where game completion is a possibility but may be conditionally locked.
        window.default_gomode_list = [
            // Moon pearl is always required in no glitches/minor glitches logic.
            ["moonpearl", -1],
            // At least a master sword is required to damage Ganon.
            ["sword", 2],
            // Titan's Mitts is requires to open up the dark world portals capable of accessing Ganon's Tower.
            ["glove", 2],
            // Hookshot is required to cross the gap past Moldorm 2. We do not account for hovering.
            ["hookshot", -1],
            // The Cane of Somaria may be required to access the right side in Ganon's Tower.
            ["somaria", -1],
            // A fire source is always required to light the torches in upper GT and on the lower right side.
                // In minor glitches, a bomb jump can be used with lamp for lower GT .
                ["mg", ["or", ["lantern", -1], ["firerod", -1]]],
                // In no glitches, we always require fire rod.
                ["ng", ["firerod", -1]],
            // Boots may be required for a big key on the GT torch.
            ["boots", -1],
            // A bow is always required to kill red mimics in GT.
            ["bow", 2],
            // Hammer is not explicitly required for GT, however, as more than 3 dungeons require it for progression, there is no run where a crystal
            // is not in a hammerlocked dungeon.
            ["hammer", -1]
        ];

        // Medallion class map. The number (of the medallion assigned to a dungeon) corresponds to a medallion class define in the style sheet.
        window.t_medallions = {
            0: "medallion-0",
            1: "bombos",
            2: "ether",
            3: "quake"
        };

        // Lists of items required for each dungeon.
        // This list assumes completability under some circumstances, for example, it doesn't require boots for desert.
        window.boss_lists = {
            // EP requires bow for completion and the ability to traverse one of the easiest dark rooms in the game. In no glitches, we still require lamp.
            0: [["bow", 2], ["ng", ["lantern", -1]]],
            // DP requires: mirror, mitts and flute; or book to enter. You also require a fire source to open the boss room.
            1: [["or", ["mirror", -1], ["book", -1]], ["or", ["glove", 2], ["book", -1]], ["or", ["flute", -1], ["book", -1]], ["or", ["lantern", -1], ["firerod", -1]], ["boots", -1]],
            // Hera requires mirror for access, or hookshot and hammer. It may also require a fire source, but not in all cases.
            2: [["or", ["mirror", -1], ["hookshot", -1]], ["or", ["mirror", -1], ["hammer", -1]], ["or", ["lantern", -1], ["firerod", -1]]],
            // PoD requires hammer and bow for completion. It may also require dark rooms which we assume the runner is capable of in minor glitches.
            3: [["hammer", -1], ["bow", 2], ["ng", ["lantern", -1]]],
            // Swamp always requires hammer, hookshot, flippers and mirror for completion.
            4: [["hammer", -1], ["mirror", -1], ["flippers", -1], ["hookshot", -1]],
            // SW requires a sword to cut the curtains and a fire rod to enter the boss part of the dungeon. We also require a fire source of any sort, but since we have
            // fire rod, lantern is not included. For access, besides the already always required - for full game completion - hammer, we require power gloves or hookshot to access the dungeon.
            // This will never be displayed as hookshot and mitts is always required by both logics of this indicator.
            // Including all the cases separately here would honestly be a waste - at the end of the day, gomode includes all dungeons, not just one
            // and therefore it wouldn't be logical to display aghanim in the list at any point.
            5: [["sword", 1], ["firerod", -1], ["or", ["glove", 1], ["hookshot", -1]]],
            // TT requires a hookshot or power gloves (with hammer or as mitts) to access much like SW.
            6: [["or", ["glove", 1], ["hookshot", -1]]],
            // IP requires flippers to access, but we assume the runner knows how to do fake flippers. Besides this, we need mitts to enter the dark world,
            // hammer to access the boss room and an fire weapon to destroy ice.
            7: [["hammer", -1], ["glove", 2], ["or", ["firerod", -1], ["bombos", -1]], ["ng", ["flippers", -1]], ["ng", ["or", ["somaria", -1], ["hookshot", -1]]]],
            // MM requires mitts and flute to enter, a sword to use a medallion, the cane of somaria to open the door in the first dark room, and boots or hookshot to cross
            // the first gap.
            8: [["glove", 2], ["flute", -1], ["sword", 1], ["somaria", -1], ["or", ["boots", -1], ["hookshot", -1]], ["ng", ["lantern", -1]]],
            // TR requires hammer and mitts to enter, a sword to use the medallion, the cane of somaria to traverse, and the fire and ice rods to beat the boss.
            9: [["hammer", -1], ["glove", 2], ["somaria", -1], ["firerod", -1], ["icerod", -1], ["sword", 1], ["ng", ["lantern", -1]]]
        };

        // Lists to keep track of gomode items.
        window.gomode_list_mt = [];
        window.gomode_list_ors = [];

        // Remove no glitches items from the lists if minor glitches, otherwise burn them into the lists.
        window.filter_gomode_mode = function() {
            var mg = (gomode_mode === "mg");
            for (var j = 0; j < default_gomode_list.length; j++) {
                if (default_gomode_list[j][0] === "ng") {
                    if (mg) {
                        arr_remove(default_gomode_list, default_gomode_list[j]);
                        j--;
                    } else {
                        default_gomode_list[j] = default_gomode_list[j][1];
                    }
                } else if (default_gomode_list[j][0] === "mg") {
                    if (!mg) {
                        arr_remove(default_gomode_list, default_gomode_list[j]);
                        j--;
                    } else {
                        default_gomode_list[j] = default_gomode_list[j][1];
                    }
                }
            }
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j < boss_lists[i].length; j++) {
                    if (boss_lists[i][j][0] === "ng") {
                        if (mg) {
                            arr_remove(boss_lists[i], boss_lists[i][j]);
                            j--;
                        } else {
                            boss_lists[i][j] = boss_lists[i][j][1];
                        }
                    } else if (boss_lists[i][j][0] === "mg") {
                        if (!mg) {
                            arr_remove(boss_lists[i], boss_lists[i][j]);
                            j--;
                        } else {
                            boss_lists[i][j] = boss_lists[i][j][1];
                        }
                    }
                }
            }
        }

        // Monster function to keep track of the items displayed in the list of items to acquire prior to entering go mode.
        window.update_gomode_list = function() {
            // Reset the list of gomode items.
            gomode_list_mt = [];
            gomode_list_ors = [];
            // Add the items always required for gomode.
            for (var i = 0; i < default_gomode_list.length; i++) {
                var d = default_gomode_list[i]
                if (d[0] == "or") {
                    var has = false
                    for (var k = 1; k < d.length; k++) {
                        var e = d[k];
                        if ((e[1] < 0 && items[e[0]]) || (e[1] > 0 && items[e[0]] >= e[1])) {
                            has = true;
                            break;
                        }
                    }
                    if (!has) {
                        gomode_list_ors.push(d);
                    }
                } else {
                    if ((d[1] < 0 && !items[d[0]]) || (d[1] > 0 && items[d[0]] < d[1])) {
                        gomode_list_mt.push(d);
                    }
                }
            }
            var mo = -1
            // Check each dungeon, if the dungeon is a crystal dungeon, add its (bare minimum) required items to the list
            for (var i = 0; i < 10; i++) {
                if (prizes[i] >= 3) {
                    // If this is a medallion dungeon, add the relevant medallion to the list. If we have an unknown medallion on a crystal dungeon, and we don't have
                    // all 3 medallions, add the ? medallion to the list.
                    if (i - 8 >= 0) {
                        var mid = i-8;
                        // We use mo to store MM's medallions, so it doesn't show up twice if TR is the same medallion.
                        if (mo != medallions[mid]) {
                            var t_med = t_medallions[medallions[mid]];
                            // Check: if the medallion is known and we don't have it OR if the medallion is unknown and we don't have all three.
                            if ((!items[t_med] && medallions[mid] !== 0) || (medallions[mid] === 0 && (!items[t_medallions[1]] || !items[t_medallions[2]] || !items[t_medallions[3]])) ) {
                                gomode_list_mt.push([t_med, -1]);
                            }
                            mo = medallions[mid];
                        }
                    }
                    // I called dungeon lists boss lists for some reason (possibly because the bosses are displayed on the tracker).
                    var boss_list = boss_lists[i];
                    for (var j = 0; j < boss_list.length; j++) {
                        var boss_entry = boss_list[j];
                        // Or entries signify that we need one of several items.
                        // We sort these into a separate lists. The reason that we do this is to be able to check it against the complete list of required items.
                        // We do not display any or clauses from which at least one of the items is already required.
                        if (boss_entry[0] == "or") {
                            var has = false;
                            for (var k = 1; k < boss_entry.length; k++) {
                                var d = boss_entry[k];
                                if ((d[1] < 0 && items[d[0]]) || (d[1] > 0 && items[d[0]] >= d[1])) {
                                    has = true;
                                    break;
                                }
                            }
                            if (!has) {
                                gomode_list_ors.push(boss_entry);
                            }
                        } else {
                            // Simple check: if an item is required and we don't have it, or if a progressive item is required and we don't have the appropriate level of it,
                            // then we display it in the gomode list.
                            if ((boss_entry[1] < 0 && !items[boss_entry[0]]) || (boss_entry[1] > 0 && items[boss_entry[0]] < boss_entry[1])) {
                                var found = false;
                                // Here we check the existing list to avoid duplicates. We also upgrade the level on a duplicate progressive entry if we require a higher level
                                // than which we already require.
                                for (var k = 0; k < gomode_list_mt.length; k++) {
                                    if (gomode_list_mt[k][0] == boss_entry[0]) {
                                        if (boss_entry[1] > gomode_list_mt[k][1]) {
                                            gomode_list_mt[k][1] = boss_entry[1];
                                        }
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    gomode_list_mt.push(boss_entry);
                                }
                            }
                        }
                    }
                }
            }
            // This loop sorts out the OR entries that we don't need to display.
            // We don't display OR entries when at least one of the items in the OR entry is already required.
            for (var j = 0; gomode_list_ors.length > 0 && j < gomode_list_ors.length; j++) {
                if (j < 0) {
                    continue;
                }
                var or_entry = gomode_list_ors[j];
                var check_failed = false;
                // Filter out identical OR entries. We only care about or entries of the same size for sanity's sake.
                for (var k = 0; k < j; k++) {
                    var or_entry_2 = gomode_list_ors[k];
                    if (or_entry.length != or_entry_2.length) {
                        continue;
                    }
                    var has_count = 0;
                    for (var l = 1; l < or_entry.length; l++) {
                        for (var m = 1; m < or_entry_2.length; m++) {
                            if (or_entry[l][0] === or_entry_2[m][0]) {
                                if (or_entry[l][1] == or_entry_2[m][1]) {
                                    has_count++;
                                    break;
                                }
                            }
                        }
                    }
                    if (has_count == or_entry.length - 1) {
                        arr_remove(gomode_list_ors, or_entry);
                        j--;
                        check_failed = true;
                        break;
                    }
                }
                if (check_failed) {
                    continue;
                }
                for (var k = 1; k < or_entry.length; k++) {
                    for (var l = 0; l < gomode_list_mt.length; l++) {
                        var list_entry = gomode_list_mt[l];
                        // Check: entry item in the list is same as in the or, and required with at least the same level for a progressive item or simply required for a non-progressive item.
                        if (list_entry[0] === or_entry[k][0] && ((list_entry[1] > 0 && list_entry[1] >= or_entry[k][1]) || (list_entry[1] < 0))) {
                            // Remove the or entry from the list of ors.
                            arr_remove(gomode_list_ors, or_entry);
                            j--;

                        }
                    }
                }
            }

            // The remaining or entries should be ones where neither of the items in the or entry are explicitly required.
            // Add these ors to the main list.
            for (var j = 0; j < gomode_list_ors.length; j++) {
                var or_entry = gomode_list_ors[j];
                gomode_list_mt.push(or_entry);
            }

            // Assign HTML ids to the entries in the gomode item list. IDs is a list of IDs, ID assignment maps the IDs to the actual list entries which we will require for the display.
            var ids = [];
            var id_assignment = {};

            // Create the HTML elements.
            var gomode_container = document.getElementById('gomode').getElementsByTagName("div")[0];

            // Calculated by hand. 7 items fits onto the mapless screen, 21 items fit on the screen with the map.
            var gomode_width = map_enabled ? 21 : 7;

            // We display up to the amount of items that neatly fit into the window. In mapless mode, this may mean that certain items won't be visible in the gomode list
            // until early ones are fulfilled. I think this is fine as a simple display of "you need at least these items before you can be in gomode".
            for (var i = 0; i < (gomode_list_mt.length < gomode_width ? gomode_list_mt.length : gomode_width); i++) {
                // For simple item requirements, the element ID is "gomode-[item]"
                var tid = gomode_list_mt[i][0];
                // For ors, the element ID will be "gomode-[item1]-[item2]-[item3]..."
                if (tid === "or") {
                    tid = gomode_list_mt[i][1][0];
                    for (var j = 2; j < gomode_list_mt[i].length; j++) {
                        tid += "-"+gomode_list_mt[i][j][0];
                    }
                }
                var eid = "gomode-"+tid;
                ids.push(eid);
                id_assignment[eid] = gomode_list_mt[i];
            }
            var c = gomode_container.getElementsByTagName("div");
            for (var i = 0; i < c.length; i++) {
                var node = c[i];
                if (!(node.id in ids)) {
                    node.remove();
                    i--;
                } else {
                    arr_remove(ids, node.id);
                }
            }

            // Here we construct the HTML elements.
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var el = document.createElement("div");
                el.setAttribute("id", id);
                gomode_container.appendChild(el);
                var a = id_assignment[id];
                // For ors, we divide a cell into 4 subcells. We currently don't use a 3-item or a 4-item or, probably never will, but the opportunity is there if needed.
                // For the two-item ors, an item is neatly displayed in the top left and the bottom right.
                if (a[0] === "or") {
                    el.setAttribute("class", "cell item");

                    var r1 = document.createElement("div");
                    r1.setAttribute("class", "row");
                    el.appendChild(r1);

                    var r2 = document.createElement("div");
                    r2.setAttribute("class", "row");
                    el.appendChild(r2);

                    var c1 = document.createElement("div");
                    c1.setAttribute("class", "cell combination");
                    r1.appendChild(c1);

                    var c2 = document.createElement("div");
                    c2.setAttribute("class", "cell combination");
                    r1.appendChild(c2);

                    var c3 = document.createElement("div");
                    c3.setAttribute("class", "cell combination");
                    r2.appendChild(c3);

                    var c4 = document.createElement("div");
                    c4.setAttribute("class", "cell combination");
                    r2.appendChild(c4);

                    var cn = a.length - 1;
                    if (cn > 4) {
                        cn = 4;
                    }
                    var cs = [];
                    switch (cn) {
                        case 1:
                            cs = [c1];
                            break;
                        case 2:
                            cs = [c1, c4];
                            break;
                        case 3:
                            cs = [c1, c2, c3];
                            break;
                        case 4:
                            cs = [c1, c2, c3, c4];
                            break;
                    }
                    for (var l = 1; l < a.length; l++) {
                        var act = a[l];
                        if (act[1] < 0) {
                            cs[l-1].setAttribute("class", "cell item combination " + act[0]);
                        } else {
                            cs[l-1].setAttribute("class", "cell item combination " + act[0] + " active-" + act[1]);
                        }
                    }
                } else {
                    if (a[1] < 0) {
                        el.setAttribute("class", "cell item " + a[0]);
                    } else {
                        el.setAttribute("class", "cell item " + a[0] + " active-" + a[1]);
                    }
                }
            }

            // Add the go mode text.
            var gomode_text = document.getElementById('gomode').getElementsByTagName("span")[0]
            if (gomode_list_mt.length > 0) {
                gomode_text.textContent = "Go mode not ready";
                gomode_text.setAttribute("class", "caption");
            } else {
                gomode_text.textContent = "Go!";
                gomode_text.setAttribute("class", "caption go");
            }

        }
    }

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
        // Highlights a chest location and shows the caption
        window.highlight = function(x) {
            document.getElementById('chestMap'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(chests[x].caption);
        };
        window.unhighlight = function(x) {
            document.getElementById('chestMap'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
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
        window.highlight_agahnim = function() {
            document.getElementById('castle').classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(agahnim.caption);
        };
        window.unhighlight_agahnim = function() {
            document.getElementById('castle').classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
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
            document.getElementById('app').classList.add('mapless');
            document.getElementById('map').style.display = 'none';
        }

        if (gomode_indicator) {
            filter_gomode_mode();
            update_gomode_list();
        } else {
            document.getElementById('gomode').style.display = 'none';
        }
    };
}(window));
