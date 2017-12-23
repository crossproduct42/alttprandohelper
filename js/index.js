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
                vmap: this.getAttribute('data-map') === 'vmap',
                sprite: document.getElementById('sprite').value,
                theme: document.getElementById('theme').value,
                bg: document.getElementById('background-color').value ||
                    document.getElementById('custom-color').value
            },
            size = {
                w: params.hmap ? 1340 : params.vmap ? 270 : 448,
                h: params.vmap ? 806 : 448
            };

        if (!valid_css_color(params.bg)) return;

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
            params.vmap && 'vmap',
            params.sprite && 'sprite='+params.sprite,
            params.theme && 'theme='+params.theme,
            !['', 'black'].includes(params.bg) && 'bg='+encodeURIComponent(params.bg)
        ]).join('&');
    }

    function background_color_changed(event) {
        var value = event.target.value,
            custom = document.getElementById('custom-color'),
            valid = valid_css_color(custom.value);
        custom.classList[value ? 'add' : 'remove']('hidden');
        custom.classList[valid ? 'remove' : 'add']('invalid');
    }

    function custom_color_changed(event) {
        var custom = event.target,
            valid = valid_css_color(custom.value);
        custom.classList[valid ? 'remove' : 'add']('invalid');
    }

    window.start = function() {
        document.querySelectorAll('.launch').forEach(
            function(launch) { launch.addEventListener('click', launch_tracker); });
        var background_color = document.getElementById('background-color'),
            custom_color = document.getElementById('custom-color');
        background_color.value || custom_color.classList.remove('hidden');
        background_color.addEventListener('change', background_color_changed);
        custom_color.addEventListener('input', custom_color_changed);
    };
}(window));
