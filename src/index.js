(function(window) {
    'use strict';

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function(callback, _this) {
            _this = _this || window;
            for (let i = 0; i < this.length; i++) {
                callback.call(_this, this[i], i, this);
            }
        };
    }

    function launch_tracker() {
        const params = {
            mode: this.getAttribute('data-mode'),
            hmap: this.getAttribute('data-map') === 'hmap',
            vmap: this.getAttribute('data-map') === 'vmap',
            ipbj: document.getElementById('ipbj').checked,
            podbj: document.getElementById('podbj').checked,
            sprite: document.getElementById('sprite').value,
            bg: document.getElementById('background-color').value ||
                document.getElementById('custom-color').value
        };
        const size = {
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
            params.mode === 'keysanity' && params.ipbj && 'ipbj',
            params.mode === 'keysanity' && params.podbj && 'podbj',
            params.sprite && 'sprite='+params.sprite,
            !['', 'black'].includes(params.bg) && 'bg='+encodeURIComponent(params.bg)
        ]).join('&');
    }

    function background_color_changed(event) {
        const value = event.target.value;
        const custom = document.getElementById('custom-color');
        const valid = valid_css_color(custom.value);
        custom.classList[value ? 'add' : 'remove']('hidden');
        custom.classList[valid ? 'remove' : 'add']('invalid');
    }

    function custom_color_changed(event) {
        const custom = event.target;
        const valid = valid_css_color(custom.value);
        custom.classList[valid ? 'remove' : 'add']('invalid');
    }

    function valid_css_color(text) {
        if (!text || text === 'inherit' || text === 'transparent') return false;
        const e1 = document.createElement('div');
        const e2 = document.createElement('div');
        e1.style.color = 'rgb(0,0,0)';
        e1.style.color = text;
        e2.style.color = 'rgb(255,255,255)';
        e2.style.color = text;
        return e1.style.color.replace(/ /g, '') !== 'rgb(0,0,0)' ||
            e2.style.color.replace(/ /g, '') !== 'rgb(255,255,255)';
    };

    window.start = function() {
        document.querySelectorAll('.launch').forEach(
            function(launch) { launch.addEventListener('click', launch_tracker); });

        const background_color = document.getElementById('background-color');
        const custom_color = document.getElementById('custom-color');
        background_color.value || custom_color.classList.remove('hidden');
        background_color.addEventListener('change', background_color_changed);
        custom_color.addEventListener('input', custom_color_changed);
    };
}(window));
