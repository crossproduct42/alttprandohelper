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
                hmap: this.getAttribute('data-map') === 'hmap',
                vmap: this.getAttribute('data-map') === 'vmap'
            },
            size = {
                w: params.hmap ? 1340 : 448,
                h: params.vmap ? 1340 : 448
            };

        open('tracker.html?' + query(params),
            '',
            'width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
                .replace('{width}', size.w)
                .replace('{height}', size.h));
        setTimeout('window.close()', 5000);
    }

    function query(params) {
        return compact([
            'mode='+params.mode,
            params.hmap && 'hmap',
            params.vmap && 'vmap'
        ]).join('&');
    }

    window.start = function() {
        document.querySelectorAll('.launch').forEach(
            function(launch) { launch.addEventListener('click', launch_tracker); });
    };
}(window));
