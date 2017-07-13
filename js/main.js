(function(window) {
    'use strict';

    //launches tracker.html in a popup window. MUST ME CALLED FROM "index.html" (or similarly structured page)!!
    window.launchTracker = function() {
        var mapEnabled = document.getElementById("option_mapEnabled").value;
        var mode = document.getElementById("option_mode").value;
        var windowSize;
        mapEnabled = mapEnabled == "true";

        if (mapEnabled){
            windowSize = "width=1344, height=448"
        } else {
            windowSize = "width=448, height=448"
        }

        window.open("tracker.html?map="+mapEnabled+"&mode="+mode, "", windowSize+", menubar=0 scrollbars=0, titlebar=0, resizable=0, toolbar=0");
        setTimeout("window.close()", 5000);
    };

    //a helper function that lets you access string variables from the URL.
    window.getQueryVariable = function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(null);
    };
}(window));
