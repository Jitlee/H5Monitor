
Monitor.Event = {
	bind: function(element, type, func, useCapture){
		if(!this.listeners) {
			this.listeners = {};
		}
		if(!element.__eventCatchId__) {
			var idPrevfix = "__eventCatchId__";
			if(element.id) {
				idPrevfix = element.id + idPrevfix;
			}
			element.__eventCatchId__ = Monitor.Util.createUniqueID(idPrevfix);
		}
		var catchId = element.__eventCatchId__;
		var listeners = this.listeners[catchId];
		if(listeners) {
			for(var i = 0,len = listeners.length; i < len; i++) {
				var listener = listeners[i];
				if(listener.type == type &&
					listener.func == func &&
					listener.useCapture == useCapture) {
					return;
				}
			}
		} else {
			listeners = [];
			this.listeners[catchId] = listeners;
		}
		
		listeners.push({
			element: element,
			type: type,
			func: func,
			useCapture: useCapture
		});
		
		element.addEventListener(type, func, useCapture);
	},
	
	unbind: function(element, type, func, useCapture) {
		var catchId = element.__eventCatchId__;
		var listeners = this.listeners[catchId];
		var hashEntry = false;
		if(listeners) {
			for(var i = 0,len = listeners.length; i < len; i++) {
				var listener = listeners[i];
				if(listener.type == type &&
					listener.func == func &&
					listener.useCapture == useCapture) {
					hashEntry = true;
					listeners.splice(i, 1);
					if(listeners.length == 0) {
						delete Monitor.Event.observers[cacheID];
					}
					break;
				}
			}
		}
		
		if(hashEntry) {
			element.removeEventListener(type, func, useCapture);
		}
	},
	
	unbindElement: function(element) {
		var catchId = element.__eventCatchId__;
		var listeners = this.listeners[catchId];
		if(listeners) {
			var i = listeners.length;
			while(i--) {
				var listener = listeners[i];
				element.removeEventListener(listener.type,listener. observer, listener.useCapture);
			}
			listeners.length = 0;
			delete Monitor.Event.observers[cacheID];
		}
	},
	
	CLASS_NAME: "Monitor.Event"
};

Monitor.Events = Monitor.Class({
	BROWSER_EVENTS: [
		"mousedown", "mouseup", "mousemove"
	],
	
	object: null,
	
	element: null,
	
	options: null,
	
	listeners: null,
	
	includeXY: false,
	
	init: function(object, element, options) {
		Monitor.Util.extend(this, options);
		this.object = object;
		this.listeners = {};
		if(element) {
			this.bindBrowserEventsToElement(element);
		}
	},
	
	bindBrowserEventsToElement: function(element) {
		if(this.element) {
			Monitor.Event.unbindElement(this.element);
		} else {
			this.eventHandler = Monitor.Function.bindAsEventListener(
                this.handleBrowserEvent, this
            );
		}
		
		this.element = element;
		var type;
		for(var i = 0; i < this.BROWSER_EVENTS.length; i++) {
			type = this.BROWSER_EVENTS[i];
			Monitor.Event.bind(element, type, this.eventHandler);
		}
	},

    handleBrowserEvent: function (evt) {
        var type = evt.type
        var listeners = this.listeners[type];
        if(!listeners || listeners.length == 0) {
            return;
        }
        if (this.includeXY) {
	        var touches = evt.touches;
	        var x = 0;
	        var y = 0;
	        if (touches && touches[0]) {
	            var num = touches.length;
	            var touch;
	            for (var i=0; i<num; ++i) {
	                touch = touches[i];
	                x += touch.pageX;
	                y += touch.pageY;
	            }
	            evt.clientX = x / num;
	            evt.clientY = y / num;
	        } else {
	        		x = evt.pageX;
	        		y = evt.pageY;
	        }
            evt.xy = {
            		x: x,
            		y: y
            };
            this.adjustXY(evt.xy);
        } 
        this.trigger(type, evt);
    },
	
	register: function(type, obj, func, priority) {
		if(func) {
			if(obj == null) {
				obj = this.object;
			}
			var listeners = this.listeners[type];
			if(!listeners) {
				listeners = [];
				this.listeners[type] = listeners;
			}
			var listener = { obj: obj, func: func };
			if(priority) {
				listeners.unshift(listener);
			} else {
				listeners.push(listener);
			}
		}
	},
	
	unregister: function(type, obj, func) {
		if(func) {
			if(obj == null) {
				obj = this.object;
			}
			var listeners = this.listeners[type];
			if(listeners) {
				for(var i = 0; i < listeners.length; i++) {
					if(listeners[i].obj == obj && listeners[i].func == func) {
						listeners.splice(i, 1);
        					break;
					}
				}
			}
		}
	},
	
	trigger: function(type, evt) {
		var listeners = this.listeners[type];
		if(!listeners || listeners.length == 0) {
			return undefined;
		}
		if(evt == null) {
			evt = {};
		}
		evt.object = this.object;
		evt.element = this.element;
		if(!evt.type) {
			evt.type = type;
		}
		
		listeners = listeners.slice();
		var continueChain;
		for(var i = 0; i < listeners.length; i++) {
			var listener = listeners[i];
			continueChain = listener.func.call(listener.obj, evt);
			if(continueChain != undefined && continueChain == false) {
				break;
			}
		}
		return continueChain;
	},
	
	adjustXY: function(xy) {
		var bounds = this.element.getBoundingClientRect();
		xy.x -= bounds.left + document.body.scrollLeft;
		xy.y -= bounds.top + document.body.scrollTop;;
	},
	
	CLASS_NAME: "Monitor.Events"
});