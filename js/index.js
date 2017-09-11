(function(window) {
    'use strict';

    function launch_tracker() {
        var mode = this.getAttribute('data-mode'),
            map = this.getAttribute('data-map') === 'yes',
            width = map ? 1340 : 448;

        open('tracker.html?mode={mode}{map}'
                .replace('{mode}', mode)
                .replace('{map}', map ? '&map' : ''),
            '',
            'width={width},height=448,titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
                .replace('{width}', width));
        setTimeout('window.close()', 5000);
    };

    window.start = function() {
        document.querySelectorAll('.launch').forEach(
            function(launch) { launch.addEventListener('click', launch_tracker); });
    };
}(window));
