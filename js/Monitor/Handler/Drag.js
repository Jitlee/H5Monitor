
Monitor.Handler.Drag = Monitor.Class(Monitor.Handler, {
	started: false,
	dragging: false,
	start: null, 
	last: null,
	init: function(control, callbacks,  options) {
		Monitor.Handler.prototype.init.apply(this, arguments);
	},
	
	dragstart: function(evt) {
		this.dragging = false;
		if(this.checkModifiers(evt)) {
			this.started = true;
			this.start = evt.xy;
			this.last = evt.xy;
			this.callback("start", evt.xy);
		} else {
			this.started = false;
			this.start = null;
			this.last = null;
		}
	},
	
	dragmove: function(evt) {
		this.dragging = false;
		if(this.started && (evt.xy.x != this.last.x
			|| evt.xy.y != this.last.y)) {
			this.dragging = true;
			this.callback("move", evt.xy);
			this.last = evt.xy;
		}
		return true;
	},
	
	dragend: function(evt) {
		if(this.started) {
			this.started = false;
			this.dragging = false;
			this.callback("end", evt.xy);
		}
	},
	
	mousedown: function(evt) {
		this.dragstart(evt);
	},
	
	mousemove: function(evt) {
		this.dragmove(evt);
	},
	
	mouseup: function(evt) {
		this.dragend(evt);
	},
	
	CLASS_NAME: "Monitor.Handler.Drag"
});