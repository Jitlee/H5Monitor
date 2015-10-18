Monitor.Renderer = Monitor.Class({
	layer: null,
	canvas: null,
	context: null,
	init: function(layer, options) {
		this.layer = layer;
		
		this.canvas =  Monitor.Element.create("canvas", {
			style: {
				
			}
		});
		
		layer.div.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
	},
	
	updateSize: function() {
		var rect = this.layer.div.getBoundingClientRect();
		this.canvas.width = rect.width;
		this.canvas.height = rect.height;	
	},
	
	setOrigin: function(x, y) {
		this.originX = x;
		this.originY = y;
	},
	
	setStyle: function(pen) {
		this.context.fillStyle = pen.fill;
		this.context.strokeStyle = pen.stroke;
		this.context.lineWidth = pen.strokeThickness;
	},
	
	eraseFeatures: function(features) {
		if(!Monitor.Util.isArray(features)) {
			features = [features];
		}
		var bounds;
		for(var i = 0; i < features.length; i++) {
			bounds = features[i].geometry.getBounds();
			this.clear(bounds.left, bounds.top, bounds.width, bounds.height);
		}
	},
	
	erase: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);	
	},
	
	clear: function(x, y, width, height) {
		this.context.beginPath();
		this.context.clearRect(x, y, width, height);
	},
	
	drawRectangle: function(pen, x, y, width, height) {
		this.context.save();
		this.setStyle(pen);
		this.context.beginPath();
		this.context.rect(this.originX + x, this.originY + y, width, height);
		if(pen.fill) {
			this.context.fill();
		}
		if(pen.stroke) {
			this.context.stroke();
		}
		
		this.context.restore();
	},
	
	drawLine: function(pen, x1, y1, x2, y2) {
		this.context.save();
		this.setStyle(pen);
		this.context.beginPath();
		this.context.moveTo(this.originX + x1, this.originY + y1);
		this.context.lineTo(this.originX + x2, this.originY + y2);
		this.context.restore();
	},
	
	drawCircle: function(pen, x, y, r) {
		this.context.save();
		this.setStyle(pen);
		this.context.beginPath();
		this.context.arc(this.originX + x, this.originY + y, r, 0, 2*Math.PI);
		if(pen.fill) {
			this.context.fill();
		}
		if(pen.stroke) {
			this.context.stroke();
		}
		
		this.context.restore();
	},
	
	CLASS_NAME: "Monitor.Renderer"
});