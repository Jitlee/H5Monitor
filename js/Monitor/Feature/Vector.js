Monitor.Feature.Vector = Monitor.Class(Monitor.Feature, {
	attributes: null,
	geometry: null,
	init: function(geometry, attributes) {
		Monitor.Feature.prototype.init.apply(this);
		this.geometry = geometry;
		this.attributes = attributes;
	},
	
	draw: function() {
		if(this.layer) {
			this.geometry.draw(this.layer.renderer);
		}
	},
	
	CLASS_NAME: "Monitor.Feature"
});