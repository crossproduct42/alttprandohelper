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

    function launch_tracker() {
        var params = {
                mode: this.getAttribute('data-mode'),
                map: this.getAttribute('data-map') === 'yes'
            },
            width = params.map ? 1340 : 448;

        open('tracker.html?' + query(params),
            '',
            'width={width},height=448,titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
                .replace('{width}', width));
        setTimeout('window.close()', 5000);
    }

    function query(params) {
        return compact([
            'mode='+params.mode,
            params.map && 'map'
        ]).join('&');
    }

    window.start = function() {
        document.querySelectorAll('.launch').forEach(
            function(launch) { launch.addEventListener('click', launch_tracker); });
    };
}(window));
