(function() {
	var scripts = [
		"js/Monitor/SingleFile.js",
		"js/Monitor/BaseTypes.js",
		"js/Monitor/BaseTypes/Class.js",
		"js/Monitor/BaseTypes/Element.js",
		"js/Monitor/Util.js",
		"js/Monitor/Events.js",
		
		"js/Monitor/Map.js",
		
		"js/Monitor/Render.js",
		"js/Monitor/Pen.js",
		
		"js/Monitor/Layer.js",
		"js/Monitor/Layer/Vector.js",
		
		"js/Monitor/Feature.js",
		"js/Monitor/Feature/Vector.js",
		
		"js/Monitor/Geometry.js",
		"js/Monitor/Geometry/Rectangle.js",
		"js/Monitor/Geometry/Circle.js",
		
		"js/Monitor/Handler.js",
		"js/Monitor/Handler/Drag.js",
		
		"js/Monitor/Control.js",
		"js/Monitor/Control/DragPan.js",
		"js/Monitor/Control/ModifyFeature.js",
		
		// 组态控件
		"js/Ext/Geometry/DLBiaoPan.js",
		"js/Ext/Geometry/Temprary.js",
	];
	if(exports){ // Node.js 打包使用
		exports.getScripts = function() {return scripts;}
		return;
	} else { // 开发使用
		var head = document.getElementsByTagName('HEAD').item(0); 
		var scriptTags = [];
		for(var i =0, len = scripts.length; i < len; i++) {
		    scriptTags.push("<script type=\"text/javascript\" src=\"");
		    scriptTags.push(scripts[i]);
		    scriptTags.push("\"></script>");
		}
		document.write(scriptTags.join(""));
	}
})();
