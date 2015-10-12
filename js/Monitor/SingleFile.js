var Monitor = {
	VERSION_NUMBER: "Development 0.1",
	
	_getScriptLocation: (function() {
        var r = new RegExp("(^|(.*?\\/))(Monitor[^\\/]*?\\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return (function() { return l; });
    })(),
    
    ImgPath: ""
};
