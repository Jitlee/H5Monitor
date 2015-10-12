Monitor.Element = {
	create: function(type, attributes) {
		var element = document.createElement(type);
		if(attributes) {
			for(var attr in attributes) {
				element.setAttribute(attr, attributes[attr]);
			}
		}
		return element;
	},
	hasClass: function(element, name) {
        var names = element.className;
        return (!!names && new RegExp("(^|\\s)" + name + "(\\s|$)").test(names));
    },
    addClass: function(element, name) {
        if(!OpenLayers.Element.hasClass(element, name)) {
            element.className += (element.className ? " " : "") + name;
        }
        return element;
    },
    removeClass: function(element, name) {
        var names = element.className;
        if(names) {
            element.className = OpenLayers.String.trim(
                names.replace(
                    new RegExp("(^|\\s+)" + name + "(\\s+|$)"), " "
                )
            );
        }
        return element;
    },
    camelCase: function(str) {
    		return str.replace(/(\-[A-Za-z])/g, function(match) {
        		return match.toUpperCase().replace('-','');
    		});
    }
}
};
