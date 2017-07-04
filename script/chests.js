function steve(){
    if(!items.moonpearl)
	return false;
    if(items.glove==2 || (items.glove && items.hammer))
	return true;
    return items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers);
}

// define dungeon chests
var dungeons = new Array;

dungeons[0] = {
    name: "Eastern Palace",
    x: "46.8%",
    y: "38.8%",
    image: "boss02.png",
    isBeaten: false,
    isBeatable: function(){
		if(items.bow>1)
			return "available";
		else
			return "unavailable";
    },
    canGetChest: function(){
		if(items.chest0>1 || items.bow>1)
			return "available";
		return "possible";
    }
};

dungeons[1] = {
    name: "Desert Palace",
    x: "3.8%",
    y: "78.4%",
    image: "boss12.png",
    isBeaten: false,
    isBeatable: function(){
		if(!items.glove)
			return "unavailable";
		if(!items.book && !(items.flute && items.glove==2 && items.mirror))
			return "unavailable";
		if(!items.lantern && !items.firerod)
			return "unavailable";
		if(!items.boots)
			return "possible";
		return "available";
    },
    canGetChest: function(){
		if(!items.book && !(items.flute && items.glove==2 && items.mirror))
			return "unavailable";
		if(items.boots && (items.firerod || items.lantern) && items.glove)
			return "available";
		if(items.chest1>1 && items.boots)
			return "available"
		return "possible";
    }
};

dungeons[2] = {
    name: "Tower of Hera",
    x: "31.0%",
    y: "5.5%",
    image: "boss22.png",
    isBeaten: false,
    isBeatable: function(){
		if(!items.flute && !items.glove)
			return "unavailable";
		if(!items.mirror && !(items.hookshot && items.hammer))
			return "unavailable";
		if(items.firerod || items.lantern)
			return "available";
		return "possible";
    },
    canGetChest: function(){
		return this.isBeatable();
    }
};

dungeons[3] = {
    name: "Palace of Darkness <img src='images/lantern.png' class='mini'>",
    x: "97.0%",
    y: "40.0%",
    image: "boss32.png",
    isBeaten: false,
    isBeatable: function(){
		if(!items.moonpearl || !(items.bow>1) || !items.hammer)
			return "unavailable";
		if(!items.agahnim && !items.glove)
			return "unavailable";
		return "available";
    },
    canGetChest: function(){
		if(!items.moonpearl)
			return "unavailable";
		if(!items.agahnim && !(items.hammer&&items.glove) && !(items.glove==2 && items.flippers))
			return "unavailable";
		if(items.bow>1 && (items.chest3>1 || items.hammer))
			return "available";
		return "possible";
    }
};

dungeons[4] = {
    name: "Swamp Palace <img src='images/mirror.png' class='mini'>",
    x: "73.5%",
    y: "91.0%",
    image: "boss42.png",
    isBeaten: false,
    isBeatable: function(){
		if(!items.moonpearl || !items.mirror || !items.flippers)
			return "unavailable";
		if(!items.hammer || !items.hookshot)
			return "unavailable";
		if(!items.glove && !items.agahnim)
			return "unavailable";
		return "available";
	},
    canGetChest: function(){
		if(!items.moonpearl || !items.mirror || !items.flippers)
			return "unavailable";
		if(!steve() && !(items.agahnim && items.hammer))
			return "unavailable";

		// Here we go...
		if(items.chest4<=2)
			if(items.hookshot && items.hammer)
				return "available";
			else
				return "unavailable";
		if(items.chest4<=4){
			if(!items.hammer)
				return "unavailable";
			if(items.hookshot)
				return "available";
			return "possible";
		}
		if(items.chest4==5)
			if(items.hammer)
				return "available";
			else
				return "unavailable";
		if(items.hammer)
			return "available";
		return "possible";
    }
};

dungeons[5] = {
    name: "Skull Woods",
    x: "53.3%",
    y: "5.4%",
    image: "boss52.png",
    isBeaten: false,
    isBeatable: function(){
		if(!steve() || !items.firerod)
			return "unavailable";
		return "available";
    },
    canGetChest: function(){
		if(!steve())
			return "unavailable";
		if(items.firerod)
			return "available";
		return "possible";
    }
};

dungeons[6] = {
    name: "Thieves' Town",
    x: "56.4%",
    y: "47.9%",
    image: "boss62.png",
    isBeaten: false,
    isBeatable: function(){
		if(steve())
			return "available";
		return "unavailable";
    },
    canGetChest: function(){
		if(!steve())
			return "unavailable";
		if(items.chest6==1 && !items.hammer)
			return "possible";
		return "available";
    }
};

dungeons[7] = {
    name: "Ice Palace (yellow=must bomb jump)",
    x: "89.8%",
    y: "85.8%",
    image: "boss72.png",
    isBeaten: false,
    isBeatable: function(){
		if(!items.moonpearl || !items.flippers || items.glove!=2 || !items.hammer)
			return "unavailable";
		if(!items.firerod && !items.bombos)
			return "unavailable";
		if(items.hookshot || items.somaria)
			return "available";
		return "possible";
    },
    canGetChest: function(){
		if(!items.moonpearl || !items.flippers || items.glove!=2)
			return "unavailable";
		if(!items.firerod && !items.bombos)
			return "unavailable";
		if(items.hammer)
			return "available";
		return "possible";
    }
};

dungeons[8] = {
    name: "Misery Mire <img src='images/medallion0.png' class='mini'><img src='images/lantern.png' class='mini'>",
    x: "55.8%",
    y: "82.9%",
    image: "boss82.png",
    isBeaten: false,
    isBeatable: function(){
		if(!items.moonpearl || !items.flute || items.glove!=2 || !items.somaria)
			return "unavailable";
		if(!items.boots && !items.hookshot)
			return "unavailable";
		// Medallion Check
		if(!items.bombos && !items.ether && !items.quake)
			return "unavailable";
		if((medallions[0]==1 && !items.bombos) || (medallions[0]==2 && !items.ether) || (medallions[0]==3 && !items.quake))
			return "unavailable";
		if(medallions[0]==0 && !(items.bombos && items.ether && items.quake))
			return "possible";

		if(items.lantern || items.firerod)
			return "available";
		return "possible";
    },
    canGetChest: function(){
		if(!items.moonpearl || !items.flute || items.glove!=2)
			return "unavailable";
		if(!items.boots && !items.hookshot)
			return "unavailable";
		// Medallion Check
		if(!items.bombos && !items.ether && !items.quake)
			return "unavailable";
		if((medallions[0]==1 && !items.bombos) || (medallions[0]==2 && !items.ether) || (medallions[0]==3 && !items.quake))
			return "unavailable";
		if(medallions[0]==0 && !(items.bombos && items.ether && items.quake))
			return "possible";
		
		if(!items.lantern && !items.firerod)
			return "possible";
		if(items.chest8>1 || items.somaria)
			return "available";
		return "possible";
    }
};

dungeons[9] = {
    name: "Turtle Rock <img src='images/medallion0.png' class='mini'><img src='images/lantern.png' class='mini'>",
    x: "96.9%",
    y: "7.0%",
    image: "boss92.png",
    isBeaten: false,
    isBeatable: function(){
		if(!items.moonpearl || !items.hammer || items.glove!=2 || !items.somaria)
			return "unavailable";
		if(!items.hookshot && !items.mirror)
			return "unavailable";
		if(!items.icerod || !items.firerod)
			return "unavailable";
		// Medallion Check
		if(!items.bombos && !items.ether && !items.quake)
			return "unavailable";
		if((medallions[1]==1 && !items.bombos) || (medallions[1]==2 && !items.ether) || (medallions[1]==3 && !items.quake))
			return "unavailable";
		if(medallions[1]==0 && !(items.bombos && items.ether && items.quake))
			return "possible";

		return "available";
    },
    canGetChest: function(){
		if(!items.moonpearl || !items.hammer || items.glove!=2 || !items.somaria)
			return "unavailable";
		if(!items.hookshot && !items.mirror)
			return "unavailable";
		// Medallion Check
		if(!items.bombos && !items.ether && !items.quake)
			return "unavailable";
		if((medallions[1]==1 && !items.bombos) || (medallions[1]==2 && !items.ether) || (medallions[1]==3 && !items.quake))
			return "unavailable";
		if(medallions[1]==0 && !(items.bombos && items.ether && items.quake))
			return "possible";

		if(!items.firerod)
			return "possible";
		if(items.chest9>1 || items.icerod)
			return "available";
		return "possible";
    }
};

//define overworld chests
var chests = new Array;

chests[0] = {
    name: "King's Tomb <img src='images/boots.png' class='mini'> + <img src='images/glove2.png' class='mini'>/<img src='images/mirror.png' class='mini'>",
    x: "30.8%",
    y: "29.6%",
    isOpened: false,
    isAvailable: function(){
		if(!items["boots"])
			return "unavailable";
		if ( (steve() && items["mirror"]) || items["glove"]==2 )
			return "available";
		return "unavailable";
    }
};

chests[1] = {
    name: "Light World Swamp (2)",
    x: "23.4%",
    y: "93.4%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[2] = {
    name: "Stoops Lonk's Hoose",
    x: "27.4%",
    y: "67.9%",
    isOpened: true,
    isAvailable: function(){
	return "available";
    }
};

chests[3] = {
    name: "Spiral Cave",
    x: "39.9%",
    y: "9.3%",
    isOpened: false,
    isAvailable: function(){
	if ( (items["glove"] || items["flute"]) && (items["hookshot"] || (items["mirror"]&&items["hammer"])))
		return "available";
	return "unavailable";
    }
};

chests[4] = {
    name: "Mimic Cave (<img src='images/mirror.png' class='mini'> outside of Turtle Rock)(Yellow = <img src='images/medallion0.png' class='mini'> unkown OR possible w/out <img src='images/firerod.png' class='mini'>)",
    x: "42.6%",
    y: "9.3%",
    isOpened: false,
    isAvailable: function(){
		if(!items.moonpearl || !items.hammer || items.glove!=2 || !items.somaria || !items.mirror)
			return "unavailable";
		// Medallion Check
		if(!items.bombos && !items.ether && !items.quake)
			return "unavailable";
		if((medallions[1]==1 && !items.bombos) || (medallions[1]==2 && !items.ether) || (medallions[1]==3 && !items.quake))
			return "unavailable";
		if(medallions[1]==0 && !(items.bombos && items.ether && items.quake))
			return "possible";

		if(items.firerod)
			return "available";
		return "possible";
    }
};

chests[5] = {
    name: "Tavern",
    x: "8.1%",
    y: "57.8%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[6] = {
    name: "Chicken House <img src='images/bomb.png' class='mini'>",
    x: "4.4%",
    y: "54.2%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[7] = {
    name: "Bombable Hut <img src='images/bomb.png' class='mini'>",
    x: "55.4%",
    y: "57.8%",
    isOpened: false,
    isAvailable: function(){
		if(steve())
			return "available";
		return "unavailable";
    }
};

chests[8] = {
    name: "C House",
    x: "60.8%",
    y: "47.9%",
    isOpened: false,
    isAvailable: function(){
		if(steve())
			return "available";
		return "unavailable";
    }
};

chests[9] = {
    name: "Aginah's Cave <img src='images/bomb.png' class='mini'>",
    x: "10.0%",
    y: "82.6%",
    isOpened: false,
    isAvailable: function(){
		return "available";
    }
};

chests[10] = {
    name: "West of Mire (2)",
    x: "51.7%",
    y: "79.5%",
    isOpened: false,
    isAvailable: function(){
		if( items["flute"] && items["moonpearl"] && items["glove"]==2 )
			return "available";
		return "unavailable";
    }
};

chests[11] = {
    name: "DW Death Mountain (2) : Don't need <img src='images/moonpearl.png' class='mini'>",
    x: "92.8%",
    y: "14.7%",
    isOpened: false,
    isAvailable: function(){
		if( items["glove"]==2 && (items["hookshot"] || (items["mirror"]&&items["hammer"])) )
			return "available";
		return "unavailable";
    }
};

chests[12] = {
    name: "Sahasrahla's Hut (3) <img src='images/bomb.png' class='mini'>/<img src='images/boots.png' class='mini'>",
    x: "40.7%",
    y: "41.4%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[13] = {
    name: "Byrna Spike Cave",
    x: "78.6%",
    y: "14.9%",
    isOpened: false,
    isAvailable: function(){
	if( items["moonpearl"] && items["glove"] && items["hammer"] )
		return "available";
	return "unavailable";
    }
};

chests[14] = {
    name: "Kakariko Well (4 + <img src='images/bomb.png' class='mini'>)",
    x: "1.7%",
    y: "41.0%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[15] = {
    name: "Thieve's Hut (4 + <img src='images/bomb.png' class='mini'>)",
    x: "6.4%",
    y: "41.0%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[16] = {
    name: "Hype Cave! <img src='images/bomb.png' class='mini'> (NPC + 4 <img src='images/bomb.png' class='mini'>)",
    x: "80.0%",
    y: "77.1%",
    isOpened: false,
    isAvailable: function(){
	if( steve() || (items.agahnim && items.moonpearl && items.hammer) )
		return "available";
	return "unavailable";
    }
};

chests[17] = {
    name: "Death Mountain East (5 + 2 <img src='images/bomb.png' class='mini'>)",
    x: "41.4%",
    y: "17.1%",
    isOpened: false,
    isAvailable: function(){
	if( (items["glove"] || items["flute"]) && (items["hookshot"] || (items["mirror"]&&items["hammer"])) )
		return "available";
	return "unavailable";
		
    }
};

chests[18] = {
    name: "West of Sanctuary <img src='images/boots.png' class='mini'>",
    x: "19.5%",
    y: "29.3%",
    isOpened: false,
    isAvailable: function(){
	if(items.boots)
			return "available";
		return "unavailable";

    }
};

chests[19] = {
    name: "Minimoldorm Cave (NPC + 4) <img src='images/bomb.png' class='mini'>",
    x: "32.6%",
    y: "93.4%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[20] = {
    name: "Ice Rod Cave <img src='images/bomb.png' class='mini'>",
    x: "44.7%",
    y: "76.9%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[21] = {
    name: "Cave Under Rock (bottom chest) <img src='images/hookshot.png' class='mini'>/<img src='images/boots.png' class='mini'>",
    x: "91.6%",
    y: "8.6%",
    isOpened: false,
    isAvailable: function(){
	if(items.moonpearl && items.glove==2 && (items.hookshot || (items.mirror&&items.hammer&&items.boots)))
					return "available";
		return "unavailable";
    }
};

chests[22] = {
    name: "Cave Under Rock (3 top chests) <img src='images/hookshot.png' class='mini'>",
    x: "91.6%",
    y: "3.4%",
    isOpened: false,
    isAvailable: function(){
	if( items.moonpearl && items.glove==2 && items.hookshot)
					return "available";
		return "unavailable";
    }
};

chests[23] = {
    name: "Treasure Chest Minigame: Pay 30 rupees",
    x: "52.1%",
    y: "46.4%",
    isOpened: false,
    isAvailable: function(){
	if(steve())
		return "available";
	return "unavailable";

    }
};

chests[24] = {
    name: "Bottle Vendor: Pay 100 rupees",
    x: "4.5%",
    y: "46.8%",
    isOpened: false,
    isAvailable: function(){
	return "available";
    }
};

chests[25] = {
    name: "Sahasrahla <img src='images/pendant0.png' class='mini'>",
    x: "40.7%",
    y: "46.7%",
    isOpened: false,
    isAvailable: function(){
		for(var k=0; k<10; k++)
			if(prizes[k]==1 && items["boss"+k]==2)
				return "available";
		return "unavailable";
    }
};

chests[26] = {
    name: "Ol' Stumpy",
    x: "65.5%",
    y: "68.6%",
    isOpened: false,
    isAvailable: function(){
	if( steve() || (items.agahnim && items.moonpearl && items.hammer) )
		return "available";
	return "unavailable";
    }
};

chests[27] = {
    name: "Dying Boy: Distract him with <img src='images/bottle.png' class='mini'> so that you can rob his family!",
    x: "7.8%",
    y: "52.1%",
    isOpened: false,
    isAvailable: function(){
	if(items.bottle)
		return "available";
	return "unavailable";
    }
};

chests[28] = {
    name: "Reunite the Hammer Brothers and show the Purple Chest to Gary",
    x: "65.2%",
    y: "52.2%",
    isOpened: false,
    isAvailable: function(){
	if(items.moonpearl && items.glove==2 && items.mirror)
		return "available";
	return "unavailable";
    }
};

chests[29] = {
    name: "Fugitive under the bridge <img src='images/flippers.png' class='mini'>",
    x: "35.4%",
    y: "69.7%",
    isOpened: false,
    isAvailable: function(){
	if(items.flippers)
		return "available";
	return "unavailable";
    }
};

chests[30] = {
    name: "Ether Tablet <img src='images/sword2.png' class='mini'><img src='images/book.png' class='mini'>",
    x: "21.0%",
    y: "3.0%",
    isOpened: false,
    isAvailable: function(){
	if( items.sword>=2 && items.book && (items.glove||items.flute) && (items.mirror || (items.hookshot&&items.hammer)) )
		return "available";
	return "unavailable";
    }
};

chests[31] = {
    name: "Bombos Tablet <img src='images/mirror.png' class='mini'><img src='images/sword2.png' class='mini'><img src='images/book.png' class='mini'>",
    x: "11.0%",
    y: "92.2%",
    isOpened: false,
    isAvailable: function(){
	if( (steve() || (items.agahnim && items.moonpearl && items.hammer)) && items.mirror && items.sword>=2 && items.book )
		return "available";
	return "unavailable";
    }
};

chests[32] = {
    name: "Catfish",
    x: "96.0%",
    y: "17.2%",
    isOpened: false,
    isAvailable: function(){
	if( items.moonpearl && items.glove && (items.agahnim || items.hammer || (items.glove==2 && items.flippers)) )
		return "available";
	return "unavailable";
    }
};

chests[33] = {
    name: "King Zora: Pay 500 rupees",
    x: "47.5%",
    y: "12.1%",
    isOpened: false,
    isAvailable: function(){
	if( items.flippers || items.glove )
		return "available";
	return "unavailable";
    }
};

chests[34] = {
    name: "Lost Old Man",
    x: "20.8%",
    y: "20.4%",
    isOpened: false,
    isAvailable: function(){
	if( items.glove || items.flute )
		return "available";
	return "unavailable";
    }
};

chests[35] = {
    name: "Witch: Give her <img src='images/mushroom.png' class='mini'>",
    x: "40.8%",
    y: "32.5%",
    isOpened: false,
    isAvailable: function(){
	if(items.mushroom)
		return "available";
	return "unavailable";
    }
};

chests[36] = {
    name: "Forest Hideout",
    x: "9.4%",
    y: "13.0%",
    isOpened: false,
    isAvailable: function(){
		return "available";
    }
};

chests[37] = {
    name: "Lumberjack Tree <img src='images/agahnim.png' class='mini'><img src='images/boots.png' class='mini'>",
    x: "15.1%",
    y: "7.6%",
    isOpened: false,
    isAvailable: function(){
	if( items.agahnim && items.boots )
		return "available";
	return "possible";
    }
};

chests[38] = {
    name: "Spectacle Rock Cave",
    x: "24.3%",
    y: "14.8%",
    isOpened: false,
    isAvailable: function(){
	if( items.glove || items.flute )
		return "available";
	return "unavailable";
    }
};

chests[39] = {
    name: "South of Grove <img src='images/mirror.png' class='mini'>",
    x: "14.1%",
    y: "84.1%",
    isOpened: false,
    isAvailable: function(){
	if( items.mirror && (steve() || (items.agahnim && items.moonpearl && items.hammer)) )
		return "available";
	return "unavailable";
    }
};

chests[40] = {
    name: "Graveyard Cliff Cave <img src='images/mirror.png' class='mini'>",
    x: "28.1%",
    y: "27.0%",
    isOpened: false,
    isAvailable: function(){
	if( steve() && items.mirror )
		return "available";
	return "unavailable";
    }
};

chests[41] = {
    name: "Checkerboard Cave <img src='images/mirror.png' class='mini'>",
    x: "8.8%",
    y: "77.3%",
    isOpened: false,
    isAvailable: function(){
	if( items.flute && items.glove==2 && items.mirror )
		return "available";
	return "unavailable";
    }
};

chests[42] = {
    name: "<img src='images/hammer.png' class='mini'><img src='images/hammer.png' class='mini'><img src='images/hammer.png' class='mini'><img src='images/hammer.png' class='mini'><img src='images/hammer.png' class='mini'><img src='images/hammer.png' class='mini'><img src='images/hammer.png' class='mini'><img src='images/hammer.png' class='mini'>!!!!!!!!",
    x: "65.8%",
    y: "60.1%",
    isOpened: false,
    isAvailable: function(){
	if( items.moonpearl && items.glove==2 && items.hammer )
		return "available";
	return "unavailable";
    }
};

chests[43] = {
    name: "Library <img src='images/boots.png' class='mini'>",
    x: "7.7%",
    y: "65.9%",
    isOpened: false,
    isAvailable: function(){
	if(items.boots)
		return "available";
	return "possible";
    }
};

chests[44] = {
    name: "Mushroom",
    x: "6.2%",
    y: "8.6%",
    isOpened: false,
    isAvailable: function(){
		return "available";
    }
};

chests[45] = {
    name: "Spectacle Rock <img src='images/mirror.png' class='mini'>",
    x: "25.4%",
    y: "8.5%",
    isOpened: false,
    isAvailable: function(){
	if(items.glove || items.flute)
		if(items.mirror)
			return "available";
		else
			return "possible";
	return "unavailable";
    }
};

chests[46] = {
    name: "Floating Island <img src='images/mirror.png' class='mini'>",
    x: "40.2%",
    y: "3.0%",
    isOpened: false,
    isAvailable: function(){
		if((items.glove || items.flute) && (items.hookshot || (items.hammer && items.mirror)) )
			if(items.mirror && items.moonpearl && items.glove==2)
				return "available";
			else
				return "possible";
		return "unavailable";
	}
};

chests[47] = {
    name: "Race Minigame <img src='images/bomb.png' class='mini'>/<img src='images/boots.png' class='mini'>",
    x: "1.8%",
    y: "69.8%",
    isOpened: false,
    isAvailable: function(){
		return "available";
    }
};

chests[48] = {
    name: "Desert West Ledge <img src='images/book.png' class='mini'>/<img src='images/mirror.png' class='mini'>",
    x: "1.5%",
    y: "91.0%",
    isOpened: false,
    isAvailable: function(){
	if( items.book || (items.flute && items.glove==2 && items.mirror) )
		return "available";
	return "possible";
    }
};

chests[49] = {
    name: "Lake Hylia Island <img src='images/mirror.png' class='mini'>",
    x: "36.1%",
    y: "82.9%",
    isOpened: false,
    isAvailable: function(){
		if(items.flippers)
			if( items.moonpearl && items.mirror && (items.agahnim || items.glove==2 || (items.glove&&items.hammer)) )
				return "available";
			else
				return "possible";
		return "unavailable";
	}
};

chests[50] = {
    name: "Bumper Cave <img src='images/cape.png' class='mini'>",
    x: "67.1%",
    y: "15.2%",
    isOpened: false,
    isAvailable: function(){
		if(steve())
			if(items.cape)
				return "available";
			else
				return "possible";
		return "unavailable";
    }
};

chests[51] = {
    name: "Pyramid",
    x: "79.0%",
    y: "43.5%",
    isOpened: false,
    isAvailable: function(){
	if( items.agahnim || (items.glove&&items.hammer&&items.moonpearl) || (items.glove==2&&items.moonpearl&&items.flippers) )
			return "available";
		return "unavailable";
    }
};

chests[52] = {
    name: "Alec Baldwin's Dig-a-Thon: Pay 80 rupees",
    x: "52.9%",
    y: "69.2%",
    isOpened: false,
    isAvailable: function(){
		if( steve() || (items.agahnim && items.moonpearl && items.hammer) )
			return "available";
		return "unavailable";
    }
};

chests[53] = {
    name: "Zora River Ledge <img src='images/flippers.png' class='mini'>",
    x: "47.5%",
    y: "17.3%",
    isOpened: false,
    isAvailable: function(){
		if(items.flippers)
			return "available";
		if(items.glove)
			return "possible";
		return "unavailable";
    }
};

chests[54] = {
    name: "Buried Itam <img src='images/shovel.png' class='mini'>",
    x: "14.4%",
    y: "66.2%",
    isOpened: false,
    isAvailable: function(){
		if(items.shovel)
			return "available";
		return "unavailable";
	}
};

chests[55] = {
    name: "Fall to Escape Sewer (3) <img src='images/glove.png' class='mini'> + <img src='images/bomb.png' class='mini'>/<img src='images/boots.png' class='mini'>",
    x: "26.8%",
    y: "32.4%",
    isOpened: false,
    isAvailable: function(){
		if(items.glove)
			return "available";
		return "unavailable";
    }
};

chests[56] = {
    name: "Castle Secret Entrance",
    x: "29.8%",
    y: "41.8%",
    isOpened: true,
    isAvailable: function(){
		return "available";
    }
};

chests[57] = {
    name: "Hyrule Castle (4 including Key)",
    x: "24.9%",
    y: "44.1%",
    isOpened: true,
    isAvailable: function(){
		return "available";
    }
};

chests[58] = {
    name: "Sanctuary",
    x: "23.0%",
    y: "28.0%",
    isOpened: true,
    isAvailable: function(){
		return "available";
    }
};

chests[59] = {
    name: "Mad Batter <img src='images/hammer.png' class='mini'>/<img src='images/mirror.png' class='mini'> + <img src='images/powder.png' class='mini'>",
    x: "16.0%",
    y: "58.0%",
    isOpened: false,
    isAvailable: function(){
		if(items.powder && (items.hammer || (items.glove==2 && items.mirror && items.moonpearl)))
			return "available";
		return "unavailable";
    }
};

chests[60] = {
    name: "Take the frog home <img src='images/mirror.png' class='mini'>",
    x: "15.2%",
    y: "51.8%",
    isOpened: false,
    isAvailable: function(){
		if(items.moonpearl && items.glove==2 && items.mirror)
			return "available";
		return "unavailable";
    }
};

chests[61] = {
    name: "Fat Fairy: Buy OJ bomb from Dark Link's House after <img src='images/crystal0.png' class='mini'>5 <img src='images/crystal0.png' class='mini'>6 (2 items)",
    x: "73.5%",
    y: "48.5%",
    isOpened: false,
    isAvailable: function(){
		//crystal check
		var crystalCount = 0;
		for(var k=0; k<10; k++)
			if(prizes[k]==4 && items["boss"+k]==2)
				crystalCount++;
		
		if(!items.moonpearl || crystalCount<2)
			return "unavailable";
		if(items.hammer && (items.agahnim || items.glove))
			return "available";
		if(items.agahnim && items.mirror && steve())
			return "available";
		return "unavailable";
    }
};


chests[62] = {
    name: "Master Sword Pedestal <img src='images/pendant0.png' class='mini'><img src='images/pendant1.png' class='mini'><img src='images/pendant2.png' class='mini'> (can check with <img src='images/book.png' class='mini'>)",
    x: "2.5%",
    y: "3.2%",
    isOpened: false,
    isAvailable: function(){
		var pendantCount = 0;
		for(var k=0; k<10; k++)
			if((prizes[k]==1 || prizes[k]==2) && items["boss"+k]==2)
				if(++pendantCount==3)
					return "available";
		return "unavailable";
    }
};

