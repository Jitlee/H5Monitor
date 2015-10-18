Monitor.Layer = Monitor.Class({
	id: null,
	name: null,
	div: null,
	options: null,
	map: null,
	events: null,
	init: function(name, options) {
		this.name = name;
		this.options = Monitor.Util.extend(this.options, options);
		this.div = Monitor.Element.create("div", {
			style: {
				position:"absolute",
				width:"100%",
				height:"100%"
			}
		});
	},
	
	setMap: function(map) {
		this.map = map;
		this.map.viewportDiv.appendChild(this.div);
	},
	
	removeMap: function(map) {
		this.map = null;
		this.map.viewportDiv.removeChild(this.div);
	},
	
	ClASS_NAME: "Monitor.Layer"
});