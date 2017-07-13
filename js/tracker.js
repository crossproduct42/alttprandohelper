(function(window) {
    'use strict';

    window.rowLength = 7;
    window.prizes = [];
    window.medallions = [0, 0];
    window.mode = getQueryVariable("mode");
    window.mapEnabled = getQueryVariable("map") === "true";

    // Event of clicking on the item tracker
    window.toggle = function(label) {
        if (label.substring(0,5) === "chest") {
            items[label] -= 1;
            if (items[label] < 0) {
                items[label] = itemsMax[label];
            }
            document.getElementById(label).style.backgroundImage = ("url(images/chest" + items[label] + ".png)");
            if (mapEnabled) {
                var x = label.substring(5);
                if(items[label] == 0) {
                    document.getElementById("dungeon"+x).className = "dungeon opened";
                } else {
                    document.getElementById("dungeon"+x).className = "dungeon " + dungeons[x].canGetChest();
                }
            }
            return;
        }
        if ((typeof items[label]) === "boolean") {
            items[label] = !items[label];
            document.getElementById(label).className = items[label];
        } else {
            if (++items[label] > itemsMax[label]) {
                items[label] = itemsMin[label];
                document.getElementById(label).style.backgroundImage = "url(images/" + label + ".png)";
                if (!items[label])
                    document.getElementById(label).className = "false";
            } else {
                document.getElementById(label).style.backgroundImage = "url(images/" + label + items[label] + ".png)";
                document.getElementById(label).className = "true";
            }
        }
        // Initiate bunny graphics!
        if (label === "moonpearl" || label === "tunic") {
            togglePearl();
        }

        if (mapEnabled) {
            for (var k = 0; k < chests.length; k++) {
                if (!chests[k].isOpened)
                    document.getElementById(k).className = "chest " + chests[k].isAvailable();
            }
            for (var k = 0; k < dungeons.length; k++) {
                if (!dungeons[k].isBeaten)
                    document.getElementById("bossMap"+k).className = "boss " + dungeons[k].isBeatable();
                if (items["chest"+k])
                    document.getElementById("dungeon"+k).className = "dungeon " + dungeons[k].canGetChest();
            }
            // Clicking a boss on the tracker will check it off on the map!
            if (label.substring(0,4) === "boss") {
                toggleBoss(label.substring(4));
            }
            if (label === "agahnim" || label === "cape" || label === "sword" || label === "lantern") {
                toggleAgahnim();
            }
        }
    };

    // BUNNY TIME!!!
    function togglePearl() {
        var link="url(images/tunic";
        if (items.tunic > 1)
            link += items.tunic;
        if (!items.moonpearl)
            link += "b";
        link += ".png)";

        document.getElementById("tunic").style.backgroundImage = link;
    }

    // event of clicking on a boss's pendant/crystal subsquare
    window.toggleDungeon = function(n) {
        prizes[n] += 1;
        if (prizes[n] === 5) prizes[n] = 0;

        document.getElementById("dungeonPrize"+n).style.backgroundImage = "url(images/dungeon"+prizes[n]+".png)";

        if (mapEnabled) {
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendantChests = [25, 61, 62];
            for (var k = 0; k < pendantChests.length; k++) {
                if (!chests[pendantChests[k]].isOpened)
                    document.getElementById(pendantChests[k]).className = "chest " + chests[pendantChests[k]].isAvailable();
            }
        }
    };

    // event of clicking on Mire/TRock's medallion subsquare
    window.toggleMedallion = function(n) {
        medallions[n] += 1;
        if (medallions[n] === 4) medallions[n] = 0;

        document.getElementById("medallion"+n).style.backgroundImage = "url(images/medallion"+medallions[n]+".png)";

        if (mapEnabled) {
            // Update availability of dungeon boss AND chests
            dungeons[8+n].isBeaten = !dungeons[8+n].isBeaten;
            toggleBoss(8+n);
            if (items["chest"+(8+n)] > 0)
                document.getElementById("dungeon"+(8+n)).className = "dungeon " + dungeons[8+n].canGetChest();
            // TRock medallion affects Mimic Cave
            if (n === 1) {
                chests[4].isOpened = !chests[4].isOpened;
                toggleChest(4);
            }
            // Change the mouseover text on the map
            var dungeonName = n === 0 ? "Misery Mire" : "Turtle Rock";
            dungeons[8+n].name = dungeonName + " <img src='images/medallion"+medallions[n]+".png' class='mini'><img src='images/lantern.png' class='mini'>";
        }
    };

    if (mapEnabled) {
        // Event of clicking a chest on the map
        window.toggleChest = function(x) {
            chests[x].isOpened = !chests[x].isOpened;
            document.getElementById(x).className = chests[x].isOpened ?
                "chest opened" :
                "chest " + chests[x].isAvailable();
        };
        // Event of clicking a dungeon location (not really)
        window.toggleBoss = function(x) {
            dungeons[x].isBeaten = !dungeons[x].isBeaten;
            document.getElementById("bossMap"+x).className = dungeons[x].isBeaten ?
                "boss opened" :
                "boss " + dungeons[x].isBeatable();
        };
        window.toggleAgahnim = function() {
            document.getElementById("castle").className = "castle " +
                (items.agahnim ? "opened" : agahnim.isAvailable());
        };
        // Highlights a chest location and shows the name as caption
        window.highlight = function(x) {
            document.getElementById(x).style.backgroundImage = "url(images/highlighted.png)";
            document.getElementById("caption").innerHTML = chests[x].name;
        };
        window.unhighlight = function(x) {
            document.getElementById(x).style.backgroundImage = "url(images/poi.png)";
            document.getElementById("caption").innerHTML = "&nbsp;";
        };
        // Highlights a chest location and shows the name as caption (but for dungeons)
        window.highlightDungeon = function(x) {
            document.getElementById("dungeon"+x).style.backgroundImage = "url(images/highlighted.png)";
            document.getElementById("caption").innerHTML = dungeons[x].name;
        };
        window.unhighlightDungeon = function(x) {
            document.getElementById("dungeon"+x).style.backgroundImage = "url(images/poi.png)";
            document.getElementById("caption").innerHTML = "&nbsp;";
        };
        window.highlightAgahnim = function() {
            document.getElementById("castle").style.backgroundImage = "url(images/highlighted.png)";
            document.getElementById("caption").innerHTML = agahnim.name;
        };
        window.unhighlightAgahnim = function() {
            document.getElementById("castle").style.backgroundImage = "url(images/poi.png)";
            document.getElementById("caption").innerHTML = "&nbsp;";
        };
    }
}(window));
