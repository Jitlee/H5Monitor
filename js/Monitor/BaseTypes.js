Monitor.String = {
	trim: function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
   },
   camelize: function(str) {
    		return str.replace(/(\-[A-Za-z])/g, function(match) {
        		return match.toUpperCase().replace('-','');
    		});
    }
};

Monitor.Array = {
	contains: function(arr, entry) {
		return entry && arr && arr.indexOf(entry) != -1;
	},
	remove: function(arr, entry) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] == entry) {
				arr.splice(i, 1);
			}
		}
	}
};

Monitor.Function = {
	
    bind: function(func, object) {
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },
    
    bindAsEventListener: function(func, object) {
        return function(event) {
            return func.call(object, event || window.event);
        };
    },
    
    False : function() {
        return false;
    },
    
    True : function() {
        return true;
    },
    
    Void: function() {}

};