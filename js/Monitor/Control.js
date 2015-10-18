Monitor.Control = Monitor.Class({
	map: null,
	active:false,
	handler: null,
	init: function(options) {
		Monitor.Util.extend(this, options);
	},
	
	setMap: function(map) {
		this.map = map;
		if(this.handler) {
			this.handler.setMap(map);
		}
	},
	
	activate: function() {
		if(this.active) {
			return false;
		}
		
		if(this.handler) {
			this.handler.activate();
		}
		
		this.active = true;
		return true;
	},
	
	deactivate: function() {
		if(!this.active) {
			return false;
		}
		
		if(this.handler) {
			this.handler.deactivate();
		}
		
		this.active = false;
		return true;
	},
	
	CLASS_NAME: "Monitor.Control"
});