Monitor.Feature = Monitor.Class({
	id: null,
	layer: null,
	modifyLayer: null,
	init: function() {
		this.id = Monitor.Util.createUniqueID(this.CLASS_NAME);
	},
	CLASS_NAME: "Monitor.Feature"
});