
Monitor.Map = Monitor.Class({
	div:null,
	viewportDiv: null,
	layers: null,
	controls: null,
	options: null,
	init: function(div, options) {
		this.options = Monitor.Util.extend(this.options, options);
		this.layers = [];
		this.controls = [];
		this.div = document.getElementById(div);
		this.viewportDiv = Monitor.Element.create("div", {
			style: {
				border:"solid 1px red",
				width:"100%",
				height:"100%",
				position:"relative"
			}
		});
		this.div.appendChild(this.viewportDiv);
		this.events = new Monitor.Events(this, this.viewportDiv, {
			includeXY: true
		});
	},
	
	addLayer: function(layer) {
		layer.setMap(this);
		this.layers.push(layer);
	},
	
	removeLayer: function(layer) {
		for(var i = 0; i < this.layers.length; i++) {
			if(this.layer[i] == layer) {
				layer.removeMap(this);
				this.layers.splice(i, 1);
				break;
			}
		}
	},
	
	addControl: function(control) {
		control.setMap(this);
		this.controls.push(control);
	},
	
	ClASS_NAME: "Monitor.Map"
});