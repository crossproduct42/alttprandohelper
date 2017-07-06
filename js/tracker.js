var rowLength = 7;
var prizes = [];
var medallions = [0, 0];

// Event of clicking on the item tracker
function toggle(label){
    if(label.substring(0,5) == "chest"){
    if(--items[label] < 0)
        items[label] = itemsMax[label];
        document.getElementById(label).style.backgroundImage = ("url(images/chest" + items[label] + ".png)");
    x = label.substring(5);
    if(items[label] == 0)
        document.getElementById("dungeon"+x).className = "dungeon opened";
    else
        document.getElementById("dungeon"+x).className = "dungeon " + dungeons[x].canGetChest();
    return;
    }
    if((typeof items[label]) == "boolean"){
        document.getElementById(label).className = (items[label]=!items[label]);
    }
    else{
    if(++items[label] > itemsMax[label]){
        items[label] = itemsMin[label];
            document.getElementById(label).style.backgroundImage = ("url(images/" + label + ".png)");
        if(!items[label])
        document.getElementById(label).className = ("false");
    }
    else{
            document.getElementById(label).style.backgroundImage = ("url(images/" + label + items[label] + ".png)");
        document.getElementById(label).className = ("true");
    }
    }

    // Initiate bunny graphics!
        if(label=="moonpearl" || label=="tunic")
            togglePearl();

}

// BUNNY TIME!!!
function togglePearl(){
    var link="url(images/tunic";
    if(items.tunic>1)
        link += items.tunic;
    if(!items.moonpearl)
        link += "b";
    link += ".png)";

    document.getElementById("tunic").style.backgroundImage = link;
}

// event of clicking on a boss's pendant/crystal subsquare
function toggleDungeon(n){
    prizes[n]++;
    if(prizes[n] == 5)
        prizes[n] = 0;
    document.getElementById("dungeonPrize"+n).style.backgroundImage = "url(images/dungeon"+prizes[n]+".png)";
}

// event of clicking on Mire/TRock's medallion subsquare
function toggleMedallion(n){
    medallions[n]++;
    if(medallions[n] == 4)
        medallions[n] = 0;
    document.getElementById("medallion"+n).style.backgroundImage = "url(images/medallion"+medallions[n]+".png)";
}
