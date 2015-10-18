Monitor.Handler = Monitor.Class({
	control: null, 
	callbacks: null,
	active: false,
	evt: null,
	init: function(control, callbacks, options) {
		Monitor.Util.extend(this, options);
        this.control = control;
        this.callbacks = callbacks;
        
        var map = this.map || control.map;
        if (map) {
            this.setMap(map); 
        }
	},
	
	setMap: function(map) {
		this.map = map;	
	},
	
	activate: function() {
		if(this.active) {
			return false;
		}
		var events = Monitor.Events.prototype.BROWSER_EVENTS;
		for(var i = 0; i < events.length; i++) {
			if(this[events[i]]) {
				this.register(events[i], this[events[i]]);
			}
		}
		
		this.active = true;
		return this.active;
	},
	
	deactivate: function() {
		if(!this.active) {
			return false;
		}
		var events = Monitor.Events.prototype.BROWSER_EVENTS;
		for(var i = 0; i < events.length; i++) {
			if(this[events[i]]) {
				this.unregister(events[i], this[events[i]]);
			}
		}
		
		this.active = false;
		return true;
	},
	
	register: function(type, func) {
		this.map.events.register(type, this, func);
		this.map.events.register(type, this, this.setEvent);
	},
	
	unregister: function(type, func) {
		this.map.events.unregister(type, this, func);
		this.map.events.unregister(type, this, this.setEvent);
	},
	
	setEvent: function(evt) {
		this.evt = evt;
		return true;
	},
	
	callback: function(type, evt) {
		if(this.callbacks && this.callbacks[type]) {
			this.callbacks[type].call(this.control, evt);
		}
	},

    checkModifiers: function (evt) {
        if(this.keyMask == null) {
            return true;
        }
        var keyModifiers =
            (evt.shiftKey ? Monitor.Handler.MOD_SHIFT : 0) |
            (evt.ctrlKey  ? Monitor.Handler.MOD_CTRL  : 0) |
            (evt.altKey   ? Monitor.Handler.MOD_ALT   : 0) |
            (evt.metaKey  ? Monitor.Handler.MOD_META  : 0);
        return (keyModifiers == this.keyMask);
    },
	
	CLASS_NAME: "Monitor.Handler"
});

Monitor.Handler.MOD_NONE  = 0;
Monitor.Handler.MOD_SHIFT = 1;
Monitor.Handler.MOD_CTRL  = 2;
Monitor.Handler.MOD_ALT   = 4;
Monitor.Handler.MOD_META  = 8;