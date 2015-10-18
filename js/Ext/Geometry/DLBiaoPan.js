DLBiaoPan = Monitor.Class(Monitor.Geometry, {
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
		
		renderer.drawRectangle({ fill: "#ddd" }, 0,0,w,h);
		
		renderer.drawLine({ stroke: "#eee", strokeThickness: 3 },0,0,w,0);
		renderer.drawLine({ stroke: "#eee", strokeThickness: 3 },0,0,0,h);
		renderer.drawLine({ stroke: "#aaa", strokeThickness: 3 },w,0,w,h);
		renderer.drawLine({ stroke: "#aaa", strokeThickness: 3 },0,h,w,h);
		
		renderer.drawCircle({ fill: "#333", stroke:"#bbb", strokeThickness: 0.02*w }, w*0.08, h*0.08, w*0.03);
		renderer.drawCircle({ fill: "#333", stroke:"#bbb", strokeThickness: 0.02*w }, w*0.92, h*0.08, w*0.03);
		renderer.drawCircle({ fill: "#333", stroke:"#bbb", strokeThickness: 0.02*w }, w*0.08, h*0.92, w*0.03);
		renderer.drawCircle({ fill: "#333", stroke:"#bbb", strokeThickness: 0.02*w }, w*0.92, h*0.92, w*0.03);
		
		renderer.drawCircle({ fill: "#274e13", stroke:"#333", strokeThickness: 1 }, w*0.5, h*0.5, w*0.41);
		renderer.drawCircle({ fill: "#fff", stroke:"#333", strokeThickness: 1 }, w*0.5, h*0.5, w*0.38);
		
		renderer.drawCircle({ fill: "#333" }, w*0.5, h*0.5, w*0.02);
		
		renderer.drawText({ fill:"#333", font: w*0.08+ "px 宋体" }, "仪表", w*0.5, h * 0.75, -0.5, 0.5);
		
		var start = 0.75*Math.PI;
		var degree, preDegree;
		var style = { stroke:"#333", strokeThickness: 0.008*w };
		var cos,sin;
		{
			preDegree = 1.5*Math.PI / 20.0;
			for(var i = 0; i < 21; i++) {
				degree = start + preDegree * i;
				sin = Math.sin(degree);
				cos = Math.cos(degree);
				renderer.drawLine(style,w*0.5 + w*0.32*cos,h*0.5+h*0.32*sin,w*0.5 + w*0.36*cos,h*0.5+h*0.36*sin);
			}
		}
		{
			var textStyle = { fill:"#333", font: w*0.05+ "px 宋体" };
			preDegree = 1.5*Math.PI / 10.0;
			var perValue = (this.max - this.min) / 10.0;
			style.strokeThickness = 0.01*w;
			for(var i = 0; i < 11; i++) {
				degree = start + preDegree * i;
				sin = Math.sin(degree);
				cos = Math.cos(degree);
				renderer.drawLine(style,w*0.5 + w*0.32*cos,h*0.5+h*0.32*sin,w*0.5 + w*0.36*cos,h*0.5+h*0.36*sin);
				renderer.drawText(textStyle, i * perValue, w*0.5+w*0.24*cos, h*0.5+h*0.24*sin, -0.5, 0.5);
			}
		}
		
		style.stroke = "red";
		style.strokeThickness = 0.02*w;
		degree = start + 1.5*Math.PI * this.value / (this.max - this.min);
		sin = Math.sin(degree);
		cos = Math.cos(degree);
		renderer.drawLine(style,w*0.5,h*0.5,w*0.5 + w*0.30*cos,h*0.5+h*0.30*sin);
		
		this.getBounds();
	},
	
	CLASS_NAME: "DLBiaoPan"
});
