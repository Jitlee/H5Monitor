Monitor.Map = Monitor.Class({
	
	div: null,
	
	options: null,
	
	init: function(div, options) {
		this.options = Monitor.Util.extend({}, options);
		this.initTheme();
		
		this.div = document.getElementById(div);
		Monitor.Element.addClass(this.div, "mcMap");
		
		this.viewPortDiv = Monitor.Element.create("div", {
			style: "position:relative;width:100%;height:100%;visibility:hidden",
			className: "mcViewport"
		});
		this.div.appendChild(this.viewPortDiv);
	},
	
	initTheme:function() {
		this.theme = Monitor._getScriptLocation() + "theme/default/style.css";
		if(this.theme) {
	    // check existing links for equivalent url
	    var addNode = true;
	    var nodes = document.getElementsByTagName('link');
	    for(var i=0, len=nodes.length; i<len; ++i) {
	        if(Monitor.Util.isEquivalentUrl(nodes.item(i).href, this.theme)) {
	            addNode = false;
	            break;
	        }
	    }
	    // only add a new node if one with an equivalent url hasn't already
	    // been added
	    if(addNode) {
	        var cssNode = document.createElement('link');
	        cssNode.setAttribute('rel', 'stylesheet');
	        cssNode.setAttribute('type', 'text/css');
	        cssNode.setAttribute('href', this.theme);
	        document.getElementsByTagName('head')[0].appendChild(cssNode);
	    }
		}
	},
	
	CLASS_NAME: "Monitor.Map"
});
