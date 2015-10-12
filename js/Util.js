Monitor.Util.applyDefaults = function (to, from) {
    to = to || {};
    var fromIsEvt = typeof window.Event == "function"
                    && from instanceof window.Event;

    for (var key in from) {
        if (to[key] === undefined ||
            (!fromIsEvt && from.hasOwnProperty
             && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
            to[key] = from[key];
        }
    }
    if(!fromIsEvt && from && from.hasOwnProperty
       && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
        to.toString = from.toString;
    }
    
    return to;
};

Monitor.Util.getParameters = function(url, options) {
    options = options || {};
    url = (url === null || url === undefined) ? window.location.href : url;

    var paramsString = "";
    if (url.indexOf("?") != -1) {
        var start = url.indexOf('?') + 1;
        var end = url.indexOf("#") != -1 ?
                    url.indexOf('#') : url.length;
        paramsString = url.substring(start, end);
    }

    var parameters = {};
    var pairs = paramsString.split(/[&;]/);
    for(var i=0, len=pairs.length; i<len; ++i) {
        var keyValue = pairs[i].split('=');
        if (keyValue[0]) {

            var key = keyValue[0];
            try {
                key = decodeURIComponent(key);
            } catch (err) {
                key = unescape(key);
            }
            
            // being liberal by replacing "+" with " "
            var value = (keyValue[1] || '').replace(/\+/g, " ");

            try {
                value = decodeURIComponent(value);
            } catch (err) {
                value = unescape(value);
            }
            
            // follow OGC convention of comma delimited values
            if (options.splitArgs !== false) {
                value = value.split(",");
            }

            //if there's only one value, do not return as array                    
            if (value.length == 1) {
                value = value[0];
            }                
            
            parameters[key] = value;
         }
     }
    return parameters;
};

Monitor.Util.createUrlObject = function(url, options) {
    options = options || {};

    if(!(/^\w+:\/\//).test(url)) {
        var loc = window.location;
        var port = loc.port ? ":" + loc.port : "";
        var fullUrl = loc.protocol + "//" + loc.host.split(":").shift() + port;
        if(url.indexOf("/") === 0) {
            // full pathname
            url = fullUrl + url;
        } else {
            // relative to current path
            var parts = loc.pathname.split("/");
            parts.pop();
            url = fullUrl + parts.join("/") + "/" + url;
        }
    }
  
    if (options.ignoreCase) {
        url = url.toLowerCase(); 
    }

    var a = document.createElement('a');
    a.href = url;
    
    var urlObject = {};
    
    urlObject.host = a.host.split(":").shift();

    urlObject.protocol = a.protocol;  

    if(options.ignorePort80) {
        urlObject.port = (a.port == "80" || a.port == "0") ? "" : a.port;
    } else {
        urlObject.port = (a.port == "" || a.port == "0") ? "80" : a.port;
    }

    urlObject.hash = (options.ignoreHash || a.hash === "#") ? "" : a.hash;  
    
    var queryString = a.search;
    if (!queryString) {
        var qMark = url.indexOf("?");
        queryString = (qMark != -1) ? url.substr(qMark) : "";
    }
    urlObject.args = Monitor.Util.getParameters(queryString,
            {splitArgs: options.splitArgs});

    return urlObject; 
};

Monitor.Util.isEquivalentUrl = function(url1, url2, options) {
    options = options || {};

    Monitor.Util.applyDefaults(options, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true,
        splitArgs: false
    });

    var urlObj1 = Monitor.Util.createUrlObject(url1, options);
    var urlObj2 = Monitor.Util.createUrlObject(url2, options);

    for(var key in urlObj1) {
        if(key !== "args") {
            if(urlObj1[key] != urlObj2[key]) {
                return false;
            }
        }
    }

    for(var key in urlObj1.args) {
        if(urlObj1.args[key] != urlObj2.args[key]) {
            return false;
        }
        delete urlObj2.args[key];
    }
    for(var key in urlObj2.args) {
        return false;
    }
    
    return true;
};