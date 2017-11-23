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
        var mode = this.getAttribute('data-mode'),
            map = this.getAttribute('data-map') === 'yes',
			e = document.getElementById('bgColor'),
			bgColor = e.options[e.selectedIndex].value,
            width = map ? 1340 : 448;

		if(bgColor === 'custom')
			bgColor = document.getElementById('customColor').value;
			
        open('tracker.html?mode={mode}{map}{color}'
                .replace('{mode}', mode)
                .replace('{map}', map ? '&map' : '')
				.replace('{color}', '&bg=' + bgColor),
            '',
            'width={width},height=448,titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
                .replace('{width}', width));
        setTimeout('window.close()', 5000);
    }

    window.start = function() {
        document.querySelectorAll('.launch').forEach(
            function(launch) { launch.addEventListener('click', launch_tracker); });
    };
	
	window.toggleCustom = function() {
		var e = document.getElementById('bgColor'),
			bgColor = e.options[e.selectedIndex].value;

		document.getElementById('customColor').style.visibility = (bgColor !== 'custom') ? 'hidden' : 'visible';
	};
	
}(window));
