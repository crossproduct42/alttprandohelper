(function(window) {
    'use strict';

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function(callback, _this) {
            _this = _this || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(_this, this[i], i, this);
            }
        };
    }

    function get_radio_configuration(name) {
        var radios = document.getElementsByName(name)
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }

    }

    function launch_tracker() {
        var mode = get_radio_configuration('mode'),
            map = get_radio_configuration('map') === 'yes',
            gomode = get_radio_configuration('gomode'),
            width = map ? 1340 : 448,
            height = (gomode !== "no") ? 548 : 448;
        console.log(gomode)
        console.log(height)

        open('tracker.html?mode={mode}{map}&gomode={gomode}'
                .replace('{mode}', mode)
                .replace('{map}', map ? '&map' : '')
                .replace('{gomode}', gomode),
            '',
            'width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
                .replace('{width}', width)
                .replace('{height}', height));
        setTimeout('window.close()', 5000);
    }

    window.start = function() {
        document.querySelectorAll('.launch').forEach(
            function(launch) { launch.addEventListener('click', launch_tracker); });
    };
}(window));
