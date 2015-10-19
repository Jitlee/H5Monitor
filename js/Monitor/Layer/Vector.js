Monitor.Layer.Vector = Monitor.Class(Monitor.Layer, {
	options: null,
	renderer: null,
	map: null,
	features: null,
	init: function(name, options) {
		Monitor.Layer.prototype.init.apply(this, arguments);
		this.renderer = new Monitor.Renderer(this);
		this.features = [];
	},
	
	setMap: function(map) {
		Monitor.Layer.prototype.setMap.apply(this, arguments);
		this.renderer.updateSize();
	},
	
	addFeatures: function(features) {
		if(!Monitor.Util.isArray(features)) {
			features = [features];
		}
		var feature;
		for(var i = 0; i < features.length; i++) {
			feature = features[i];
			feature.layer = this;
			feature.draw();
			this.features.push(feature);
		}
	},
	
	removeFeatures: function(features) {
		var removeAll = false;
		if(!Monitor.Util.isArray(features)) {
			features = [features];
		} else if(!features) {
			features = this.features;
			removeAll = true;
		}
		var feature;
		for(var i = 0; i < features.length; i++) {
			feature = features[i];
			feature.layer = null;
			if(!removeAll) {
				Monitor.Array.remove(this.features, feature);
			}
		}
		
		if(removeAll) {
			this.features.length = 0;
		}
		this.redraw();
	},
	
	getFeatureFromXY: function(xy) {
		var num = this.features.length;
		while(num--) {
			if(this.features[num].geometry.isPointInRange(xy.x, xy.y)) {
				return this.features[num];
			}
		}
	},
	
	redraw: function() {
		this.renderer.erase();
		var len = this.features.length;
		for(var i = 0; i < len; i++) {
			this.features[i].draw();
		}
	},
	
	ClASS_NAME: "Monitor.Layer.Vector"
});