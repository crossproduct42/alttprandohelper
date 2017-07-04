Browser-based Item Tracker for A Link to the Past
v 4.0
by crossproduct (twitch.tv/crossproduct)
2017/04/07
                                            ^
                                            |
                   /\    ¯¯¯||¯¯¯ |   |¯- |¯|¯|    /\
                  /__\     / |__  |   |  \|_|_|   /__\
                 /\  /\   /  |    |   |  /| | |  /\  /\
                /__\/__\ |__ |___ |___|_- | | | /__\/__\
                                            ^
                                            ^

------------------------------------------
(:::[========> INTRODUCTION <========]:::)
------------------------------------------

This tracker is designed for use with A Link to the Past randomizer streams.
It's browser-based, so it should work on most platforms!
Just open the tracker in your browser and do a Window Capture in OBS!

Feel free to open the HTML files in a text editor if you want to change the image sizes
or the background color. Soon, I'd like to have a config.exe to adjust such things.

In the future, I'd like to figure out how make the window borderless, and possibly
keep sheets saved on a server to be capture with CLR Browser. I may also implement
a way to customize your layout.

Start playing ALttP Randomizer today!

Web Version should always have the latest features:
	http://vt.alttp.run/

Desktop Client Version:
	https://dessyreqt.github.io/alttprandomizer/

Check out the BONUS folder for a full detailed map of all item locations!

--------------------------------------------
(:::[========> SPECIAL THANKS <========]:::)
--------------------------------------------

-[--- Randomizer Developers ---]-

	Karkat (mmxbass)
	Dessyreqt
	Veetorp

-[--- Support ---]-

	jet082
	WildAnaconda69
	Alucard2004
	uphier



----------------------------------------
(:::[========> CONTACT ME <========]:::)
----------------------------------------

Any questions or comments about the tracker?
Have any requests for new features or icon skins?
Is there a bug or a mistake in the chest availability logic?

These are the fastest ways to reach me...

TWITCH CHANNEL:
	twitch.tv/crossproduct

ALTTP DISCORD SERVER:
	https://discordapp.com/invite/3Bsfnwk



------------------------------------------
(:::[========> DISTRIBUTION <========]:::)
------------------------------------------

Feel free to share this tracker by posting a link to my Twitch channel:
	twitch.tv/crossproduct

Sharing the DropBox link doesn't really help me, and it won't always be the latest version.
DO NOT DISTRIBUTE THIS TRACKER ON YOUR WEBSITE! DIRECT PEOPLE TO MY TWITCH CHANNEL FOR DOWNLOAD!

If you would like to make modifications to the tracker and share it on your site, follow these guidelines:
    -	Ask permission. Let me know how and why you are altering and redistributing.
	- Direct Message me via Twitch or Discord (see contact info above)
    -	The changes must be significant!
	- GOOD CHANGES: layout customizability, non-browser platform, new features, etc
	- BAD CHANGES: minor logic fixes, icon customization
    -	You must credit me and provide a link to my Twitch channel.

***********************************************************************
***                                                                 ***
***    I have had multiple requests to share the code on GitHub.    ***
***    I am open to the idea, but I have no idea how to use GitHub. ***
***                                                                 ***
***********************************************************************



---------------------------------------------
(:::[========> VERSION HISTORY <========]:::)
---------------------------------------------

v4.0
    -	Tracker layout updated!
	- Silver Arrow (no Bow) is now trackable
	- Sword, Shield, Tunic, and Moon Pearl are combined to one mega square!
	- Pendant and Crystal squares replaced by boss icons
	- Each boss square has a sub-square to remember prizes
	- Vitreous and Trinexx also have a medallion sub-square

    -	Three new locations added to Tracker Map!
	- Master Sword Pedestal
	- Dwarven Swordsmiths
	- Fat Fairy Fountain

    -	New Tracker Map features and updated dungeon logic!
	- Yellow squares for visible (but unobtainable) items (and unknown Mimic Cave availability)
	- Boss Icons on the map correspond to their pictures on the Item Tracker
	- Tracker Map now properly calculates obtainable dungeon chests
	- Misery Mire and Turtle Rock calculations now consider medallions

    -	Removed Horizontal layout. Later versions may contain better customization :-/

    -	Updated version of the large, detailed overworld map!

    -	Readme updated!


v3.1
    -	Christmas DLC is included in the ZIP file!
    -   Added 1 to each dungeon chest count, since boss drops are
	mixed in with dungeon chests.
    -	Dungeon chest logic for the location tracker may be a little
	off until I have time to review it, considering the boss drops.

v3.0
    -	Now has a map that helps new players find chests they may have missed!
    -	New launcher with multiple options!

v2.2
    -	Now includes tracker-h.html and launcher-h.html for a 24x2 layout.
	Horizontal tracker doesn't include Agahnim, though :(

v2.1
    -	Changed the opacity of disabled icons from 20% to 15%
    -	This version includes a launcher that opens a new browser window for the tracker.
	Internet Explorer works best because it will disable address bar and resizability.
	The launcher will close itself after 5 seconds,
	    which should give you enough time to override popup blocker.
	If it doesn't work, you can just open tracker.html normally.



--------------------------------------------------
(:::[========> TRACKER INSTRUCTIONS <========]:::)
--------------------------------------------------

Open launcher.html
Select which layout you'd like to use, and click the LAUNCH! button.
The launcher will close itself in 5 seconds, which should give you enough time to override popup blocker.
Launcher works best with Internet Explorer, which can disable window resize and title bar (enable scripts)
If launcher doesn't work, you can open tracker.html or tracker_map.html

-[--- Item Tracker ---]-

The left box is the Item Tracker. It shows you which items you have. Click to toggle!
The chests represent the "unique" chests of each dungeon.
Click the corresponding chest icon if you're in a dungeon and open a chest that IS NOT a Map,
	Compass, Key, or Big Key
The square with Link contains info for Tunic, Sword, AND Shield
Boss squares have sub-squares to remind you which prize a boss will give you:
	Click to toggle from Unkown, Green pendant, Red/Blue, Crystal, and Crystal 5/6
Vitreous and Trinexx have medallion subsquares, as well!
	The Location Tracker WILL consider these icons when it determines availability
	for Misery Mire, Turtle Rock, AND Mimic Cave
Click on the bosses and chests to "check off" locations for the dungeons. CLICKING THE MAP
	WILL NOT UPDATE DUNGEON LOCATIONS!

-[--- Location Tracker ---]-

The middle box is a map of the Light World, the right box is a map of the Dark World.
Mousing over a location square will give you a little bit of information.


Small squares are chests and Heart Piece locations strewn about the land of Hyrule!
    - Green areas are attainable with your current items (the logic assumes you have access to bombs)
    - Red areas are unreachable.
    - Yellow areas are unreachable, but you can see what item is there!
	- The "Mimic Cave" location is the exception. Yellow means the item is POSSIBLE,
		given the correct medallion requirement and key layout of Turtle Rock.
    - Gray areas have already been searched. (The chests between Link's house and Sanctuary
	    start off as Gray by default.)
    - Click a Red/Green/Yellow square to check it off and turn it Gray.
	- You may want to click a Red/Yellow square if you get it via Fake Flippers, or
		see the item and decide you do not want it.
    - Click a Gray square to revert it to Red/Green/Yellow (the tracker will recalculate whether it's reachable)

	*PRO TIP!!! The "Agahnim" icon is very important in the tracker's logic! Remember that you can
			kill Agahnim as long as you have Cape or L2 (or better) sword! Will killing him
			open up new item locations? Click on him to see!

Large squares are dungeons!
    - The inner square represents the Pendant/Crystal. Do you have the right items to beat the dungeon master?
    - The outer square represents the unique chests inside.
	The logic for dungeon chests takes into account how many chests are remaining for that
	particular place. For example: If you can reach Thieve's Town, then you are guaranteed
	at least 3 unique items. If there is only 1 chest left, it may be inaccessible without Hammer.
    - Red/Green/Gray squares follow the same convention as overworld locations.
    - If an outer square is Green, you are guaranteed AT LEAST ONE unique chest, not all of them.
    - Yellow squares may or may not be accessible, based on where keys are (and unknown medallion requirements)
	NOTE: The Ice Palace crystal is always reachable as long as you can get in (and have Fire Rod or Bombos).
		If the Ice Palace crystal is yellow, YOU MUST BOMB JUMP TO COMPLETE THE DUNGEON!
    - Clicking the dungeon squares on the map HAS NO EFFECT!
    - Clicking the corresponding chests on the Item Tracker will toggle the outer square.
    - Clicking the corresponding boss picture on the Item Tracker will toggle the inner square.



