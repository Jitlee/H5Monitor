
Monitor.Control.ModifyFeature =  Monitor.Class(Monitor.Control, {
	layer: null,
	layers: null,
	selectedFeature: null,
	selectedFeatures: null,
	locked: false,
	knobSize: 20,
	resizeFeature:null,
	events: null,
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
		
		this.events = new Monitor.Events(this);
	},
	
	dragstart: function(xy) {
		if(this.locked) {
			return false;
		}
		
		var feature = this.layer.getFeatureFromXY(xy);
		if(!feature) {
			var len1 = this.map.layers.length;
			for(var i = len1 - 1; !feature && i > -1; i--) {
				var len2 = this.layers.length;
				for(var j = 0; j < len2; j++) {
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
			
			if(!feature) {
				this.events.trigger("featureunselected");
				return;
			}
			if(!Monitor.Array.contains(this.selectedFeatures, feature)) {
				this.select(feature);
				this.events.trigger("featureselected", feature);
			} else {
				console.error("有重复选择控件");
			}
		} else {
			feature = feature.__parent__;
		}
		
		var layers = [];
		var selectedLength = this.selectedFeatures.length;
		var selectedFeature;
		for(var i = 0; i < selectedLength; i++) {
			selectedFeature = this.selectedFeatures[i];
			selectedFeature._layer = selectedFeature.layer;
			selectedFeature.layer = this.layer;
			if(!Monitor.Array.contains(layers, selectedFeature.layer)) {
				layers.push(selectedFeature._layer);
			}
		}
		
		this.layer.renderer.erase();
		for(var i = 0; i < layers.length; i++) {
			layers[i].redraw();
		}
		
		var selectedLength = this.selectedFeatures.length;
		var __len__;
		var __features__;
		for(var i = 0; i < selectedLength; i++) {
			__features__ = this.selectedFeatures[i].__features__;
			__len__ = __features__.length;
			for(var j = 0; j < __len__; j++) {
				__features__[j].draw();
			}
		}
		
		this.resizeFeature = null;
		__features__ = feature.__features__;
		__len__ = __features__.length;
		for(var i = __len__ - 1; i > 0; i--) {
			if(__features__[i].geometry.isPointInRange(xy.x, xy.y)) {
				this.resizeFeature = __features__[i];
				break;
			}
		}
	},
	
	dragmove: function(xy) {
		this.locked = true;
		if(this.resizeFeature) {
			this.resizeFeatures(xy);
		} else {
			this.moveFeatures(xy);
		}
		
		this.locked = false;
	},
	
	dragend: function(xy) {
		var layers = [];
		for(var i = 0; i < this.selectedFeatures.length; i++) {
			this.selectedFeatures[i].layer = this.selectedFeatures[i]._layer;
			if(!Monitor.Array.contains(layers, this.selectedFeatures[i].layer)) {
				layers.push(this.selectedFeatures[i].layer);
			}
		}
		
		for(var i = 0; i < layers.length; i++) {
			layers[i].redraw();
		}
		this.layer.redraw();
		this.resizeFeature = null;
	},
	
	moveFeatures: function(xy) {
		var offsetX = xy.x - this.handler.last.x;
		var offsetY = xy.y - this.handler.last.y;
		var features = this.selectedFeatures;
		var len = features.length;
		var __features__;
		var __len__;
		var feature;
		this.layer.renderer.erase();
		for(var i = 0; i < len; i++) {
			feature = features[i];
			feature.geometry.move(offsetX, offsetY);
			feature.draw();
			__features__ = feature.__features__;
			__len__ = __features__.length;
			
			this.events.trigger("featuremodified", feature);
			for(var j = 0; j < __len__; j++) {
				__features__[j].geometry.move(offsetX, offsetY);
				__features__[j].draw();
			}
		}
	},
	
	resizeFeatures: function(xy) {
		var parent = this.resizeFeature.__parent__;
		var resizeMode = this.resizeFeature.__index__;
		var offsetX = 0;
		var offsetY = 0;
		var offsetWidth = xy.x - this.handler.last.x;
		var offsetHeight = xy.y - this.handler.last.y;
		var isSquare = true; // 正方形的
		if(isSquare) {
			var fitChange;
			switch(resizeMode) {
				case 1:
					fitChange = (offsetWidth + offsetHeight) * 0.5;
					offsetX = offsetY = fitChange; 
					offsetWidth = offsetHeight = -offsetX; 
					break;
				case 2:
					fitChange = (offsetWidth - offsetHeight) * 0.5;
					offsetHeight = offsetWidth = fitChange;
					offsetY = -fitChange;
					break;
				case 3:
					fitChange = (offsetWidth + offsetHeight) * 0.5;
					offsetWidth = offsetHeight = fitChange; 
					break;
				case 4:
					fitChange = (offsetHeight - offsetWidth) * 0.5;
					offsetHeight = offsetWidth = fitChange;
					offsetX = -fitChange;
					break;
				default:
					break;
			}
		} else {
			var isLeft = xy.x < (parent.geometry.x + parent.geometry.width / 2);
			var isTop = xy.y < (parent.geometry.y + parent.geometry.height / 2);
			if(isLeft) {
				offsetX = offsetWidth;
				offsetWidth = -offsetX;
			}
			if(isTop) {
				offsetY = offsetHeight;
				offsetHeight = -offsetY;
			}
		}
		
		
		var features = this.selectedFeatures;
		var len = features.length;
		var __features__;
		var feature;
		this.layer.renderer.erase();
		var _offsetX, _offsetY, _offsetWidth, _offsetHeight;
		for(var i = 0; i < len; i++) {
			feature = features[i];
			_offsetX = 0, _offsetY = 0, _offsetWidth = 0, _offsetHeight = 0;
			if(feature.geometry.width + offsetWidth > feature.geometry.minWidth
				&& feature.geometry.height + offsetHeight > feature.geometry.minHeight) {
				_offsetX = offsetX, _offsetY = offsetY, _offsetWidth = offsetWidth, _offsetHeight = offsetHeight;
			}
				
			feature.geometry.resize(_offsetWidth, _offsetHeight);
			feature.geometry.move(_offsetX, _offsetY);
			feature.draw();
			this.events.trigger("featuremodified", feature);
			__features__ = feature.__features__;
			__features__[0].geometry.resize(_offsetWidth, _offsetHeight);
			__features__[0].geometry.move(_offsetX, _offsetY);
			__features__[0].draw();
			__features__[1].geometry.move(_offsetX, _offsetY);
			__features__[1].draw();
			__features__[2].geometry.move(_offsetWidth + _offsetX, _offsetY);
			__features__[2].draw();
			__features__[3].geometry.move(_offsetWidth + _offsetX, _offsetHeight + _offsetY);
			__features__[3].draw();
			__features__[4].geometry.move(_offsetX, _offsetHeight + _offsetY);
			__features__[4].draw();
		}
	},
	
	select: function(feature) {
		var pen1 = new Monitor.Pen({
			stroke: "#4a86e8",
			strokeThickness: 1
		});
		
		var pen2 = new Monitor.Pen({
			fill: "#4a86e8"
		});
		var size = this.knobSize;
		var x = feature.geometry.x;
		var y = feature.geometry.y;
		var width = feature.geometry.width;
		var height = feature.geometry.height;
		
		var g0 = new Monitor.Geometry.Rectangle({
			x: x, y: y, width: width, height:height,pen: pen1
		});
		var f0 = new Monitor.Feature.Vector(g0);
		f0.__parent__ = feature;
		f0.__index__ = 0;
		
		
		var g1 = new Monitor.Geometry.Circle({ // 左上
			x: x - size / 2, y: y - size / 2, width: size, height:size,pen: pen2
		});
		var f1 = new Monitor.Feature.Vector(g1);
		f1.__parent__ = feature;
		f1.__index__ = 1;
		
		var g2 = new Monitor.Geometry.Circle({ // 右上
			x: x + width - size / 2, y: y - size / 2, width: size, height:size,pen: pen2
		});
		var f2 = new Monitor.Feature.Vector(g2, { index:2 });
		f2.__parent__ = feature;
		f2.__index__ = 2;
		
		var g3 = new Monitor.Geometry.Circle({ // 右下
			x: x + width - size / 2, y: y + height - size / 2, width: size, height:size,pen: pen2
		});
		var f3 = new Monitor.Feature.Vector(g3, { index:3 });
		f3.__parent__ = feature;
		f3.__index__ = 3;
		
		var g4 = new Monitor.Geometry.Circle({ // 左下
			x: x - size / 2, y: y + height - size / 2, width: size, height:size,pen: pen2
		});
		var f4 = new Monitor.Feature.Vector(g4, { index:4 });
		f4.__parent__ = feature;
		f4.__index__ = 4;
		
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