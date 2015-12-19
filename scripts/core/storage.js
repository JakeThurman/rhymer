define(function () {
    "use strict";
		
	/*
	 * Provides safe/expanded access to window.localStorage
	 *
	 * PARAMS:
	 *   @appName: <String>      The name of the current application to prefix storage properties with.
	 *   @mode:    <StorageMode> Data access mode. Pass Storage.READ_ONLY for a readOnly instance.
	 *
	 * METHODS:
	 *   set   (propName : String, value : TValue) -- Requies .ADMIN or .WRITE_ONLY mode
	 *   get   (propName : String) : TValue        -- Requies .ADMIN or .READ_ONLY mode
	 *   clear (propName : String)                 -- Requies .ADMIN mode
	 * 
	 * EXAMPLE:
	 *   var dataAdmin  = new Storage("my-app", Storage.ADMIN);
	 *   var dataWriter = new Storage("my-app", Storage.WRITE_ONLY);
	 *   var dataAccess = new Storage("my-app", Storage.READ_ONLY);
	 *
	 */
	function Storage(appName, mode) {
		if (!appName || typeof appName !== "string")
			throw new TypeError("@appname is required and must be a string. Was: " + appName);
		
		if (mode !== Storage.READ_ONLY && mode !== Storage.WRITE_ONLY && mode !== Storage.ADMIN)
			throw new TypeError("@mode is required and must be Storage.READ_ONLY, Storage.WRITE_ONLY, or Storage.ADMIN. Was: " + mode + ", appName: " + appName);
		
		function formatName(propName) {
			return appName + "-" + propName;
		}
		
		return {
			set: function (propName, value) {
				if (mode === Storage.READ_ONLY)
					throw new Error("Atempted write on a read only Storage object. appname: " + appName + " propName: " + propName + ", value: " + value);
				
				if (supportsHtml5Storage())
					localStorage[formatName(propName)] = JSON.stringify(value);
				
			},
			get: function (propName) {
				if (mode === Storage.WRITE_ONLY)
					throw new Error("Atempted read on a write only Storage object. appname: " + appName + " propName: " + propName);
				
				propName = formatName(propName);
				
				if (supportsHtml5Storage() && localStorage[propName] && localStorage[propName] !== "undefined")
					return JSON.parse(localStorage[propName]);
				
			},
			clear: function (propName) {
				if (mode !== Storage.ADMIN)
					throw new Error("Atempted clear on a non-admin Storage object is illegal. appname: " + appName + " propName: " + propName);				
				
				if (supportsHtml5Storage())
					delete localStorage[formatName(propName)];
				
			},
		};
	};
	
	function supportsHtml5Storage() {
        try { 
			return 'localStorage' in window && window.localStorage != null; 
		}
		catch (e) { 
			return false; 
		}
    }
	
	// Static Constant value
	Storage.READ_ONLY  = 0;
	Storage.WRITE_ONLY = 1;
	Storage.ADMIN      = 2;
	
	return Storage;
});