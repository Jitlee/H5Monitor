Monitor.Element = {
	create: function(type, attributes) {
		var element = document.createElement(type);
		if(attributes) {
			for(var attr in attributes) {
				if(attr.toLowerCase() == "style") {
					for(var css in attributes[attr]) {
						var value = attributes[attr][css];
						css = Monitor.String.camelize(css);
						element.style[css] = value;
					}
				} else {
					element.setAttribute(attr, attributes[attr]);
				}
			}
		}
		return element;
	},
	hasClass: function(element, name) {
        var names = element.className;
        return (!!names && new RegExp("(^|\\s)" + name + "(\\s|$)").test(names));
    },
    addClass: function(element, name) {
        if(!Monitor.Element.hasClass(element, name)) {
            element.className += (element.className ? " " : "") + name;
        }
        return element;
    },
    removeClass: function(element, name) {
        var names = element.className;
        if(names) {
            element.className = Monitor.String.trim(
                names.replace(
                    new RegExp("(^|\\s+)" + name + "(\\s+|$)"), " "
                )
            );
        }
        return element;
    },
    
    getStyle: function(element, style) {
        element = Monitor.Util.getElement(element);

        var value = null;
        if (element && element.style) {
            value = element.style[Monitor.String.camelize(style)];
            if (!value) {
                if (document.defaultView && 
                    document.defaultView.getComputedStyle) {
                    
                    var css = document.defaultView.getComputedStyle(element, null);
                    value = css ? css.getPropertyValue(style) : null;
                } else if (element.currentStyle) {
                    value = element.currentStyle[Monitor.String.camelize(style)];
                }
            }
        
            var positions = ['left', 'top', 'right', 'bottom'];
            if (window.opera &&
                (Monitor.Util.indexOf(positions,style) != -1) &&
                (Monitor.Element.getStyle(element, 'position') == 'static')) { 
                value = 'auto';
            }
        }
    
        return value == 'auto' ? null : value;
    }
};
