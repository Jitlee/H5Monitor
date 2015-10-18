
Monitor.Control.ModifyFeature =  Monitor.Class(Monitor.Control, {
	layer: null,
	layers: null,
	selectedFeatures: null,
	locked: false,
	init: function(layers, options) {
		Monitor.	Control.prototype.init.apply(this, [options]);
		if(!Monitor.Util.isArray(layers)) {
			layers = [layers];
		}
		this.layers = layers;
		this.handler = new Monitor.Handler.Drag(this, {
			start: this.dragstart,
			move: this.dragmove,
			end: this.dragend
		});
		
		this.layer = new Monitor.Layer.Vector("编辑图层");
		this.selectedFeatures = [];
	},
	
	dragstart: function(xy) {
		if(this.locked) {
			return false;
		}
		
		var feature = this.layer.getFeatureFromXY(xy);
		if(!feature) {
			for(var i = this.map.layers.length - 1; !feature && i > -1; i--) {
				for(var j = 0; j < this.layers.length; j++) {
					if(this.map.layers[i] == this.layers[j]) {
						feature = this.layers[j].getFeatureFromXY(xy);
						if(feature) {
							break;
						}
					}
				}
			}
			// TODO: 实现多选
			this.unselectAll(feature);
			
			if(feature) {
				this.select(feature);
			}
		}
	},
	
	dragmove: function(xy) {
		this.locked = true;
		var offsetX = xy.x - this.handler.last.x;
		var offsetY = xy.y - this.handler.last.y;
		var features = this.selectedFeatures;
		var len = features.length;
		var __features__;
		var feature;
		var layers = [];
		for(var i = 0; i < len; i++) {
			feature = features[i];
			feature.geometry.move(offsetX, offsetY);
			__features__ = feature.__features__;
			
			if(!Monitor.Array.contains(layers, feature.layer) && layer) {
				layers.push(feature.layer);
			}
			
			if(__features__) {
				for(var j = 0; j < __features__.length; j++) {
					__features__[j].geometry.move(offsetX, offsetY);
				}
			}
		}
		
		for(var i = 0; i < layers.length; i++) {
			if(layers[i]) {
				layers[i].redraw();
			}
		}
		layers = null;
		this.layer.redraw();
		
		this.locked = false;
	},
	
	dragend: function(xy) {
//		console.log("弹起: x: " + xy.x + ", y: " + xy.y);
	},
	
	select: function(feature) {
		var pen1 = new Monitor.Pen({
			stroke: "#4a86e8",
			strokeThickness: 1
		});
		
		var pen2 = new Monitor.Pen({
			fill: "#4a86e8"
		});
		var size = 10;
		var x = feature.geometry.x;
		var y = feature.geometry.y;
		var width = feature.geometry.width;
		var height = feature.geometry.height;
		
		var g0 = new Monitor.Geometry.Rectangle({
			x: x, y: y, width: width, height:height,pen: pen1
		});
		var f0 = new Monitor.Feature.Vector(g0);
		
		var g1 = new Monitor.Geometry.Rectangle({
			x: x - size / 2, y: y - size / 2, width: size, height:size,pen: pen2
		});
		var f1 = new Monitor.Feature.Vector(g1);
		
		var g2 = new Monitor.Geometry.Rectangle({
			x: x + width - size / 2, y: y - size / 2, width: size, height:size,pen: pen2
		});
		var f2 = new Monitor.Feature.Vector(g2);
		
		var g3 = new Monitor.Geometry.Rectangle({
			x: x + width - size / 2, y: y + height - size / 2, width: size, height:size,pen: pen2
		});
		var f3 = new Monitor.Feature.Vector(g3);
		
		var g4 = new Monitor.Geometry.Rectangle({
			x: x - size / 2, y: y + height - size / 2, width: size, height:size,pen: pen2
		});
		var f4 = new Monitor.Feature.Vector(g4);
		
		feature.__features__ = [f0, f1, f2, f3, f4];
		
		this.layer.addFeatures(feature.__features__);
		this.selectedFeatures.push(feature);
	},
	
	unselect: function(feature) {
		var features = feature.__features__;
		if(features) {
			this.layer.removeFeatures(features);
		}
		feature.__features__.length = 0;
		delete feature.__features__;
		Monitor.Array.remove(this.selectedFeatures, feature);
	},
	
	unselectAll: function(exceptFeature) {
		this.locked = true;
		var feature;
		var features;
		var num = this.selectedFeatures.length;
		while(num--) {
			feature = this.selectedFeatures[num];
			if(exceptFeature != feature) {
				features = feature.__features__;
				if(features) {
					this.layer.removeFeatures(features);
					feature.__features__.length = 0;
					delete feature.__features__;
				}
				this.selectedFeatures.splice(num, 1);
			}
		}	
		this.locked = false;
	},
	
	activate: function() {
		var ret = Monitor.Control.prototype.activate.apply(this, arguments)
		if(ret && this.map) {
			this.map.addLayer(this.layer);
		}
		return ret;
	},
	
	deactivate: function() {
		var ret = Monitor.Control.prototype.deactivate(this, arguments)
		if(ret && this.map) {
			this.map.removeLayer(this.layer);
		}
		return ret;
	},
	
	CLASS_NAME: "Monitor.Control.ModifyFeature"
});