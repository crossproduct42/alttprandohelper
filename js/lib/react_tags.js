(function(window) {
    'use strict';

    // based on:
    // https://github.com/mlmorg/react-hyperscript
    // https://github.com/ohanhi/hyperscript-helpers

    var slice = Array.prototype.slice,
        tag_parts = /[.#]?[\w:-]+/g;

    function tag(element, props, children) {
        props = props || {};
        children = slice.call(arguments, 2);

        if (is_child(props)) {
            children.unshift(props);
            props = {};
        }

        if (typeof element === 'string') {
            var result = parse(element);
            element = result.name;
            if (result.classes) {
                props.className && result.classes.push(props.className);
                props.className = result.classes.join(' ');
            }
            if (!props.id && result.id) props.id = result.id;
        }

        var args = [element, props].concat(children);
        return React.createElement.apply(React, args);
    }

    function is_child(x) {
        return typeof x === 'string' || Array.isArray(x) || React.isValidElement(x);
    }

    function parse(tag) {
        if (!tag) return { name: 'div' };

        var parts = tag.match(tag_parts),
            result = { name: null };

        var result = parts.reduce(function(r, part) {
            if (!part) return;

            if (/^\./.test(part)) {
                r.classes = r.classes || [];
                r.classes.push(part.replace(/^\./, ''));
            } else if (/^#/.test(part)) {
                r.id = part.replace(/^#/, '');
            } else if (!r.name) {
                r.name = part;
            }
            return r;
        }, result);

        result.name = result.name || 'div';
        return result;
    }

    function create_tag(name) {
        return function(first, rest) {
            rest = slice.call(arguments, 1);
            if (first == null) {
                return tag(name);
            } else {
                return tag.apply(null, (is_tag(first) ?
                        [name + first] :
                        [name, first])
                    .concat(rest));
            }
        };
    }

    function is_tag(x) {
        return typeof x === 'string' && /^[.#]/.test(x);
    }

    var tag_names = [
        'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside',
        'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink',
        'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite',
        'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd',
        'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em',
        'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form',
        'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
        'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins',
        'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing',
        'main', 'map', 'mark', 'marquee', 'math', 'menu', 'menuitem', 'meta',
        'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes',
        'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
        'picture', 'plaintext', 'pre', 'progress', 'q', 'rb', 'rbc', 'rp', 'rt',
        'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot',
        'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub',
        'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea',
        'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul',
        'var', 'video', 'wbr', 'xmp'
    ];

    var methods = {
        t: tag,
        create_tag: create_tag
    };
    
    tag_names.forEach(function(name) { methods[name] = create_tag(name); });
    
    Object.assign(window, methods);
}(window));
