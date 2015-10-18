
Monitor.Control.DragPan =  Monitor.Class(Monitor.Control, {
	
	init: function(options) {
		Monitor.	Control.prototype.init.apply(this, arguments);
		
		this.handler = new Monitor.Handler.Drag(this, {
			start: this.panMapStart,
			move: this.panMap,
			end: this.panMapDone
		});
	},
	
	panMapStart: function(xy) {
		console.dir(xy);
		console.info("开始移动地图");
	},
	
	panMap: function(xy) {
		console.dir(xy);
		console.info("移动地图");
		console.dir(xy);
	},
	
	panMapDone: function(xy) {
		console.dir(xy);
		console.info("停止移动地图");
	},
	
	CLASS_NAME: "Monitor.Control.DragPan"
});