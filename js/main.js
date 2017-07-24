(function(window) {
    'use strict';

    // launches tracker.html in a popup window. MUST ME CALLED FROM "index.html" (or similarly structured page)!!
    window.launch_tracker = function() {
        var mode = document.getElementById('option_mode').value;
        var map_enabled = document.getElementById('option_mapEnabled').value === 'true';
        var window_size = map_enabled ?
            'width=1340, height=448' :
            'width=448, height=448';

        open('tracker.html?map='+map_enabled+'&mode='+mode, '', window_size+', menubar=0 scrollbars=0, titlebar=0, resizable=0, toolbar=0');
        setTimeout('window.close()', 5000);
    };

    // a helper function that lets you access string variables from the URL.
    window.get_query_variable = function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] === variable)
                return pair[1];
        }

        return null;
    };
}(window));
