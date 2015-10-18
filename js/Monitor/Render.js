Monitor.Renderer = Monitor.Class({
	layer: null,
	canvas: null,
	context: null,
	matrix: null,
	init: function(layer, options) {
		this.layer = layer;
		
		this.canvas =  Monitor.Element.create("canvas", {
			style: {
				
			}
		});
		
		layer.div.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d");
		this.matrix = [1,0,0,1,0,0];
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
		this.context.font = pen.font;
	},
	
	setTransform: function(matrix) {
		if(!matrix) {
			matrix = this.matrix;
		}
		this.context.setTransform(matrix[0],matrix[1],matrix[2],matrix[3],matrix[4] + this.originX,matrix[5] + this.originY);
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
	
	drawRectangle: function(pen, x, y, width, height, matrix) {
		this.context.save();
		this.setStyle(pen);
		this.context.beginPath();
		this.setTransform(matrix);
		this.context.rect(x, y, width, height);
		if(pen.fill) {
			this.context.fill();
		}
		if(pen.stroke) {
			this.context.stroke();
		}
		
		this.context.restore();
	},
	
	drawLine: function(pen, x1, y1, x2, y2, matrix) {
		this.context.save();
		this.setStyle(pen);
		this.context.beginPath();
		this.setTransform(matrix);
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
		this.context.restore();
	},
	
	drawCircle: function(pen, x, y, r, matrix) {
		this.context.save();
		this.setStyle(pen);
		this.context.beginPath();
		this.setTransform(matrix);
		this.context.arc(x, y, r, 0, 2*Math.PI);
		if(pen.fill) {
			this.context.fill();
		}
		if(pen.stroke) {
			this.context.stroke();
		}
		
		this.context.restore();
	},
	
	drawText: function(pen, text, x, y, alginX, alginY, matrix) {
		this.context.save();
		this.setStyle(pen);
		var measure = this.context.measureText(text);
		x += measure.width * alginX;
		y += window.parseInt(/\d+px/i.exec(this.context.font),10) * alginY;
		this.context.beginPath();
		this.setTransform(matrix);
		if(pen.fill) {
			this.context.fillText(text, x, y);
		}
		if(pen.stroke) {
			this.context.strokeText(text, x, y);
		}
		
		this.context.restore();
	},
	
	CLASS_NAME: "Monitor.Renderer"
});