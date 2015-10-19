Temprary = Monitor.Class(Monitor.Geometry, {
	min: 0,
	max: 100,
	value: 0,
	
	init: function(options) {
		Monitor.Geometry.prototype.init.apply(this, arguments);
	},
	
	draw: function(renderer) {
		Monitor.Geometry.prototype.draw.apply(this, arguments);
		var w = this.width;
		var h = this.height;
		
		var style1 = { stroke: "#333", strokeThickness: 1 };
		var style2 = { stroke: "#eee", strokeThickness: 1 };
		
		renderer.drawRectangle({ fill: "#ccc" }, 0,0,w,h);
		
		renderer.drawLine({ stroke: "#fff", strokeThickness: 5 },0,0,w,0);
		renderer.drawLine({ stroke: "#fff", strokeThickness: 5 },0,0,0,h);
		renderer.drawLine({ stroke: "#aaa", strokeThickness: 5 },w,0,w,h);
		renderer.drawLine({ stroke: "#aaa", strokeThickness: 5 },0,h,w,h);
		
		var valueScale = this.value / (this.max-this.min)
		renderer.drawRectangle({ fill: "red" }, w*0.2,h*0.12 +  h*0.68 * (1-valueScale),w*0.1,h*0.68 * valueScale);
		
		renderer.drawLine(style1,w*0.2,h*0.12,w*0.2,h*0.8);
		renderer.drawLine(style1,w*0.2,h*0.12,w*0.3,h*0.12);
		renderer.drawLine(style2,w*0.3,h*0.12,w*0.3,h*0.8);
		renderer.drawLine(style2,w*0.2,h*0.8,w*0.3,h*0.8);
		
		var x1 = w*0.35,x2 = w*0.45, x3 = w*0.55;
		var y1 = h*0.12,y2 = y1+2;
		var preHeight = h*0.68 / 20.0;
		for(var i = 0; i < 21; i++) {
			renderer.drawLine(style1,x1,y1 + preHeight*i,i%4==0?x3:x2,y1 + preHeight*i);
			renderer.drawLine(style2,x1,y2 + preHeight*i,i%4==0?x3:x2,y2 + preHeight*i);
		}
		
		renderer.drawText({ fill:"#333", font: w*0.08+ "px 宋体" }, "指示表", w*0.5, h * 0.90, -0.5, 0.5);
		
		this.getBounds();
	},
	
	CLASS_NAME: "Temprary"
});
